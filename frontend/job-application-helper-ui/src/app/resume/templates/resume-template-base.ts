import { Component, inject, Input, OnInit } from "@angular/core";
import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";
import { Resume } from "../shared/models/resume";
import { ResumeInfo } from "../shared/models/resume-info";
import { CommonModule } from "@angular/common";
import { ResumeTemplateService } from "./shared/resume-template.service";
import { ResumeTemplateInfo } from "../shared/models/resume-template";
import { ResumeService } from "../../core/services/resume.service";
import { ProfileEntry } from "../../profile-entry/shared/models/profile-entry";
import { SectionInfoProfileEntry } from "./shared/models/sectioninfo";
import { ProfileEntryHelperMethods } from "../../profile-entry/shared/profile-entry-helper-methods";
import { ResumeHelperMethods } from "../shared/resume-helper-methods";
import { HelperMethods } from "../../core/helper-methods";
import { ContactInfo, ContactOptions } from "../shared/models/user-personal-info";
import { ContactItem } from "./shared/models/contact-item";

@Component({
    selector: 'app-resume-template-1',
    imports: [CommonModule],
    template: ``
})
export abstract class ResumeTemplateBase implements OnInit
{
    ProfileEntryHelperMethods = ProfileEntryHelperMethods;
    HelperMethods = HelperMethods;
    protected resumeService = inject(ResumeService);
    protected templateService = inject(ResumeTemplateService);

    @Input() resume: Resume = new Resume();

    resumeInfo: ResumeInfo;

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
            this.createSectionsFromImportedInfo();
            return;
        }
        this.resumeInfo = { ...this.resume.resumeInfo };
    }

    protected getProfileEntriesIds(category: ProfileEntryCategory[]): string[]
    {
        return this.resume.profileEntries.filter(pe => category.includes(pe.category)).map(pe => pe.id);
    }

    createSectionsFromImportedInfo(): void
    {
        if (this.resume.profileEntries.length == 0)
            return;

        const groupedEntries = ProfileEntryHelperMethods.getGroupedProfileEntriesByCategory(this.resume.profileEntries);
        for (const categoryKey in groupedEntries)
        {
            const category = Number(categoryKey) as ProfileEntryCategory;
            const entries = groupedEntries[category];

            if (entries && entries.length > 0)
            {
                const sectionName = ResumeHelperMethods.getProfileEntrySectionNameByCategory(category);
                const section = new SectionInfoProfileEntry(
                    sectionName,
                    entries.map(e => e.id)
                );
                this.resumeInfo.sections.push(section);
            }
        }

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

    getProfileEntryById(id: string): ProfileEntry | any
    {
        return this.resume.profileEntries.find(r => r.id === id);
    }

    protected getTimeFrame(entry: ProfileEntry): string
    {

        const dateFormat: any = {
            locales: undefined,
            options: {
                year: "numeric",
                month: "short"
            }
        };
        const startDate = new Date(entry.startDate);
        const endDate = entry.endDate ? new Date(entry.endDate) : new Date();
        const timeFrame = startDate.toLocaleDateString(dateFormat.locales, dateFormat.options) +
            (entry.isCurrent
                ? " - Present"
                : " - " +
                endDate.toLocaleDateString(dateFormat.locales, dateFormat.options));
        return timeFrame;
    }

    getContactItems(contactInfo: ContactInfo[]): ContactItem[]
    {
        const contactItems = contactInfo.map(ci => ({
            contactOption: ci.name as ContactOptions,
            displayText: ci.displayText,
            isUrl: ci.isUrl,
            url: ci.isUrl ? ci.value : undefined,
            icon: ResumeHelperMethods.getContactIcon(ci.name)
        }));        
        return contactItems as ContactItem[];
    }
}