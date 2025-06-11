import { Component, Input } from '@angular/core';
import { SectionInfoText } from '../../../templates/shared/models/sectioninfo';

@Component({
  selector: 'app-text-section-view',
  imports: [],
  templateUrl: './text-section-view.component.html',
  styleUrl: './text-section-view.component.scss'
})
export class TextSectionViewComponent
{
  @Input() info: SectionInfoText = new SectionInfoText('','','');
}
