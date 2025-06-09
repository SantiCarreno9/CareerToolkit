import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { ResumeTemplateSelectorComponent } from '../resume-template-selector/resume-template-selector.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ResumeService } from '../shared/resume.service';
import { UserService } from '../../user/shared/user.service';
import { ProfileEntryService } from '../../profile-entry/shared/profile-entry.service';
import { UserPersonalInfo } from '../shared/userpersonalinfo';
import { UserInfo } from '../../user/shared/userinfo';
import { ProfileEntry } from '../../profile-entry/shared/profile-entry';
import { Resume } from '../shared/resume';
import { Router } from '@angular/router';
import { ResumeTemplateInfo } from '../shared/resume-template';


@Component({
  selector: 'app-resume-creator',
  imports: [ResumeTemplateSelectorComponent],
  templateUrl: './resume-creator.component.html',
  styleUrl: './resume-creator.component.scss'
})
export class ResumeCreatorComponent
{
  resumeService = inject(ResumeService);
  userService = inject(UserService);
  profileEntryService = inject(ProfileEntryService);
  router = inject(Router);

  @Output() onCancel = new EventEmitter<void>();

  readonly currentPage: number = 1;
  selectedTemplateId: string = '';
  // private templateInfo:ResumeTemplateInfo={
  //   id:'',

  // }

  constructor(@Inject(DIALOG_DATA) public data: { quickResume: boolean })
  {
    this.currentPage = data.quickResume ? 2 : 1;
  }

  selectTemplate(template: ResumeTemplateInfo): void
  {
    this.selectedTemplateId = template.id;
    this.create();
  }

  create(): void
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
        const resume = new Resume();
        resume.name = 'Resume';
        resume.userInfo = personalInfo;
        resume.profileEntries = profileEntries;
        resume.resumeInfo.templateId = this.selectedTemplateId;

        this.resumeService.createResume(resume).subscribe(res =>
        {
          if (res.success && res.value)
          {
            this.router.navigate([`/resume/${res.value?.id}`]);
          }
        })
      })
    });
    // this.resumeService
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

  cancel()
  {
    this.onCancel.emit();
  }
}
