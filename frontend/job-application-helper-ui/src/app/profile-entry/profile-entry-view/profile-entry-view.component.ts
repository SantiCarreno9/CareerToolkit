import { Component, Input } from '@angular/core';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { ProfileEntry } from '../shared/models/profile-entry';
import { HelperMethods } from '../../core/helper-methods';
import { ProfileEntryHelperMethods } from '../shared/profile-entry-helper-methods';

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
    endDate: null,
    isCurrent: false,
    description: ''
  }

  get timeFrame()
  {
    return ProfileEntryHelperMethods.getTimeframe(this.profileEntry.startDate, this.profileEntry.endDate);
  }

  get description(): string
  {
    return HelperMethods.cleanHtmlString(this.profileEntry.description ?? '');
  }

}
