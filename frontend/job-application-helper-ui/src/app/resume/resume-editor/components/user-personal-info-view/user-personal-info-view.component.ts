import { Component, Input } from '@angular/core';
import { UserPersonalInfo } from '../../../shared/models/user-personal-info';
import { HelperMethods } from '../../../../core/helper-methods';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-personal-info-view',
  imports: [CommonModule, ClipboardModule],
  templateUrl: './user-personal-info-view.component.html',
  styleUrl: './user-personal-info-view.component.scss'
})
export class UserPersonalInfoViewComponent
{
  HelperMethods = HelperMethods;
  @Input() userPersonalInfo: UserPersonalInfo = {
    fullName: '',
    contactInfo: []
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
