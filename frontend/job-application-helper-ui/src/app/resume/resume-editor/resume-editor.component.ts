import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Resume } from '../shared/models/resume';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { UserPersonalInfo } from '../shared/models/user-personal-info';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { ProfileEntryFormComponent } from '../../profile-entry/profile-entry-form/profile-entry-form.component';
import { ProfileEntryViewComponent } from '../../profile-entry/profile-entry-view/profile-entry-view.component';
import { SectionInfoText } from '../templates/shared/models/sectioninfo';
import { ResumeTemplateService } from '../templates/shared/resume-template.service';
import { TextSectionFormComponent } from './components/text-section-form/text-section-form.component';
import { TextSectionViewComponent } from "./components/text-section-view/text-section-view.component";
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ResumeSectionCreatorComponent } from './components/resume-section-creator/resume-section-creator.component';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';
import { ResumeSectionEditorComponent } from './components/resume-section-editor/resume-section-editor.component';
import { ProfileEntryHelperMethods } from '../../profile-entry/shared/profile-entry-helper-methods';
import { ProfileEntriesImporterComponent } from '../shared/components/profile-entries-importer/profile-entries-importer.component';
import { ResumeSectionType } from '../shared/models/resume-section-type';
import { AiProfileEntryFormComponent } from './components/ai-profile-entry-form/ai-profile-entry-form.component';
import { ProfileEntryService } from '../../core/services/profile-entry.service';
import { ResumeService } from '../../core/services/resume.service';
import { UserService } from '../../core/services/user.service';
import { ResumeBasicInfoFormComponent } from '../resume-basic-info-form/resume-basic-info-form.component';
import { ResumeBasicInfo } from '../shared/models/basic-resume-info';
import { AiTextSectionFormComponent } from './components/ai-text-section-form/ai-text-section-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanComponentDeactivate } from '../../core/services/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { UserPersonalInfoFormComponent } from './components/user-personal-info-form/user-personal-info-form.component';
import { ResumeHelperMethods } from '../shared/resume-helper-methods';
import { UserPersonalInfoViewComponent } from './components/user-personal-info-view/user-personal-info-view.component';

