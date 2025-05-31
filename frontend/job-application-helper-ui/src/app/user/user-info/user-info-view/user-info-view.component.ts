import { Component, Inject, inject, Input } from '@angular/core';
import { UserInfo } from '../../shared/userinfo';

@Component({
  selector: 'app-user-info-view',
  imports: [],
  templateUrl: './user-info-view.component.html',
  styleUrl: './user-info-view.component.scss'
})
export class UserInfoViewComponent
{
  @Input() userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: []
  }  
}
