import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Resume } from '../../shared/resume';
import { SectionTextComponent } from '../shared/components/section-text/section-text.component';
import { SectionProfileEntryComponent } from '../shared/components/section-profile-entry/section-profile-entry.component';
import { SectionInfoProfileEntry, SectionInfoText } from '../shared/sectioninfo';

@Component({
  selector: 'app-resume-template-1',
  imports: [CommonModule,SectionTextComponent,SectionProfileEntryComponent],
  templateUrl: './template1.component.html',
  styleUrl: './template1.component.scss'
})
export class Template1Component
{    
  @Input() resume: Resume = new Resume();

  isSectionText(section:any):boolean{    
    return section instanceof SectionInfoText;
  }

  isSectionProfileEntry(section:any):boolean{    
    return section instanceof SectionInfoProfileEntry;
  }
}
