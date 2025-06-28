import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SectionInfoProfileEntry } from '../../models/sectioninfo';
import { ProfileEntryComponent } from '../profile-entry/profile-entry.component';
import { ProfileEntry } from '../../../../../profile-entry/shared/models/profile-entry';

@Component({
    selector: 'app-section-profile-entry',
    imports: [CommonModule, ProfileEntryComponent],
    templateUrl: './section-profile-entry.component.html',
    styleUrl: './section-profile-entry.component.scss'
})
export class SectionProfileEntryComponent
{
    @Input() entries: ProfileEntry[] = [];
    @Input() info: SectionInfoProfileEntry = new SectionInfoProfileEntry('', []);

    filteredEntries: ProfileEntry[] = []

    shouldRender(id: string): boolean
    {
        return this.info.entriesId.includes(id);
    }

    getProfileEntryById(id: string): ProfileEntry | any
    {
        return this.entries.find(r => r.id === id);
    }
}
