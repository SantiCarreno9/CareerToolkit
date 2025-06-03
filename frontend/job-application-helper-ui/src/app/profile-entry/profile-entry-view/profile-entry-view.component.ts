import { Component, Input } from '@angular/core';
import { ProfileEntry } from '../shared/profile-entry';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';

@Component({
  selector: 'app-profile-entry-view',
  imports: [],
  templateUrl: './profile-entry-view.component.html',
  styleUrl: './profile-entry-view.component.scss'
})
export class ProfileEntryViewComponent
{
  @Input() profileEntry: ProfileEntry = {
    id: '',
    title: '',    
    category: ProfileEntryCategory.Education,
    organization: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    isCurrent: false,
    description: ''
  }
}
