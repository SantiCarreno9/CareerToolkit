
export interface UserInfo
{
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    additionalContactInfo: { [key: string]: string };
}
