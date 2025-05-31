import { KeyValue } from "@angular/common";

export interface UserInfo
{
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    additionalContactInfo: KeyValue<string, string>[];
}
