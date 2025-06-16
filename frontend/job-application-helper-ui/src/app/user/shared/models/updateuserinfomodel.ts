
export interface UpdateUserInfoModel
{    
    fullName: string;    
    phoneNumber: string;
    address: string;
    additionalContactInfo: {[key: string]: string};
}