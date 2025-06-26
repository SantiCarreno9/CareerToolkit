import { Injectable } from '@angular/core';
import { BasicResumeSections } from '../../shared/models/basic-resume-sections';
import { SectionInfoBase, SectionInfoProfileEntry, SectionInfoText } from './models/sectioninfo';
import { ResumeTemplate1Component } from '../template1/resume-template-1.component';
import { ResumeTemplateInfo } from '../../shared/models/resume-template';
import { ResumeSectionType } from '../../shared/models/resume-section-type';
import { ResumeTemplate2Component } from '../resume-template-2/resume-template-2.component';

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
    return { ...info };
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
        component: ResumeTemplate1Component,
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
          ),
          new SectionInfoText(
            '4',
            BasicResumeSections.Skills,
            ''
          )
        ]
      },
      {
        id: '2',
        name: 'Template 2',
        imageUrl: './resume-templates-thumbnail/Template2-Snapshot.png',
        component: ResumeTemplate2Component,
        defaultSections: [
          new SectionInfoProfileEntry(
            '1',
            BasicResumeSections.WorkExperience,
            []
          ),
          new SectionInfoProfileEntry(
            '2',
            BasicResumeSections.Education,
            []
          ),
          new SectionInfoText(
            '3',
            'Skills',
            ''
          )
        ]
      }
    ];
  }

  isSectionText(section: any): boolean
  {
    return section.sectionType !== ResumeSectionType.ProfileEntry;
  }

  isSectionProfileEntry(section: any): boolean
  {
    return section.sectionType === ResumeSectionType.ProfileEntry;
  }
}
