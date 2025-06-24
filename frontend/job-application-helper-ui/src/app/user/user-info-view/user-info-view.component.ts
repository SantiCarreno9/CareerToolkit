import { Component, Input } from '@angular/core';
import { UserInfo } from '../shared/models/userinfo';
import { CommonModule } from '@angular/common';
import { HelperMethods } from '../../core/helper-methods';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-user-info-view',
  imports: [CommonModule, ClipboardModule],
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

  protected isEmptyOrWhitespace(str: string): boolean
  {
    // Check if the input is actually a string and not null/undefined
    if (typeof str !== 'string' || str === null || str === undefined)
    {
      return true; // Or handle as an error, depending on requirements
    }
    return str.trim().length === 0;
  }
}
