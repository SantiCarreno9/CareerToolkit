import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionTextComponent } from '../shared/components/section-text/section-text.component';
import { SectionProfileEntryComponent } from '../shared/components/section-profile-entry/section-profile-entry.component';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'app-resume-template-1',
  imports: [CommonModule, SectionTextComponent, SectionProfileEntryComponent],
  templateUrl: './template1.component.html',
  styleUrl: './template1.component.scss'
})
export class Template1Component extends TemplateBase
{
  constructor()
  {
    super();
  }
  
}