@Component({
  selector: 'app-resume-editor',
  imports: [CommonModule,
    DialogModule,
    CdkAccordionModule,
    UserPersonalInfoViewComponent,
    ProfileEntryViewComponent,
    TextSectionViewComponent,
    MatTooltipModule],
  templateUrl: './resume-editor.component.html',
  styleUrl: './resume-editor.component.scss'
})
export class ResumeEditorComponent implements CanComponentDeactivate, OnInit, OnDestroy
{
  private dialog = inject(Dialog);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);
  protected templateService = inject(ResumeTemplateService);
  private userService: UserService = inject(UserService);
  private profileEntryService = inject(ProfileEntryService);

  @ViewChild(NgComponentOutlet, { static: false }) ngComponentOutlet?: NgComponentOutlet;

  ResumeHelperMethods = ResumeHelperMethods;

  protected expandedIndex = 0;
  public hasUnsavedChanges: boolean = false;
  private readonly resumeId: string | null;
  protected resume: Resume = new Resume();
  protected template: any;
  protected isSaving: boolean = false;

  constructor()
  {
    this.resumeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.resumeId === null)
    {
      this.goBack();
      return;
    }
    this.requestResumeData();
  }
  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this.hasUnsavedChanges)
    {
      return confirm('You have unsaved changes. Do you want to leave?');
    }
    return true;
  };

  ngOnInit(): void
  {
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy(): void
  {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  beforeUnloadHandler = (event: BeforeUnloadEvent) =>
  {
    if (this.hasUnsavedChanges)
    {
      event.preventDefault();
    }
  };

  protected get modifiedAtTime()
  {
    const time = this.resume.modifiedAt.toLocaleTimeString();
    return 'Last time saved: ' + time;
  }



  //#region Requests

  protected requestResumeData()
  {
    if (this.resumeId === null)
      return;

    this.resumeService.getResumeById(this.resumeId).subscribe(res =>
    {
      if (!res.success || !res.value)
      {
        this.goBack();
        return;
      }

      this.resume = res.value;
      this.updateTemplate();
    })
  }

  //#endregion

  //#region Buttons

  protected save(): void
  {
    if (this.resumeId === null)
      return;
    this.isSaving = true;
    this.resumeService.updateResume(this.resumeId, this.resume).subscribe(res =>
    {
      if (res.success && res.value)
        this.resume.modifiedAt = res.value.modifiedAt;
      this.isSaving = false;
      this.hasUnsavedChanges = false;
    });
  }

  protected reset(): void
  {
    window.location.reload();
  }

  protected goBack(): void
  {
    this.router.navigate(['/resumes']);
  }

  protected exportPDF(): void
  {
    document.title = this.resume.name;
    window.print();
  }

  //#endregion

  //#region Template

  protected updateTemplate(): void
  {
    const templateInfo = this.templateService.getTemplateInfoById(this.resume.resumeInfo.templateId);
    if (templateInfo === null)
      return;

    this.template = templateInfo.component;
    setTimeout(() =>
    {
      this.retrieveTemplateData()
    }, 100);
  }

  protected retrieveTemplateData(): void
  {
    if (this.ngComponentOutlet)
    {
      const componentInstance = this.ngComponentOutlet.componentInstance;
      this.resume.resumeInfo = componentInstance.resumeInfo;
    }
  }

  //#endregion 

  //#region Dialog

  protected openEditBasicInfoFormDialog(): void
  {
    const dialogRef = this.dialog.open(ResumeBasicInfoFormComponent, {
      data: {
        name: this.resume.name,
        keywords: this.resume.keywords,
        jobPosting: this.resume.jobPosting
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSave.subscribe((result: ResumeBasicInfo) =>
    {
      this.resume.name = result.name;
      this.resume.keywords = result.keywords;
      this.resume.jobPosting = result.jobPosting || null;
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openUserInfoFormDialog(): void
  {
    const dialogRef = this.dialog.open(UserPersonalInfoFormComponent, {
      width: '500px',
      data: {
        userPersonalInfo: {
          ...this.resume.userInfo,
          contactInfo: [...this.resume.userInfo.contactInfo]
        }
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: UserPersonalInfo) =>
    {
      const updatedInfo: UserPersonalInfo = {
        fullName: result.fullName,
        contactInfo: result.contactInfo
      }      
      this.resume.userInfo = updatedInfo;      
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  //#region Section

  protected openCreateSectionFormDialog(): void
  {
    const dialogRef = this.dialog.open(ResumeSectionCreatorComponent, {
      width: '500px',
      data: {
        sections: [...this.resume.resumeInfo.sections]
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: any[]) =>
    {
      this.resume.resumeInfo.sections = result;
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openEditSectionFormDialog(index: number): void
  {
    const dialogRef = this.dialog.open(ResumeSectionEditorComponent, {
      width: '500px',
      data: {
        sectionIndex: index,
        sections: [...this.resume.resumeInfo.sections]
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: any[]) =>
    {
      this.resume.resumeInfo.sections = [...result];
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected deleteSectionByIndex(index: number): void
  {
    if (this.resume.resumeInfo.sections.length < index)
      return;

    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Section', `Do you want to delete this section?`, () =>
    {
      this.resume.resumeInfo.sections.splice(index, 1);
    });
  }

  //#endregion

  protected openSectionFormDialog(sectionInfo: SectionInfoText, sectionIndex: number): void
  {
    const dialogRef = this.dialog.open(TextSectionFormComponent, {
      width: '500px',
      data: {
        sectionInfo: sectionInfo
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: SectionInfoText) =>
    {
      this.resume.resumeInfo.sections[sectionIndex].title = result.title;
      this.resume.resumeInfo.sections[sectionIndex].content = result.content;
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openAiSectionFormDialog(sectionInfo: SectionInfoText, sectionIndex: number): void
  {
    const dialogRef = this.dialog.open(AiTextSectionFormComponent, {
      data: {
        sectionInfo: sectionInfo,
        resume: this.resume
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: SectionInfoText) =>
    {
      this.resume.resumeInfo.sections[sectionIndex].title = result.title;
      this.resume.resumeInfo.sections[sectionIndex].content = result.content;
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }
  //#endregion

  //#region Profile Entry

  protected openCreateProfileEntryDialog(sectionIndex: number): void
  {
    const dialogRef = this.dialog.open(ProfileEntryFormComponent, {
      width: '500px',
      data: {
        profileEntry: {
          id: Math.floor(Math.random() * 100).toString(),
          title: '',
          organization: '',
          startDate: new Date(),
          endDate: new Date(),
          isCurrent: false,
          location: '',
          description: '',
          category: ProfileEntryCategory.WorkExperience
        }
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry) =>
    {
      this.resume.resumeInfo.sections[sectionIndex].entriesId.push(result.id);
      this.resume.profileEntries.push(result);
      this.sortEntries(sectionIndex);
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openEditProfileEntryDialog(profileEntry: ProfileEntry, sectionIndex: number): void
  {
    const dialogRef = this.dialog.open(ProfileEntryFormComponent, {
      width: '500px',
      data: {
        profileEntry: profileEntry
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry) =>
    {
      const entryIndex = this.resume.profileEntries.findIndex(pe => pe.id === result.id);
      if (entryIndex !== -1)
      {
        this.resume.profileEntries[entryIndex] = result;
        this.sortEntries(sectionIndex);
      }
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openAIEditProfileEntryDialog(profileEntry: ProfileEntry, sectionIndex: number): void
  {
    const dialogRef = this.dialog.open(AiProfileEntryFormComponent, {
      width: '800px',
      data: {
        profileEntry: profileEntry,
        resume: this.resume
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry) =>
    {
      const entryIndex = this.resume.profileEntries.findIndex(pe => pe.id === result.id);
      if (entryIndex !== -1)
      {
        this.resume.profileEntries[entryIndex] = result;
        this.sortEntries(sectionIndex);
      }
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected getProfileEntryById(id: string): ProfileEntry | any
  {
    return this.resume.profileEntries.find(r => r.id === id);
  }

  protected deleteProfileEntry(id: string, sectionIndex: number): void
  {
    const entryIndex = this.resume.profileEntries.findIndex(pe => pe.id === id);
    if (entryIndex === -1)
      return;

    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Entry', `Do you want to delete this entry?`, () =>
    {
      this.resume.profileEntries.splice(entryIndex, 1);

      const entryIdInSectionIndex = this.resume.resumeInfo.sections[sectionIndex].entriesId.findIndex((value: string) => value === id);
      if (entryIdInSectionIndex !== -1)
        this.resume.resumeInfo.sections[sectionIndex].entriesId.splice(entryIdInSectionIndex, 1);
      this.hasUnsavedChanges = true;
    });
  }

  private sortEntries(sectionIndex: number): void
  {
    const entriesInSection = this.resume.profileEntries.filter(pe => this.resume.resumeInfo.sections[sectionIndex].entriesId.includes(pe.id));
    ProfileEntryHelperMethods.sortEntries(entriesInSection);
    this.resume.resumeInfo.sections[sectionIndex].entriesId = [...entriesInSection.map(e => e.id)];
  }

  protected openImportProfileEntriesDialog(sectionIndex: number): void
  {
    this.profileEntryService.getProfileEntries().subscribe(res =>
    {
      if (!res.success || !res.value)
        return;

      const entriesIds = this.resume.profileEntries.map(pe => pe.id);
      const filteredEntries = res.value.filter(entry => !entriesIds.includes(entry.id));
      const dialogRef = this.dialog.open(ProfileEntriesImporterComponent, {
        width: '500px',
        data: {
          entries: ProfileEntryHelperMethods.getGroupedProfileEntriesByCategory(filteredEntries)
        },
        panelClass: ['custom-dialog-container', 'p-3'],
        disableClose: true
      });
      dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry[]) =>
      {
        result.forEach(entry =>
        {
          this.resume.profileEntries.push(entry);
          this.resume.resumeInfo.sections[sectionIndex].entriesId.push(entry.id)
        });
        this.sortEntries(sectionIndex);
        this.hasUnsavedChanges = true;
        dialogRef.close();
      })
      dialogRef.componentInstance?.onCancel.subscribe(() =>
      {
        dialogRef.close();
      });
    });
  }

  protected openImportProfileEntriesFromOtherSectionsDialog(sectionIndex: number): void
  {
    const sections = this.resume.resumeInfo.sections.filter((s, index) => index !== sectionIndex && s.sectionType === ResumeSectionType.ProfileEntry);
    if (sections.length === 0)
      return;
    const groupedEntries: { [key: string]: ProfileEntry[] } = {};

    for (const section of sections)
    {
      const entriesInSection = this.resume.profileEntries.filter(pe => section.entriesId.includes(pe.id));
      if (!groupedEntries[section.title])
      {
        groupedEntries[section.title] = [];
      }
      groupedEntries[section.title].push(...entriesInSection);
    }
    const dialogRef = this.dialog.open(ProfileEntriesImporterComponent, {
      width: '500px',
      data: {
        entries: groupedEntries
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry[]) =>
    {
      const entriesIds = result.map(e => e.id);
      for (const section of sections)
      {
        section.entriesId = section.entriesId.filter((id: string) => !entriesIds.includes(id));
      }
      this.resume.resumeInfo.sections[sectionIndex].entriesId.push(...entriesIds);
      this.sortEntries(sectionIndex);
      this.hasUnsavedChanges = true;
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  //#endregion  

}

