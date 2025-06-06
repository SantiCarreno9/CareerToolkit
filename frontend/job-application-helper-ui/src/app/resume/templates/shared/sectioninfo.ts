export class SectionInfoBase
{
    id: string;
    title: string;

    constructor(id: string, title: string)
    {
        this.id = id;
        this.title = title;
    }
}

export class SectionInfoText extends SectionInfoBase
{
    content: string;

    constructor(id: string, title: string, content: string)
    {
        super(id, title);
        this.content = content;
    }
}

export class SectionInfoProfileEntry extends SectionInfoBase
{
    entriesId: string[];

    constructor(id: string, title: string, entriesId: string[])
    {
        super(id, title);
        this.entriesId = entriesId;
    }
}