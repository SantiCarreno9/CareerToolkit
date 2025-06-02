import { Component, inject } from '@angular/core';
import { UserInfoFormComponent } from '../user/user-info/user-info-form/user-info-form.component';
import { UserInfo } from '../user/shared/userinfo';
import { UserService } from '../user/shared/user.service';
import { UserInfoViewComponent } from "../user/user-info/user-info-view/user-info-view.component";
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { UpdateUserInfoModel } from '../user/shared/updateuserinfomodel';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [UserInfoViewComponent, DialogModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent
{
  userService: UserService = inject(UserService);
  dialog = inject(Dialog);

  userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: {}
  };

  constructor()
  {
    // Initialization logic if needed
    this.requestUserInfo();
  }

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
}
