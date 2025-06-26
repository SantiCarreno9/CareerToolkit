import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RequestResponse } from '../models/requestresponse';
import { PagedList } from '../models/pagedlist';
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';
import { ProfileEntryHelperMethods } from '../../profile-entry/shared/profile-entry-helper-methods';
import { Resume } from '../../resume/shared/models/resume';
import { CreateResumeCommandRequest, UpdateResumeCommandRequest } from '../../resume/shared/models/resume-command-request';
import { LightResume } from '../../resume/shared/models/light-resume';
import { LightCoverLetter } from '../../cover-letter/shared/models/light-cover-letter';
import { CoverLetter } from '../../cover-letter/shared/models/cover-letter';

@Injectable({
  providedIn: 'root'
})
export class CoverLetterService
{
  private readonly baseUrl = environment.apiUrl + 'cover-letters';

  constructor(private http: HttpClient)
  {
  }

  getCoverLetters(searchTerm: string, page: number, pageSize: number): Observable<RequestResponse<PagedList<LightCoverLetter>>>
  {
    return this.http.get(`${this.baseUrl}?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<PagedList<LightCoverLetter>>(res.status === 200, this.convertResponseToPagedList(res.body), res.statusText)))
  }

  getCoverLetterById(id: string): Observable<RequestResponse<CoverLetter>>
  {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<CoverLetter>(res.status === 200, this.convertToCoverLetter(res.body), res.statusText)));
  }

  createCoverLetter(data: Resume): Observable<RequestResponse<CoverLetter>>
  {
    const request: CreateResumeCommandRequest = {
      name: data.name,
      userInfo: data.userInfo,
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
      map((res) => new RequestResponse<CoverLetter>(res.status === 201, this.convertToCoverLetter(res.body), res.statusText)));
  }

  updateCoverLetter(id: string, data: Resume): Observable<RequestResponse<CoverLetter>>
  {
    const request: UpdateResumeCommandRequest = {
      id: data.id,
      name: data.name,
      userInfo: data.userInfo,
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
      map((res) => new RequestResponse<CoverLetter>(res.status === 200, this.convertToCoverLetter(res.body), res.statusText)));
  }

  deleteCoverLetter(id: string): Observable<RequestResponse<any>>
  {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 204, null, res.statusText)));
  }

  private convertToCoverLetter(response: any): Resume
  {
    const resume = new Resume();
    if (response as Resume === undefined)
      return resume;

    resume.id = response.id;
    resume.name = response.name;
    resume.userInfo = response.userInfo;
    resume.profileEntries = ProfileEntryHelperMethods.convertResponseToProfileEntries(response.profileEntries) ?? [];
    resume.resumeInfo = response.resumeInfo !== undefined ? JSON.parse(response.resumeInfo) : { templateId: '1', sections: [] };
    resume.createdAt = new Date(response.createdAt);
    resume.modifiedAt = new Date(response.modifiedAt);    
    resume.keywords = JSON.parse(response.keywords);
    resume.jobPosting = response.jobPosting || null;
    return resume;
  }

  private convertToLightCoverLetter(response: any): LightCoverLetter
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

  private convertResponseToPagedList(response: any): PagedList<LightCoverLetter>
  {
    const pagedList = new PagedList([], response.page, response.pageSize, response.totalCount, response.totalNumberOfPages);
    if (response.items as Resume[] === undefined)
      return pagedList;

    pagedList.items = response.items.map((re: CoverLetter) => this.convertToLightCoverLetter(re));
    return pagedList;
  }
}
