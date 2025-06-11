import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../shared/resume.service';
import { Resume } from '../shared/models/resume';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { UserInfoViewComponent } from '../../user/user-info-view/user-info-view.component';
import { UserInfo } from '../../user/shared/models/userinfo';
import { UserPersonalInfo } from '../shared/models/userpersonalinfo';
import { UserInfoFormComponent } from '../../user/user-info-form/user-info-form.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UserService } from '../../user/shared/user.service';
import { ProfileEntryService } from '../../profile-entry/shared/profile-entry.service';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { ProfileEntryFormComponent } from '../../profile-entry/profile-entry-form/profile-entry-form.component';
import { ProfileEntryViewComponent } from '../../profile-entry/profile-entry-view/profile-entry-view.component';
import { SectionInfoProfileEntry, SectionInfoText } from '../templates/shared/models/sectioninfo';
import { ResumeTemplateService } from '../templates/shared/resume-template.service';
import { TextSectionFormComponent } from './components/text-section-form/text-section-form.component';
import { TextSectionViewComponent } from "./components/text-section-view/text-section-view.component";
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ResumeSectionCreatorComponent } from './components/resume-section-creator/resume-section-creator.component';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';
import { ResumeSectionEditorComponent } from './components/resume-section-editor/resume-section-editor.component';
// import * as html2pdf from 'html2pdf.js';
declare let html2pdf: any; //declare moment

@Component({
  selector: 'app-resume-editor',
  imports: [CommonModule, DialogModule, CdkAccordionModule, UserInfoViewComponent, ProfileEntryViewComponent, TextSectionViewComponent],
  templateUrl: './resume-editor.component.html',
  styleUrl: './resume-editor.component.scss'
})
export class ResumeEditorComponent
{
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  @ViewChild(NgComponentOutlet, { static: false }) ngComponentOutlet?: NgComponentOutlet;

  private readonly resumeId: string | null;
  resume: Resume = new Resume();

  template: any;

  private dialog = inject(Dialog);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);
  protected templateService = inject(ResumeTemplateService);
  private userService: UserService = inject(UserService);
  private profileEntryService = inject(ProfileEntryService);

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

  protected get modifiedAtTime()
  {
    const time = this.resume.modifiedAt.toLocaleTimeString();
    return 'Last time saved: ' + time;
  }

  protected convertToUserInfo(info: UserPersonalInfo): UserInfo
  {
    return {
      id: '',
      fullName: info.fullName,
      phoneNumber: info.phoneNumber,
      address: info.address,
      email: info.email,
      additionalContactInfo: info.additionalContactInfo
    };
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

  private requestProfileEntries(): void
  {
    // this.profileEntries = [...this.profileEntryService.profileEntries];
    // this.profileEntryService.getProfileEntries().subscribe(response =>
    // {
    //   if (response.success && response.value)
    //   {
    //     this.profileEntries = response.value;
    //   } else
    //   {
    //     console.error('Failed to load profile entries', response.error);
    //   }
    // });
  }

  //#endregion

  //#region Buttons

  protected save(): void
  {
    if (this.resumeId === null)
      return;
    this.resumeService.updateResume(this.resumeId, this.resume).subscribe(res =>
    {
      if (res.success && res.value)
        this.resume.modifiedAt = res.value.modifiedAt;
    });
  }

  protected reset(): void
  {
    window.location.reload();
  }

  protected goBack(): void
  {
    this.router.navigate(['/resume']);
  }

  protected exportPDF(): void
  {
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

  protected openUserInfoFormDialog(): void
  {
    const dialogRef = this.dialog.open(UserInfoFormComponent, {
      width: '500px',
      data: {
        userInfo: {
          ...this.resume.userInfo,
          additionalContactInfo: { ...this.resume.userInfo.additionalContactInfo }
        },
        allowEmailEditing: true
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: UserInfo) =>
    {
      const updatedInfo: UserPersonalInfo = {
        fullName: result.fullName,
        email: result.email,
        phoneNumber: result.phoneNumber,
        address: result.address,
        additionalContactInfo: result.additionalContactInfo
      }
      this.resume.userInfo = updatedInfo;
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

    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Entry', `Do you want to delete this entry?`, () =>
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
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }
  // private requestUserInfo(): void
  // {
  //   this.userService.getUserInfo().subscribe(response =>
  //   {
  //     if (response.success && response.value)
  //       this.userInfo = response.value;
  //   });
  // }

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
        // if(profileEntry.startDate)
        this.sortEntries(sectionIndex);
      }
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

      const entryIdInSectionIndex = this.resume.resumeInfo.sections[sectionIndex].entriesId.findIndex(id);
      if (entryIdInSectionIndex !== -1)
        this.resume.resumeInfo.sections[sectionIndex].entriesId.splice(entryIdInSectionIndex, 1);
    });
  }

  private sortEntries(sectionIndex: number): void
  {
    const entriesInSection = this.resume.profileEntries.filter(pe => this.resume.resumeInfo.sections[sectionIndex].entriesId.includes(pe.id));
    entriesInSection.sort((a, b) =>
    {
      const dateA = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
      const dateB = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
      return dateB.getTime() - dateA.getTime();
    });
    this.resume.resumeInfo.sections[sectionIndex].entriesId = [...entriesInSection.map(e => e.id)]
    // this.resume.profileEntries
  }

  //#endregion  

}

