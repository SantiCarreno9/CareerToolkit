import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { ResumeTemplateSelectorComponent } from '../resume-template-selector/resume-template-selector.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ResumeService } from '../shared/resume.service';
import { UserService } from '../../user/shared/user.service';
import { ProfileEntryService } from '../../profile-entry/shared/profile-entry.service';
import { UserPersonalInfo } from '../shared/models/userpersonalinfo';
import { UserInfo } from '../../user/shared/models/userinfo';
import { Resume } from '../shared/models/resume';
import { Router } from '@angular/router';
import { ResumeTemplateInfo } from '../shared/models/resume-template';
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ResumeBasicInfoFormComponent } from '../resume-editor/components/resume-basic-info-form/resume-basic-info-form.component';
import { ResumeCreatorPages } from './resume-creator-pages';
import { ResumeBasicInfo } from '../shared/models/basic-resume-info';


@Component({
  selector: 'app-resume-creator',
  imports: [ResumeTemplateSelectorComponent, ResumeBasicInfoFormComponent],
  templateUrl: './resume-creator.component.html',
  styleUrl: './resume-creator.component.scss'
})
export class ResumeCreatorComponent
{
  resumeService = inject(ResumeService);
  userService = inject(UserService);
  profileEntryService = inject(ProfileEntryService);
  router = inject(Router);

  @Output() onResumeCreated = new EventEmitter<Resume>();
  @Output() onCancel = new EventEmitter<void>();

  ResumeCreatorPages = ResumeCreatorPages;
  currentPage: number = 1;
  selectedTemplateId: string = '';
  protected resume: Resume = new Resume();
  // private templateInfo:ResumeTemplateInfo={
  //   id:'',

  // }

  constructor(@Inject(DIALOG_DATA) public data: { quickResume: boolean })
  {
    this.currentPage = data.quickResume ? 1 : 1;
  }

  protected selectTemplate(template: ResumeTemplateInfo): void
  {
    this.selectedTemplateId = template.id;
    this.create();
  }

  protected saveResumeBasicInfo(info: ResumeBasicInfo)
  {
    this.resume.name = info.name;
    this.resume.keywords = info.keywords;
    this.nextPage();
  }

  protected nextPage(): void
  {
    this.currentPage++;
  }

  protected create(): void
  {
    this.userService.getUserInfo().subscribe(res =>
    {
      if (!res.success)
      {
        console.log(res.error)
        return;
      }

      const personalInfo: UserPersonalInfo = this.convertUserInfoToUserPersonalInfo(res.value);
      this.profileEntryService.getProfileEntries().subscribe(res =>
      {
        if (!res.success)
        {
          console.log(res.error);
          return;
        }

        const profileEntries: ProfileEntry[] = res.value ?? [];
        this.resume.userInfo = personalInfo;
        this.resume.profileEntries = profileEntries;
        this.resume.resumeInfo.templateId = this.selectedTemplateId;

        this.resumeService.createResume(this.resume).subscribe(res =>
        {
          if (res.success && res.value)
          {
            this.onResumeCreated.emit(res.value);
          }
        })
      })
    });    
  }

  private convertUserInfoToUserPersonalInfo(userInfo?: UserInfo | null): UserPersonalInfo
  {
    if (userInfo === undefined || userInfo === null)
    {
      return {
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        additionalContactInfo: {}
      }
    }
    return {
      fullName: userInfo.fullName,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      address: userInfo.address,
      additionalContactInfo: userInfo.additionalContactInfo
    };
  }

  protected cancel()
  {
    this.onCancel.emit();
  }
}
