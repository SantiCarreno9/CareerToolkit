import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileEntryCategory } from '../../../../../core/enums/profile-entry-category';
import { ProfileEntry } from '../../../../../profile-entry/shared/models/profile-entry';

@Component({
    selector: 'app-profile-entry-component',
    imports: [CommonModule],
    templateUrl: './profile-entry.component.html',
    styleUrl:'./profile-entry.component.scss'
})
export class ProfileEntryComponent
{
    @Input() entry: ProfileEntry = {
        id: '',
        title: '',
        organization: '',
        location: '',
        startDate: new Date(),
        isCurrent: false,
        endDate: new Date(),
        category: ProfileEntryCategory.Education
    }

    @Input() dateFormat: any;

    constructor()
    {
        this.dateFormat = {
            locales: undefined,
            options: {
                year: "numeric",
                month: "short"                
            }
        }
    }    

    get timeFrame()
    {
        const startDate = new Date(this.entry.startDate);
        const endDate = this.entry.endDate ? new Date(this.entry.endDate) : new Date();        
        const timeFrame = startDate.toLocaleDateString(this.dateFormat.locales, this.dateFormat.options) +
            (this.entry.isCurrent
                ? " - Present"
                : " - " +
                endDate.toLocaleDateString(this.dateFormat.locales, this.dateFormat.options));
        return timeFrame;
    }
}
