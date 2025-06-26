import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { ResumeTemplateSelectorComponent } from '../resume-template-selector/resume-template-selector.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { UserPersonalInfo } from '../shared/models/userpersonalinfo';
import { UserInfo } from '../../user/shared/models/userinfo';
import { Resume } from '../shared/models/resume';
import { Router } from '@angular/router';
import { ResumeTemplateInfo } from '../shared/models/resume-template';
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ResumeCreatorPages } from './resume-creator-pages';
import { ResumeBasicInfo } from '../shared/models/basic-resume-info';
import { ProfileEntriesImporterComponent } from '../shared/components/profile-entries-importer/profile-entries-importer.component';
import { lastValueFrom } from 'rxjs';
import { ProfileEntryHelperMethods } from '../../profile-entry/shared/profile-entry-helper-methods';
import { ProfileEntryService } from '../../core/services/profile-entry.service';
import { ResumeService } from '../../core/services/resume.service';
import { UserService } from '../../core/services/user.service';
import { ResumeBasicInfoFormComponent } from '../resume-basic-info-form/resume-basic-info-form.component';
import { AiProfileEntriesImporterComponent } from '../shared/components/ai-profile-entries-importer/ai-profile-entries-importer.component';

@Component({
  selector: 'app-resume-creator',
  imports: [ResumeTemplateSelectorComponent, ResumeBasicInfoFormComponent, ProfileEntriesImporterComponent, AiProfileEntriesImporterComponent],
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
  protected quickResume: boolean = false;
  protected entriesForImporter: any = {};

  constructor(@Inject(DIALOG_DATA) public data: { quickResume: boolean })
  {
    this.quickResume = data.quickResume;
  }

  protected selectTemplate(template: ResumeTemplateInfo): void
  {
    this.selectedTemplateId = template.id;
    this.create();
  }

  protected importProfileEntries(entries: ProfileEntry[])
  {
    this.resume.profileEntries = entries;
    this.nextPage();
  }

  protected saveResumeBasicInfo(info: ResumeBasicInfo)
  {
    this.resume.name = info.name;
    this.resume.keywords = info.keywords;
    this.resume.jobPosting = info.jobPosting || null;
    this.nextPage();
  }

  protected nextPage(): void
  {
    if (this.currentPage === ResumeCreatorPages.ResumeName)
    {
      if (this.quickResume)
        this.currentPage = ResumeCreatorPages.TemplateSelector;
      else
      {
        this.currentPage = ResumeCreatorPages.ProfileEntriesImporter;
        this.getEntriesForImporter();
      }
      return;
    }

    if (this.currentPage === ResumeCreatorPages.ProfileEntriesImporter)
    {
      this.currentPage = ResumeCreatorPages.TemplateSelector;
    }

  }

  private getEntriesForImporter(): void
  {
    this.profileEntryService.getProfileEntries().subscribe(res =>
    {
      if (!res.success || !res.value)
      {
        console.log(res.error);
        return;
      }

      this.entriesForImporter = ProfileEntryHelperMethods.getGroupedProfileEntriesByCategory(res.value);
    });
  }

  protected async create(): Promise<void>
  {
    const userInfo = await lastValueFrom(this.userService.getUserInfo());
    if (!userInfo.success || !userInfo.value)
      return;

    if(this.resume.profileEntries === undefined || this.resume.profileEntries === null || this.resume.profileEntries.length === 0)
    {
      const entries = await lastValueFrom(this.profileEntryService.getProfileEntries());
      if (!entries.success || !entries.value)
      {
        console.log(entries.error);
        return;
      }
      this.resume.profileEntries = entries.value;
    }
    this.resume.userInfo = this.convertUserInfoToUserPersonalInfo(userInfo.value);
    this.resume.resumeInfo.templateId = this.selectedTemplateId;
    this.resumeService.createResume(this.resume).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.onResumeCreated.emit(res.value);
      }
    })
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
