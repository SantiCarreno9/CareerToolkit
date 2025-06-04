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
    endDate: undefined,
    isCurrent: false,
    description: ''
  }

  get timeFrame()
  {
    const startDate = new Date(this.profileEntry.startDate);
    const endDate = this.profileEntry.endDate ? new Date(this.profileEntry.endDate) : new Date();
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const timeFrame = startDate.toLocaleDateString(undefined, dateTimeFormatOptions) +
      (this.profileEntry.isCurrent
        ? " - Present"
        : " - " +
        endDate.toLocaleDateString(undefined, dateTimeFormatOptions));
    return timeFrame;
  }

}
