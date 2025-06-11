import { Component, inject, Input, OnInit } from "@angular/core";
import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";
import { Resume } from "../shared/models/resume";
import { ResumeInfo } from "../shared/models/resume-info";
import { SectionInfoProfileEntry, SectionInfoText } from "./shared/models/sectioninfo";
import { CommonModule } from "@angular/common";
import { BasicResumeSections } from "../shared/models/basic-resume-sections";
import { ResumeService } from "../shared/resume.service";
import { ResumeTemplateService } from "./shared/resume-template.service";
import { ResumeTemplateInfo } from "../shared/models/resume-template";

@Component({
    selector: 'app-resume-template-1',
    imports: [CommonModule],
    template: ``
})
export abstract class TemplateBase implements OnInit
{
    resumeInfo: ResumeInfo;
    protected resumeService = inject(ResumeService);
    protected templateService = inject(ResumeTemplateService);
    @Input() resume: Resume = new Resume();

    constructor()
    {
        this.resumeInfo = {
            templateId: '1',
            sections: []
        }
    }

    ngOnInit(): void
    {
        if (this.resume.resumeInfo.sections.length === 0)
        {
            this.defineBasicLayout();
            this.setUpDefaultLayout();
            return;
        }
        this.resumeInfo = {...this.resume.resumeInfo};
    }

    protected getProfileEntriesIds(category: ProfileEntryCategory): string[]
    {
        return this.resume.profileEntries.filter(pe => pe.category === category).map(pe => pe.id);
    }

    setUpDefaultLayout(): void
    {
        const educationIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.Education);
        if (educationIndex !== -1)
            this.resumeInfo.sections[educationIndex].entriesId = this.getProfileEntriesIds(ProfileEntryCategory.Education);

        const experienceIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.WorkExperience);
        if (experienceIndex !== -1)
            this.resumeInfo.sections[experienceIndex].entriesId = this.getProfileEntriesIds(ProfileEntryCategory.WorkExperience);
    }

    defineBasicLayout(): void
    {
        const templateInfo: ResumeTemplateInfo | null = this.templateService.getTemplateInfoById(this.resumeInfo.templateId);
        if (templateInfo !== null)
        {
            this.resumeInfo.sections = [...templateInfo.defaultSections];
            // this.resume.resumeInfo.sections = [...templateInfo.defaultSections];
        }
    }
}