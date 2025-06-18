import { Component, Inject, inject, Input } from '@angular/core';
import { UserInfo } from '../shared/models/userinfo';
import { CommonModule } from '@angular/common';
import { HelperMethods } from '../../core/helper-methods';

@Component({
  selector: 'app-user-info-view',
  imports: [CommonModule],
  templateUrl: './user-info-view.component.html',
  styleUrl: './user-info-view.component.scss'
})
export class UserInfoViewComponent
{
  HelperMethods = HelperMethods;
  @Input() userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: {}
  }
}
