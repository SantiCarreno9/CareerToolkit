import { Injectable } from '@angular/core';
import { BasicResumeSections } from '../../shared/models/basic-resume-sections';
import { SectionInfoBase, SectionInfoProfileEntry, SectionInfoText } from './models/sectioninfo';
import { Template1Component } from '../template1/template1.component';
import { ResumeTemplateInfo } from '../../shared/models/resume-template';
import { ResumeSectionType } from '../../shared/models/resume-section-type';

@Injectable({
  providedIn: 'root'
})
export class ResumeTemplateService
{
  private templatesInfo: ResumeTemplateInfo[] = [];
  constructor()
  {
    this.populateTemplates();
  }

  getTemplateInfoById(id: string): ResumeTemplateInfo | null
  {
    var info = this.templatesInfo.find(ti => ti.id === id);
    if (info === undefined)
      return null;
    return info;
  }

  getTemplatesInfo(): ResumeTemplateInfo[]
  {
    return this.templatesInfo;
  }

  private populateTemplates(): void
  {
    this.templatesInfo = [
      {
        id: '1',
        name: 'Template 1',
        imageUrl: './resume-templates-thumbnail/Template1-Snapshot.png',
        component: Template1Component,
        defaultSections: [
          new SectionInfoText(
            '1',
            BasicResumeSections.Summary,
            '',
            ResumeSectionType.Summary
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
      }
    ];
  }

  isSectionText(section: any): boolean
  {
    // console.log('isSectionText', section);
    // return section.content !== undefined;    
    return section.sectionType === ResumeSectionType.Text || section.sectionType === ResumeSectionType.Summary;
  }

  isSectionProfileEntry(section: any): boolean
  {
    // console.log('isSectionProfileEntry', section);
    // return section.entriesId !== undefined;
    return section.sectionType === ResumeSectionType.ProfileEntry;
  }
}
