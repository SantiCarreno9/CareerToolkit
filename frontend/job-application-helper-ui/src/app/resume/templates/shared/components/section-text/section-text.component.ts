import { Component, Input } from '@angular/core';
import { SectionInfoText } from '../../models/sectioninfo';

@Component({
    selector: 'app-section-text',
    imports: [],
    templateUrl: './section-text.component.html',
    styleUrl:'./section-text.component.scss'
})
export class SectionTextComponent
{
    @Input() info: SectionInfoText = new SectionInfoText('','','');
}
