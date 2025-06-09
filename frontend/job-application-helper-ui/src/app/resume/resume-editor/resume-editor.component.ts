import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../shared/resume.service';
import { Resume } from '../shared/resume';
import { CommonModule } from '@angular/common';
import { ResumeInfo } from '../shared/resume-info';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { UserInfoViewComponent } from '../../user/user-info-view/user-info-view.component';
import { UserInfo } from '../../user/shared/userinfo';
import { UserPersonalInfo } from '../shared/userpersonalinfo';
import { UserInfoFormComponent } from '../../user/user-info-form/user-info-form.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UserService } from '../../user/shared/user.service';
import { ProfileEntryService } from '../../profile-entry/shared/profile-entry.service';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { ProfileEntryFormComponent } from '../../profile-entry/profile-entry-form/profile-entry-form.component';
import { ProfileEntryViewComponent } from '../../profile-entry/profile-entry-view/profile-entry-view.component';
import { ProfileEntry } from '../../profile-entry/shared/profile-entry';

@Component({
  selector: 'app-resume-editor',
  imports: [CommonModule, DialogModule, CdkAccordionModule, UserInfoViewComponent, ProfileEntryViewComponent],
  templateUrl: './resume-editor.component.html',
  styleUrl: './resume-editor.component.scss'
})
export class ResumeEditorComponent
{
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  private readonly resumeId: string | null;
  resume: Resume = new Resume();

  private resumeInfo: ResumeInfo = {
    templateId: '',
    sections: []
  };

  template: any;

  private dialog = inject(Dialog);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);
  private userService: UserService = inject(UserService);
  private profileEntryService = inject(ProfileEntryService);

  constructor()
  {
    this.resumeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.resumeId === null)
    {
      this.router.navigate(['/resume']);
      return;
    }

    this.resumeService.getResumeById(this.resumeId).subscribe(res =>
    {
      if (!res.success || !res.value)
      {
        this.router.navigate(['/resume']);
        return;
      }

      this.resume = res.value;
      this.resumeInfo = { ...this.resume.resumeInfo };
      this.updateTemplate();
    })
  }

  updateTemplate(): void
  {
    const templateInfo = this.resumeService.getTemplateInfoById(this.resumeInfo.templateId);
    if (templateInfo === null)
      return;

    this.template = templateInfo.component;
  }

  convertToUserInfo(info: UserPersonalInfo): UserInfo
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

  openUserInfoFormDialog(): void
  {
    const dialogRef = this.dialog.open(UserInfoFormComponent, {
      width: '500px',
      data: {
        userInfo: {
          ...this.resume.userInfo,
          additionalContactInfo: { ...this.resume.userInfo.additionalContactInfo }
        },
        allowEmailEditing:true
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

  openCreateProfileEntryDialog(category: ProfileEntryCategory): void
  {
    const dialogRef = this.dialog.open(ProfileEntryFormComponent, {
      width: '500px',
      data: {
        profileEntry: {
          id: '',
          title: '',
          organization: '',
          startDate: new Date(),
          endDate: new Date(),
          isCurrent: false,
          location: '',
          description: '',
          category: category
        }
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: ProfileEntry) =>
    {
      
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  openEditProfileEntryDialog(profileEntry?: ProfileEntry): void
  {
    const dialogRef = this.dialog.open(ProfileEntryFormComponent, {
      width: '500px',
      data: {
        profileEntry: profileEntry || {
          id: '',
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
      
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  deleteProfileEntry(id: string): void
  {
    
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
}
