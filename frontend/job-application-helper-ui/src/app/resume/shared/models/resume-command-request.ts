
export interface CreateResumeCommandRequest
{
    name: string,
    userInfo: string,
    profileEntries: any[],
    resumeInfo: string,
    keywords: string,
    jobPosting?: string
};

export interface UpdateResumeCommandRequest
{
    id: string,
    name: string,
    userInfo: string,
    profileEntries: any[],
    resumeInfo: string,
    keywords: string,
    jobPosting?: string
}