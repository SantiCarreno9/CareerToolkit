import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { UserInfo } from '../../shared/userinfo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-user-info-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-info-form.component.html',
  styleUrl: './user-info-form.component.scss'
})
export class UserInfoFormComponent
{    
  userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: []
  };
  userInfoForm = new FormGroup({    
    fullName: new FormControl('', [
      Validators.required,
    ]),
    email: new FormControl({value:'',disabled:true}, [
      Validators.required,
      Validators.email      
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10,15}$')
    ]),
    address: new FormControl('', [
      Validators.required,
    ]),
    additionalContactInfo: new FormControl()
  });

  @Output() onSubmit = new EventEmitter<UserInfo>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { userInfo: UserInfo })
  {
    this.userInfo = data.userInfo;
    // this.userService.getUserInfo().subscribe(userInfo =>
    // {
    //   this.userInfo = userInfo;
    
      this.userInfoForm.patchValue({        
        fullName: data.userInfo.fullName,
        email: data.userInfo.email,
        phoneNumber: data.userInfo.phoneNumber,
        address: data.userInfo.address, 
        additionalContactInfo: data.userInfo.additionalContactInfo
      });
    // });
  }

  get fullName()
  {
    return this.userInfoForm.get('fullName');
  }
  get email()
  {
    return this.userInfoForm.get('email');
  }
  get phoneNumber()
  {
    return this.userInfoForm.get('phoneNumber');
  }
  get address()
  {
    return this.userInfoForm.get('address');
  }
  // get additionalContactInfo()
  // {
  //   return this.i.additionalContactInfo;
  // }  

  submit()
  {
    if (this.userInfoForm.invalid)
    {
      this.userInfoForm.markAllAsTouched();
      return;
    }
    const updateUserInfo:UserInfo={
      id: this.userInfo.id,
      fullName: this.userInfoForm.value.fullName || '',
      email: this.userInfo.email || '',
      phoneNumber: this.userInfoForm.value.phoneNumber || '',
      address: this.userInfoForm.value.address || '',
      additionalContactInfo: this.userInfoForm.value.additionalContactInfo || []
    }
    this.onSubmit.emit(updateUserInfo);
    // this.closeDialog(updateUserInfo);
  }

  cancel()
  {
    this.onCancel.emit();
    // this.closeDialog();
  }

}
