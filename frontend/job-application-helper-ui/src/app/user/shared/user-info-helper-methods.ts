import { UserPersonalInfo } from "../../resume/shared/models/userpersonalinfo";
import { UserInfo } from "./models/userinfo";

export class UserInfoHelperMethods
{
    public static convertToUserInfo(info: UserPersonalInfo): UserInfo
    {
        return {
            id: '',
            fullName: info.fullName,
            phoneNumber: info.phoneNumber,
            address: info.address,
            email: info.email,
            additionalContactInfo: info.additionalContactInfo
        };
    }
}