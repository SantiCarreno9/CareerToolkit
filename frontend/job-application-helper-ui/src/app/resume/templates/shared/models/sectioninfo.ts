import { ResumeSectionType } from "../../../shared/models/resume-section-type";

export class SectionInfoBase
{
    constructor(public id: string, public title: string, public sectionType: ResumeSectionType)
    {
    }
}

export class SectionInfoText extends SectionInfoBase
{

    constructor(id: string, title: string, public content: string, sectionType: ResumeSectionType = ResumeSectionType.Text)
    {
        super(id, title, sectionType);
    }
}

export class SectionInfoProfileEntry extends SectionInfoBase
{

    constructor(id: string, title: string, public entriesId: string[])
    {
        super(id, title, ResumeSectionType.ProfileEntry);
    }
}