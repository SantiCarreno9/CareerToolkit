import { ProfileEntryCategory } from "../../core/enums/profile-entry-category";
import { HelperMethods } from "../../core/helper-methods";
import { UserInfo } from "../../user/shared/models/user-info";
import { ContactOptions, UserPersonalInfo } from "./models/user-personal-info";


export class ResumeHelperMethods
{
    public static getProfileEntrySectionNameByCategory(category: ProfileEntryCategory): string
    {
        switch (category)
        {
            case ProfileEntryCategory.Education:
                return 'Education';
            case ProfileEntryCategory.WorkExperience:
                return 'Work Experience';
            case ProfileEntryCategory.Project:
                return 'Projects';
            default:
                return 'Unknown';
        }
    }

    public static convertUserInfoToUserPersonalInfo(userInfo: UserInfo | any): UserPersonalInfo
    {
        const userPersonalInfo: UserPersonalInfo = {
            fullName: '',
            contactInfo: []
        };

        const isOldUserInfo: boolean = userInfo.AdditionalContactInfo === undefined;
        userPersonalInfo.fullName = isOldUserInfo ? userInfo.fullName : userInfo.FullName;
        const address = isOldUserInfo ? userInfo.address : userInfo.Address;
        if (!HelperMethods.isNullOrEmpty(address))
        {
            userPersonalInfo.contactInfo.push(
                {
                    name: ContactOptions.Address,
                    value: address,
                    displayText: address,
                    isUrl: false
                }
            );
        }
        const phoneNumber = isOldUserInfo ? userInfo.phoneNumber : userInfo.PhoneNumber;
        if (!HelperMethods.isNullOrEmpty(phoneNumber))
        {
            userPersonalInfo.contactInfo.push({
                name: ContactOptions.PhoneNumber,
                value: phoneNumber,
                displayText: HelperMethods.getFormattedPhoneNumber(phoneNumber) ?? phoneNumber,
                isUrl: false
            }
            );
        }
        const email = isOldUserInfo ? userInfo.email : userInfo.Email;
        if (!HelperMethods.isNullOrEmpty(email))
        {
            userPersonalInfo.contactInfo.push(
                {
                    name: ContactOptions.Email,
                    value: 'mailto:'+email,
                    displayText: email,
                    isUrl: true
                }
            );
        }
        const additionalContactInfo = isOldUserInfo ? userInfo.additionalContactInfo : userInfo.AdditionalContactInfo;
        if (additionalContactInfo !== null &&
            additionalContactInfo !== undefined)
        {
            const additionalContactKeys = Object.keys(additionalContactInfo);
            for (const key of additionalContactKeys)
            {
                const url = additionalContactInfo[key];
                let displayText = '';
                if (this.doesWebsiteHaveUsername(key as ContactOptions))
                {
                    displayText = ResumeHelperMethods.getUsername(url);                                        
                }
                else
                {                                      
                    displayText = HelperMethods.cleanUrl(url);
                }

                userPersonalInfo.contactInfo.push({
                    name: key as ContactOptions,
                    value: additionalContactInfo[key],
                    displayText: displayText,
                    isUrl: true
                })
            }
        }

        return userPersonalInfo;
    }

    public static doesWebsiteHaveUsername(contact: ContactOptions): boolean
    {
        console.log(contact);
        return !(contact === ContactOptions.Email ||
            contact === ContactOptions.Portfolio ||
            contact === ContactOptions.Website ||
            contact === ContactOptions.Other)
    }

    public static getUsername(url: string): string
    {
        return url.split('/').at(url.at(-1) === '/' ? -2 : -1) ?? '';
    }

    public static getContactIcon(contact: string): string
    {
        switch (contact)
        {
            case ContactOptions.Email:
                return '<i class="bi bi-envelope"></i>';
            case ContactOptions.PhoneNumber:
                return '<i class="bi bi-telephone"></i>'
            case ContactOptions.Address:
                return '<i class="bi bi-geo-alt"></i>'
            case ContactOptions.LinkedIn:
                return '<i class="bi bi-linkedin"></i>';
            case ContactOptions.GitHub:
                return '<i class="bi bi-github"></i>';
            case ContactOptions.Portfolio:
                return '<i class="bi bi-globe"></i>';
            default:
                return '';
        }
    }
}