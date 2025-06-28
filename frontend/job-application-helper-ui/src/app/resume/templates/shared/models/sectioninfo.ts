import { ResumeSectionType } from "../../../shared/models/resume-section-type";

export class SectionInfoBase
{
    constructor(public title: string, public sectionType: ResumeSectionType, public additionalInfo?: string)
    {
    }
}

export class SectionInfoText extends SectionInfoBase
{

    constructor(title: string, sectionType: ResumeSectionType = ResumeSectionType.Text, public content: string, additionalInfo?: string)
    {
        super(title, sectionType, additionalInfo);
    }
}

export class SectionInfoProfileEntry extends SectionInfoBase
{
    constructor(title: string, public entriesId: string[], additionalInfo?: string)
    {
        super(title, ResumeSectionType.ProfileEntry, additionalInfo);
    }
}