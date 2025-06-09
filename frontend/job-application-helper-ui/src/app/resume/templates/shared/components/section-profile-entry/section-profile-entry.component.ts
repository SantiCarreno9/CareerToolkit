import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SectionInfoProfileEntry, SectionInfoText } from '../../sectioninfo';
import { ProfileEntry } from '../../../../../profile-entry/shared/profile-entry';
import { ProfileEntryComponent } from '../profile-entry/profile-entry.component';

@Component({
    selector: 'app-section-profile-entry',
    imports: [CommonModule, ProfileEntryComponent],
    templateUrl: './section-profile-entry.component.html',
    styleUrl: './section-profile-entry.component.scss'
})
export class SectionProfileEntryComponent
{
    @Input() entries: ProfileEntry[] = [];
    @Input() info: SectionInfoProfileEntry = {
        id: '',
        title: '',
        entriesId: []
    };

    shouldRender(id: string): boolean
    {
        return this.info.entriesId.includes(id);
    }
}
