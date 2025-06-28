import { Injectable } from '@angular/core';
import { BasicResumeSections } from '../../shared/models/basic-resume-sections';
import { SectionInfoText } from './models/sectioninfo';
import { ResumeTemplate1Component } from '../resume-template-1/resume-template-1.component';
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
            BasicResumeSections.Summary,            
            ResumeSectionType.Summary,
            'A brief paragraph (2–4 sentences) that highlights your core experience, key strengths, and the value you bring to the role. It should be tailored to the job and focus on your most relevant technical skills, areas of expertise, and collaboration strengths.'
          ),          
          new SectionInfoText(
            BasicResumeSections.Skills,            
            ResumeSectionType.Skills,
            'A short list of 2–3 grouped bullet points that organize your technical and soft skills by theme (e.g., Development, Tools, Collaboration). Each bullet should start with a bolded category and list 3–5 related skills using keywords from the job description.'
          )
        ]
      },
      {
        id: '2',
        name: 'Template 2',
        imageUrl: './resume-templates-thumbnail/Template2-Snapshot.png',
        component: ResumeTemplate2Component,
        defaultSections: [
          new SectionInfoText(            
            BasicResumeSections.Summary,            
            ResumeSectionType.Summary,
            'A brief paragraph (2–4 sentences) that highlights your core experience, key strengths, and the value you bring to the role. It should be tailored to the job and focus on your most relevant technical skills, areas of expertise, and collaboration strengths.'
          ),          
          new SectionInfoText(
            BasicResumeSections.Skills,            
            ResumeSectionType.Skills,
            'A short list of 2–3 grouped bullet points that organize your technical and soft skills by theme (e.g., Development, Tools, Collaboration). Each bullet should start with a bolded category and list 3–5 related skills using keywords from the job description.'
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
