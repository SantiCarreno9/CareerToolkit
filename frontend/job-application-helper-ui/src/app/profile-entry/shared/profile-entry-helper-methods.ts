import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";
import { HelperMethods } from "../../core/helper-methods";
import { ExperienceEntry } from "../../core/models/experience-entry";
import { ProfileEntry } from "./models/profile-entry";
import { ProfileEntryCommand } from "./models/profile-entry-command";

export class ProfileEntryHelperMethods
{
    public static convertResponseToProfileEntry(response: any | null): ProfileEntry | null
    {
        if (response === null)
            return response;

        if (response as ProfileEntry === undefined)
            return response;

        return {
            id: response.id,
            category: response.category,
            title: response.title,
            organization: response.organization,
            location: response.location,
            startDate: new Date(response.startDate),
            endDate: new Date(response.endDate),
            isCurrent: response.isCurrent,
            description: response.description
        };
    }

    public static convertResponseToProfileEntries(response: any[] | null): ProfileEntry[] | null
    {
        if (response === null)
            return response;

        return response
            .map((res) => ProfileEntryHelperMethods.convertResponseToProfileEntry(res))
            .filter((entry): entry is ProfileEntry => entry !== null);
    }

    public static convertProfileEntryToProfileEntryCommand(entry: ProfileEntry): ProfileEntryCommand
    {
        return {
            id: entry.id,
            category: entry.category,
            title: entry.title,
            organization: entry.organization,
            location: entry.location,
            startDate: HelperMethods.convertDateToDateOnlyString(entry.startDate),
            endDate: entry.endDate !== null ? HelperMethods.convertDateToDateOnlyString(entry.endDate) : null,
            isCurrent: entry.isCurrent,
            description: entry.description
        }
    }

    public static sortEntries(entries: ProfileEntry[]): ProfileEntry[]
    {
        return entries.sort((a, b) =>
        {
            const dateA = a.startDate instanceof Date ? a.startDate : new Date(a.startDate);
            const dateB = b.startDate instanceof Date ? b.startDate : new Date(b.startDate);
            return dateB.getTime() - dateA.getTime();
        });
    }

    public static getTimeframe(startDate: Date, endDate: Date | null): string
    {
        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        const timeFrame = startDate.toLocaleDateString(undefined, dateTimeFormatOptions) +
            (endDate === null
                ? " - Present"
                : " - " +
                endDate.toLocaleDateString(undefined, dateTimeFormatOptions));
        return timeFrame;
    }

    public static getGroupedProfileEntriesByCategory(entries: ProfileEntry[]): { [key in ProfileEntryCategory]?: ProfileEntry[] }
    {
        const grouped: { [key in ProfileEntryCategory]?: ProfileEntry[] } = {};        
        for (const entry of entries)
        {
            const key = entry.category;
            if (!grouped[key])
            {
                grouped[key] = [];
            }
            grouped[key].push(entry);
        }
        return grouped;
    }

    public static convertProfileEntryToExperienceEntry(entry: ProfileEntry): ExperienceEntry
    {
        return {
            id: entry.id,
            title: entry.title,
            organization: entry.organization,
            description: entry.description ? HelperMethods.cleanTextForAI(HelperMethods.convertToPlainText(entry.description)) : '',
        };
    }

    public static getCategoryName(category: ProfileEntryCategory): string
    {        
        switch (category)
        {
            case ProfileEntryCategory.Education:
                return 'Education';
            case ProfileEntryCategory.WorkExperience:
                return 'Work Experience';
            case ProfileEntryCategory.Project:
                return 'Project';
            default:
                return 'Unknown';
        }
    }
}