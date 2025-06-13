import { ProfileEntryCategory } from "../../../core/enums/profile-entry-category";


export interface ProfileEntryCommand {
    id: string;    
    category: ProfileEntryCategory;
    title: string;
    organization: string;
    location: string;    
    startDate: string;
    endDate: string|null;
    isCurrent: boolean;
    description?: string;
}
