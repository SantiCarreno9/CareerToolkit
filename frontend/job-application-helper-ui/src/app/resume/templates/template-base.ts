import { Component, Input, OnInit } from "@angular/core";
import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";
import { Resume } from "../shared/resume";
import { ResumeInfo } from "../shared/resume-info";
import { SectionInfoProfileEntry, SectionInfoText } from "./shared/sectioninfo";
import { CommonModule } from "@angular/common";
import { BasicResumeSections } from "./shared/basic-resume-sections";

@Component({
    selector: 'app-resume-template-1',
    imports: [CommonModule],
    template: ``
})
export abstract class TemplateBase implements OnInit
{
    protected resumeInfo: ResumeInfo;
    @Input() resume: Resume = new Resume();

    constructor()
    {
        this.resumeInfo = {
            templateId: '0',
            sections: []
        };
        this.defineBasicLayout();
    }

    ngOnInit(): void
    {
        if (this.resume.resumeInfo.sections.length > 0)
        {
            this.resumeInfo = { ...this.resume.resumeInfo };
            return;
        }
        this.setUpDefaultLayout();
    }

    protected getProfileEntriesIds(category: ProfileEntryCategory): string[]
    {
        return this.resume.profileEntries.filter(pe => pe.category === category).map(pe => pe.id);
    }

    setUpDefaultLayout(): void
    {
        const educationIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.Education);
        if (educationIndex !== -1)
            this.resumeInfo.sections[educationIndex] = this.getProfileEntriesIds(ProfileEntryCategory.Education);

        const experienceIndex = this.resumeInfo.sections.findIndex(s => s.title === BasicResumeSections.WorkExperience);
        if (experienceIndex !== -1)
            this.resumeInfo.sections[experienceIndex] = this.getProfileEntriesIds(ProfileEntryCategory.WorkExperience);
    }

    abstract defineBasicLayout(): void;
}