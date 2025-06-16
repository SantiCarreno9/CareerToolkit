export interface UserPersonalInfo{    
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    additionalContactInfo: { [key: string]: string };    
}