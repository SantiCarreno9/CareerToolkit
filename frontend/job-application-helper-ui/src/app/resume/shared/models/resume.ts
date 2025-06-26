import { HelperMethods } from "../../../core/helper-methods";
import { ProfileEntry } from "../../../profile-entry/shared/models/profile-entry";
import { ResumeInfo } from "./resume-info";
import { UserPersonalInfo } from "./userpersonalinfo";

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
            phoneNumber: '',
            address: '',
            email: '',
            additionalContactInfo: {}
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

    getPhoneNumber(): string | null
    {        
        return HelperMethods.getFormattedPhoneNumber(this.userInfo.phoneNumber);
    }

    getAdditionalContactInfo(): { [key: string]: string }
    {
        const contactInfo: { [key: string]: string } = {};

        Object.values(this.userInfo.additionalContactInfo).forEach(value =>
        {
            const newKey = value;
            if (value.includes('https://'))
            {
                value = value.slice('https://'.length);
            } else if (value.includes('http://'))
            {
                value = value.slice('http://'.length);
            }

            if (value.includes('www.'))
            {
                value = value.slice('www.'.length);
            }

            contactInfo[newKey] = value;
        });

        return contactInfo;
    }
}