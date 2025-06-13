import { Component, inject } from '@angular/core';
import { UserInfoFormComponent } from '../../../user/user-info-form/user-info-form.component';
import { UserInfo } from '../../../user/shared/models/userinfo';
import { UserService } from '../../../user/shared/user.service';
import { UserInfoViewComponent } from "../../../user/user-info-view/user-info-view.component";
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UpdateUserInfoModel } from '../../../user/shared/models/updateuserinfomodel';
import { map, Observable } from 'rxjs';
import { ProfileEntryService } from '../../../profile-entry/shared/profile-entry.service';
import { ProfileEntryViewComponent } from '../../../profile-entry/profile-entry-view/profile-entry-view.component';
import { ProfileEntryFormComponent } from '../../../profile-entry/profile-entry-form/profile-entry-form.component';
import { ProfileEntryCategory } from '../../../core/enums/profile-entry-category';
import { CommonModule } from '@angular/common';
import { ProfileEntry } from '../../../profile-entry/shared/models/profile-entry';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ProfileEntryHelperMethods } from '../../../profile-entry/shared/profile-entry-helper-methods';
import { HelperMethods } from '../../helper-methods';

@Component({
  selector: 'app-profile',
  imports: [DialogModule, CommonModule, UserInfoViewComponent, ProfileEntryViewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent
{
  dialog = inject(Dialog);
  userService: UserService = inject(UserService);
  profileEntryService: ProfileEntryService = inject(ProfileEntryService);

  protected userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: {}
  };
  protected profileEntries: ProfileEntry[] = [];
  protected ProfileEntryCategory = ProfileEntryCategory;
  protected readonly profileEntryCategoryOptions: {
    key: string;
    value: ProfileEntryCategory;
  }[] = [];

  constructor()
  {
    this.profileEntryCategoryOptions = Object.keys(ProfileEntryCategory)
      .filter(k => isNaN(Number(k))) // filter out numeric keys
      .map(key => ({
        key: key.split(/(?=[A-Z])/).join(' '), // Convert camelCase to spaced words
        value: ProfileEntryCategory[key as keyof typeof ProfileEntryCategory]
      }));
    // Initialization logic if needed
    this.requestUserInfo();
    this.requestProfileEntries();
  }

  //#region User Info

  protected openUserInfoFormDialog(): void
  {
    const dialogRef = this.dialog.open(UserInfoFormComponent, {
      width: '500px',
      data: {
        userInfo: {
          ...this.userInfo,
          additionalContactInfo: { ...this.userInfo.additionalContactInfo }
        }
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: UserInfo) =>
    {
      this.updateUserInfo(result).subscribe(success =>
      {
        if (success)
        {
          dialogRef.close(result);
        } else
        {
          console.error('Failed to update user info');
        }
      });
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  private updateUserInfo(newUserInfo: UserInfo): Observable<boolean>
  {
    const updateData: UpdateUserInfoModel = {
      fullName: newUserInfo.fullName,
      phoneNumber: newUserInfo.phoneNumber.toString(),
      address: newUserInfo.address,
      additionalContactInfo: newUserInfo.additionalContactInfo || {}
    }
    return this.userService.updateUserInfo(newUserInfo.id, updateData).pipe(
      map(response =>
      {
        if (response.success)
        {
          console.log('User info updated successfully', newUserInfo);
          this.userInfo = newUserInfo;
          return true;
        } else
        {
          console.error('Failed to update user info', response.error);
          return false;
        }
      }
      ));
  }

  private requestUserInfo(): void
  {
    this.userService.getUserInfo().subscribe(response =>
    {
      if (response.success && response.value)
        this.userInfo = response.value;
    });
  }

  //#endregion

  //#region Profile Entry

  protected openCreateProfileEntryDialog(category: ProfileEntryCategory): void
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
      this.profileEntryService.createProfileEntry(result).subscribe(response =>
      {
        if (response.success && response.value)
        {
          result.id = response.value;          
          this.profileEntries.push(result);
          ProfileEntryHelperMethods.sortEntries(this.profileEntries);
          dialogRef.close(result);
        } else
        {
          console.error('Failed to create profile entry', response.error);
        }
      });
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected openEditProfileEntryDialog(profileEntry?: ProfileEntry): void
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
      this.profileEntryService.updateProfileEntry(result.id, result).subscribe(response =>
      {
        if (response.success)
        {          
          const index = this.profileEntries.findIndex(pe => pe.id === result.id);
          this.profileEntries[index] = { ...result };
          ProfileEntryHelperMethods.sortEntries(this.profileEntries);
          dialogRef.close();
        } else
        {
          console.error('Failed to create profile entry', response.error);
        }
      });
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected deleteProfileEntry(id: string): void
  {
    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Entry', `Do you want to delete this entry?`, () =>
    {
      this.profileEntryService.deleteProfileEntry(id).subscribe(response =>
      {
        if (response.success)
        {
          const index = this.profileEntries.findIndex(pe => pe.id == id);
          if (index > -1)
          {
            this.profileEntries.splice(index, 1);
          }
        }
      });
    })
  }

  private requestProfileEntries(): void
  {
    // this.profileEntries = [...this.profileEntryService.profileEntries];
    this.profileEntryService.getProfileEntries().subscribe(response =>
    {
      if (response.success && response.value)
      {
        this.profileEntries = response.value;
      } else
      {
        console.error('Failed to load profile entries', response.error);
      }
    });
  }

  //#endregion
}
