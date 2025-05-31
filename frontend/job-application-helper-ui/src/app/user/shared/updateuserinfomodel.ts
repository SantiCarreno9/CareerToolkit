import { KeyValue } from "@angular/common";

export interface UpdateUserInfoModel
{    
    fullName: string;    
    phoneNumber: string;
    address: string;
    additionalContactInfo: KeyValue<string, string>;
}