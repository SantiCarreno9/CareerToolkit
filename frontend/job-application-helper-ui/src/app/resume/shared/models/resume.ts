import { HelperMethods } from "../../../core/helper-methods";
import { ProfileEntry } from "../../../profile-entry/shared/models/profile-entry";
import { ResumeInfo } from "./resume-info";
import { UserPersonalInfo } from "./user-personal-info";

export class Resume
{
    id: string;
    name: string;
    userInfo: UserPersonalInfo;
    profileEntries: ProfileEntry[];
    resumeInfo: ResumeInfo;
    keywords: string[];
    jobPosting: string | null = null;
    createdAt: Date;
    modifiedAt: Date;

    constructor()
    {
        this.id = '';
        this.name = '';
        this.userInfo = {
            fullName: '',
            contactInfo: []
        };
        this.createdAt = new Date();
        this.modifiedAt = new Date();
        this.profileEntries = [];
        this.keywords = [];
        this.resumeInfo = {
            templateId: '',
            sections: []
        };
    }    
}