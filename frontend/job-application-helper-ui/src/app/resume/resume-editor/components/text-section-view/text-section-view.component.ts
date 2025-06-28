import { Component, Input } from '@angular/core';
import { SectionInfoText } from '../../../templates/shared/models/sectioninfo';
import { HelperMethods } from '../../../../core/helper-methods';
import { ResumeSectionType } from '../../../shared/models/resume-section-type';

@Component({
  selector: 'app-text-section-view',
  imports: [],
  templateUrl: './text-section-view.component.html',
  styleUrl: './text-section-view.component.scss'
})
export class TextSectionViewComponent
{
  @Input() info: SectionInfoText = new SectionInfoText('',ResumeSectionType.Text,'');

  get content():string{
    return HelperMethods.cleanHtmlString(this.info.content);
  }
}
