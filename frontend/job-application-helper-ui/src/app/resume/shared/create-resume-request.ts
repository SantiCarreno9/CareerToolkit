import { ProfileEntry } from "../../profile-entry/shared/profile-entry";
import { ResumeInfo } from "./resume-info";
import { UserPersonalInfo } from "./userpersonalinfo";

export interface CreateResumeRequest{
    name:string,
    userInfo:UserPersonalInfo,
    profileEntries:ProfileEntry[],
    resumeInfo:string,
    keywords:string[]
};