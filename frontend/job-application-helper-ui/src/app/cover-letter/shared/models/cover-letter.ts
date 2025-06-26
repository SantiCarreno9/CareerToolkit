import { HelperMethods } from "../../../core/helper-methods";
import { OrganizationInfo } from "./organization-info";
import { UserContactInfo } from "./user-info-cover-letter";

export class CoverLetter
{
    id: string;
    name: string;
    userInfo: UserContactInfo;
    jobPosition: string;
    organizationInfo: OrganizationInfo;
    content: string;
    resumeId: string | null;
    jobPosting: string | null;
    date: Date;
    keywords: string[];
    createdAt: Date;
    modifiedAt: Date;

    constructor()
    {
        this.id = '';
        this.name = '';
        this.jobPosition = '';
        this.userInfo = {
            fullName: '',
            phoneNumber: '',
            address: '',
            email: ''
        };
        this.organizationInfo = {
            recipientName: null,
            recipientInfo: null,
            organizationName: '',
            organizationAddress: null
        }
        this.content = '';
        this.resumeId = null;
        this.jobPosting = null;
        this.date = new Date();
        this.keywords = [];
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }

    getPhoneNumber(): string | null
    {
        return HelperMethods.getFormattedPhoneNumber(this.userInfo.phoneNumber);
    }

    getDate(): string | null
    {
        const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
            // timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        return this.date.toLocaleDateString(undefined, dateTimeFormatOptions);
    }

    getContent(): string | null
    {
        return HelperMethods.cleanHtmlString(this.content);
    }

}