import { Component } from '@angular/core';
import { ResumeTemplateBase } from '../resume-template-base';
import { CommonModule } from '@angular/common';
import { SectionTextComponent } from '../shared/components/section-text/section-text.component';
import { SectionProfileEntryComponent } from '../shared/components/section-profile-entry/section-profile-entry.component';

@Component({
  selector: 'app-resume-template-2',
  imports: [CommonModule, SectionTextComponent, SectionProfileEntryComponent],
  templateUrl: './resume-template-2.component.html',
  styleUrl: './resume-template-2.component.scss'
})
export class ResumeTemplate2Component extends ResumeTemplateBase {
  constructor()
  {
    super();
  }
}
