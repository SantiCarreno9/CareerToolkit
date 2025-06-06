import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SectionInfoText } from '../../sectioninfo';

@Component({
    selector: 'app-section-text',
    imports: [CommonModule],
    templateUrl: './section-text.component.html',
    styleUrl:'./section-text.component.scss'
})
export class SectionTextComponent
{
    @Input() info: SectionInfoText = {
        id: '',
        title: '',
        content: ''
    };
}
