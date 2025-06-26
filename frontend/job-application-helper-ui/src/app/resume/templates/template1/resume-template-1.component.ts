import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionTextComponent } from '../shared/components/section-text/section-text.component';
import { SectionProfileEntryComponent } from '../shared/components/section-profile-entry/section-profile-entry.component';
import { ResumeTemplateBase } from '../resume-template-base';

@Component({
  selector: 'app-resume-template-1',
  imports: [CommonModule, SectionTextComponent, SectionProfileEntryComponent],
  templateUrl: './resume-template-1.component.html',
  styleUrl: './resume-template-1.component.scss'
})
export class ResumeTemplate1Component extends ResumeTemplateBase
{
  constructor()
  {
    super();
  }
  
}
