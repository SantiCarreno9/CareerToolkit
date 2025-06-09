import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Resume } from '../../shared/resume';
import { SectionTextComponent } from '../shared/components/section-text/section-text.component';
import { SectionProfileEntryComponent } from '../shared/components/section-profile-entry/section-profile-entry.component';
import { SectionInfoProfileEntry, SectionInfoText } from '../shared/sectioninfo';
import { ResumeTemplateInfo } from '../../shared/resume-template';
import { ResumeInfo } from '../../shared/resume-info';
import { ProfileEntryCategory } from '../../../core/enums/profile-entry-category';
import { TemplateBase } from '../template-base';
import { BasicResumeSections } from '../shared/basic-resume-sections';

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

  override setUpDefaultLayout(): void
  {

    //Education    
    this.resumeInfo.sections[2].entriesId = this.getProfileEntriesIds(ProfileEntryCategory.Education);

    //Profesional Experience    
    this.resumeInfo.sections[1].entriesId = this.getProfileEntriesIds(ProfileEntryCategory.WorkExperience);
  }

  override defineBasicLayout(): void
  {
    this.resumeInfo = {
      templateId: '1',
      sections: [
        new SectionInfoText(
          '1',
          BasicResumeSections.Summary,
          ''
        ),
        new SectionInfoProfileEntry(
          '2',
          BasicResumeSections.WorkExperience,
          []
        ),
        new SectionInfoProfileEntry(
          '3',
          BasicResumeSections.Education,
          []
        )
      ]
    };
  }

  isSectionText(section: any): boolean
  {
    return section instanceof SectionInfoText;
  }

  isSectionProfileEntry(section: any): boolean
  {
    return section instanceof SectionInfoProfileEntry;
  }
}
