import { Component, inject } from '@angular/core';
import { UserInfoFormComponent } from '../user/user-info/user-info-form/user-info-form.component';
import { UserInfo } from '../user/shared/userinfo';
import { UserService } from '../user/shared/user.service';
import { UserInfoViewComponent } from "../user/user-info/user-info-view/user-info-view.component";
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UpdateUserInfoModel } from '../user/shared/updateuserinfomodel';
import { map, Observable } from 'rxjs';
import { ProfileEntryService } from '../profile-entry/shared/profile-entry.service';
import { ProfileEntryViewComponent } from '../profile-entry/profile-entry-view/profile-entry-view.component';
import { ProfileEntry } from '../profile-entry/shared/profile-entry';
import { ProfileEntryFormComponent } from '../profile-entry/profile-entry-form/profile-entry-form.component';
import { ProfileEntryCategory } from '../core/enums/profile-entry-category';
import { CommonModule } from '@angular/common';

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

  userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: {}
  };
  profileEntries:ProfileEntry[] = [];

  constructor()
  {
    // Initialization logic if needed
    this.requestUserInfo();
    this.requestProfileEntries();
  }

  //#region User Info

  openUserInfoFormDialog()
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

  private requestUserInfo()
  {
    this.userService.getUserInfo().subscribe(response =>
    {
      if (response.success && response.value)
        this.userInfo = response.value;
    });
  }

  //#endregion

  //#region Profile Entry

  openProfileEntryDialog(profileEntry?: ProfileEntry)
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
          category: ProfileEntryCategory.Education}
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onSubmit.subscribe((result: UserInfo) =>
    {
      console.log('Profile Entry submitted:', result);
      // this.updateUserInfo(result).subscribe(success =>
      // {
      //   if (success)
      //   {
      //     dialogRef.close(result);
      //   } else
      //   {
      //     console.error('Failed to update user info');
      //   }
      // });
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  private updateProfileEntry(newUserInfo: UserInfo): Observable<boolean>
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

  private requestProfileEntries()
  {
    this.profileEntries = [...this.profileEntryService.profileEntries];
    // this.userService.getUserInfo().subscribe(response =>
    // {
    //   if (response.success && response.value)
    //     this.userInfo = response.value;
    // });
  }

  private requestProfileEntry()
  {
    this.userService.getUserInfo().subscribe(response =>
    {
      if (response.success && response.value)
        this.userInfo = response.value;
    });
  }

  //#endregion
}
