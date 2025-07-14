import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { PagedList } from '../../core/models/pagedlist';
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ProfileEntryHelperMethods } from '../../profile-entry/shared/profile-entry-helper-methods';
import { Resume } from '../../resume/shared/models/resume';
import { CreateResumeCommandRequest, UpdateResumeCommandRequest } from '../../resume/shared/models/resume-command-request';
import { LightResume } from '../../resume/shared/models/light-resume';
import { ResumeHelperMethods } from '../../resume/shared/resume-helper-methods';
import { ResumeBasicInfo } from '../../resume/shared/models/basic-resume-info';

@Injectable({
  providedIn: 'root'
})
export class ResumeService
{
  private readonly baseUrl = environment.apiUrl + 'resumes';

  constructor(private http: HttpClient)
  {
  }

  getResumes(searchTerm: string, page: number, pageSize: number): Observable<RequestResponse<PagedList<LightResume>>>
  {
    return this.http.get(`${this.baseUrl}?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<PagedList<LightResume>>(res.status === 200, this.convertResponseToPagedList(res.body), res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }))
  }

  getResumeById(id: string): Observable<RequestResponse<Resume>>
  {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  createResume(data: Resume): Observable<RequestResponse<Resume>>
  {
    const request: CreateResumeCommandRequest = {
      name: data.name,
      userInfo: JSON.stringify(data.userInfo),
      profileEntries: data.profileEntries.map((entry: ProfileEntry) => ({
        ...entry,
        startDate: entry.startDate.toISOString().slice(0, 10),
        endDate: entry.endDate !== null ? entry.endDate.toISOString().slice(0, 10) : null
      })),
      resumeInfo: JSON.stringify(data.resumeInfo),
      keywords: JSON.stringify(data.keywords),
      jobPosting: data.jobPosting || ''
    };
    return this.http.post(`${this.baseUrl}`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 201, this.convertToResume(res.body), res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  updateResume(id: string, data: Resume): Observable<RequestResponse<Resume>>
  {
    const request: UpdateResumeCommandRequest = {
      id: data.id,
      name: data.name,
      userInfo: JSON.stringify(data.userInfo),
      profileEntries: data.profileEntries.map((entry: ProfileEntry) => ({
        ...entry,
        startDate: entry.startDate.toISOString().slice(0, 10),
        endDate: entry.endDate !== null ? entry.endDate.toISOString().slice(0, 10) : null
      })),
      resumeInfo: JSON.stringify(data.resumeInfo),
      keywords: JSON.stringify(data.keywords),
      jobPosting: data.jobPosting || ''
    };
    return this.http.put(`${this.baseUrl}/${id}`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  duplicateResume(id: string, resumeBasicInfo: ResumeBasicInfo): Observable<RequestResponse<Resume>>
  {
    const request = {
      id: id,
      name: resumeBasicInfo.name,
      keywords: JSON.stringify(resumeBasicInfo.keywords),
      jobPosting: resumeBasicInfo.jobPosting || ''
    };
    return this.http.post(`${this.baseUrl}/duplicate`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 201, this.convertToResume(res.body), res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  deleteResume(id: string): Observable<RequestResponse<any>>
  {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 204, null, res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  private convertToResume(response: any): Resume
  {
    const resume = new Resume();
    if (response as Resume === undefined)
      return resume;

    resume.id = response.id;
    resume.name = response.name;
    let userInfo = JSON.parse(response.userInfo);
    if (userInfo.contactInfo === undefined)
    {
      //Conversion from previous userInfo object: {FullName,Email,Address,PhoneNumber,AdditionalContactInfo}
      //To {FullName,ContactInfo}
      userInfo = ResumeHelperMethods.convertUserInfoToUserPersonalInfo(userInfo)
    }
    resume.userInfo = userInfo;
    resume.profileEntries = ProfileEntryHelperMethods.convertResponseToProfileEntries(response.profileEntries) ?? [];
    resume.resumeInfo = response.resumeInfo !== undefined ? JSON.parse(response.resumeInfo) : { templateId: '1', sections: [] };
    resume.createdAt = new Date(response.createdAt);
    resume.modifiedAt = new Date(response.modifiedAt);
    resume.keywords = JSON.parse(response.keywords);
    resume.jobPosting = response.jobPosting || null;
    return resume;
  }

  private convertToLightResume(response: any): LightResume
  {
    const resume: LightResume = {
      id: '',
      name: '',
      keywords: [],
      createdAt: new Date(),
      modifiedAt: new Date()
    };
    if (response as LightResume === undefined)
      return resume;

    resume.id = response.id;
    resume.name = response.name;
    resume.keywords = JSON.parse(response.keywords);
    resume.createdAt = new Date(response.createdAt);
    resume.modifiedAt = new Date(response.modifiedAt);
    return resume;
  }

  private convertResponseToPagedList(response: any): PagedList<LightResume>
  {
    const pagedList = new PagedList([], response.page, response.pageSize, response.totalCount, response.totalNumberOfPages);
    if (response.items as Resume[] === undefined)
      return pagedList;

    pagedList.items = response.items.map((re: Resume) => this.convertToLightResume(re));
    return pagedList;
  }
}
