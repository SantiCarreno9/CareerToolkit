import { ProfileEntry } from "../../../profile-entry/shared/models/profile-entry";
import { UserPersonalInfo } from "./userpersonalinfo";

export interface CreateResumeCommandRequest
{
    name: string,
    userInfo: UserPersonalInfo,
    profileEntries: any[],
    resumeInfo: string,
    keywords: string[]
};

export interface UpdateResumeCommandRequest
{
    id: string,
    name: string,
    userInfo: UserPersonalInfo,
    profileEntries: any[],
    resumeInfo: string,
    keywords: string[]
}