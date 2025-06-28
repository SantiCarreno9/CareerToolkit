export interface UserPersonalInfo
{
    fullName: string;
    contactInfo: ContactInfo[]
};

export interface ContactInfo
{
    name: string,
    value: string,
    displayText?: string,
    isUrl:boolean
};

export enum ContactOptions {    
    PhoneNumber='Phone Number',
    Address='Address',
    Email='Email',
    LinkedIn = 'LinkedIn',
    GitHub = 'GitHub',
    Website = 'Website',
    Portfolio = 'Portfolio',
    Facebook = 'Facebook',
    Twitter = 'Twitter',
    Instagram = 'Instagram',
    YouTube = 'YouTube',
    Other = 'Other'
}
