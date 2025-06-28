import { Component, Input, OnInit } from '@angular/core';
import { SectionInfoText } from '../../models/sectioninfo';
import { HelperMethods } from '../../../../../core/helper-methods';
import { ResumeSectionType } from '../../../../shared/models/resume-section-type';

@Component({
    selector: 'app-section-text',
    imports: [],
    templateUrl: './section-text.component.html',
    styleUrl: './section-text.component.scss'
})
export class SectionTextComponent
{    
    @Input() info: SectionInfoText = new SectionInfoText('', ResumeSectionType.Text, '');

    get content(): string
    {
        return HelperMethods.cleanHtmlString(this.info.content);
    }
}
