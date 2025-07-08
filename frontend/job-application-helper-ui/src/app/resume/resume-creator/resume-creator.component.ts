import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { ResumeTemplateSelectorComponent } from '../resume-template-selector/resume-template-selector.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
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
import { ResumeHelperMethods } from '../shared/resume-helper-methods';
import { DisplayMessageService } from '../../core/services/display-message.service';

@Component({
  selector: 'app-resume-creator',
  imports: [ResumeTemplateSelectorComponent, ResumeBasicInfoFormComponent, ProfileEntriesImporterComponent, AiProfileEntriesImporterComponent],
  templateUrl: './resume-creator.component.html',
  styleUrl: './resume-creator.component.scss'
})
export class ResumeCreatorComponent
{
  private resumeService = inject(ResumeService);
  private userService = inject(UserService);
  private profileEntryService = inject(ProfileEntryService);
  private router = inject(Router);
  private displayMessageService = inject(DisplayMessageService);

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
        this.displayMessageService.showMessage('Error retrieving entries');
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
    {
      this.displayMessageService.showMessage('Error retrieving user info');
      return;
    }

    if (this.resume.profileEntries === undefined || this.resume.profileEntries === null || this.resume.profileEntries.length === 0)
    {
      const entries = await lastValueFrom(this.profileEntryService.getProfileEntries());
      if (!entries.success || !entries.value)
      {
        console.log(entries.error);
        return;
      }
      this.resume.profileEntries = entries.value;
    }
    this.resume.userInfo = ResumeHelperMethods.convertUserInfoToUserPersonalInfo(userInfo.value);
    this.resume.resumeInfo.templateId = this.selectedTemplateId;
    this.resumeService.createResume(this.resume).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.onResumeCreated.emit(res.value);
      }
      else
      {
        this.displayMessageService.showMessage('There was an error creating the resume. Please try again later.');
      }
    })
  }

  protected cancel()
  {
    this.onCancel.emit();
  }
}
