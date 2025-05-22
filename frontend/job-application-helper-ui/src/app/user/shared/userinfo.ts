import { KeyValue } from "@angular/common";

export interface Userinfo
{
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    additionalContactInfo: KeyValue<string, string>[];
}
