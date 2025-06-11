import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { Resume } from './models/resume';
import { PagedList } from '../../core/models/pagedlist';
import { CreateResumeCommandRequest, UpdateResumeCommandRequest } from './models/resume-command-request';
import { ProfileEntry } from '../../profile-entry/shared/models/profile-entry';

@Injectable({
  providedIn: 'root'
})
export class ResumeService
{
  private readonly baseUrl = environment.apiUrl + 'resumes';

  constructor(private http: HttpClient)
  {
  }

  getResumes(page: number, pageSize: number): Observable<RequestResponse<PagedList<Resume>>>
  {
    return this.http.get(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<PagedList<Resume>>(res.status === 200, this.convertResponseToPagedList(res.body), res.statusText)))
  }

  getResumeById(id: string): Observable<RequestResponse<Resume>>
  {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)));
  }

  createResume(data: Resume): Observable<RequestResponse<Resume>>
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
      keywords: data.keywords
    };
    return this.http.post(`${this.baseUrl}`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)));
  }

  updateResume(id: string, data: Resume): Observable<RequestResponse<Resume>>
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
      keywords: data.keywords
    };            
    return this.http.put(`${this.baseUrl}/${id}`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)));
  }

  deleteResume(id: string): Observable<RequestResponse<any>>
  {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 204, null, res.statusText)));
  }

  private convertToResume(response: any): Resume
  {
    const resume = new Resume();
    if (response as Resume === undefined)
      return resume;

    resume.id = response.id;
    resume.name = response.name;
    resume.userInfo = response.userInfo;
    resume.profileEntries = response.profileEntries.map((entry: ProfileEntry) => ({
      ...entry,
      startDate: new Date(entry.startDate),
      endDate: entry.endDate !== null ? new Date(entry.endDate) : null
    }));
    resume.resumeInfo = response.resumeInfo !== undefined ? JSON.parse(response.resumeInfo) : { templateId: '1', sections: [] };
    resume.createdAt = new Date(response.createdAt);
    resume.modifiedAt = new Date(response.modifiedAt);    
    return resume;
  }

  private convertResponseToPagedList(response: any): PagedList<Resume>
  {
    const pagedList = new PagedList([], response.page, response.pageSize);
    console.log(pagedList);
    if (response.items as Resume[] === undefined)
      return pagedList;

    pagedList.items = response.items.map((re: Resume) => this.convertToResume(re));
    return pagedList;
  }
}
