import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";

export interface ProfileEntry {
    id: string;    
    category: ProfileEntryCategory;
    title: string;
    organization: string;
    location: string;    
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    description?: string;
}
