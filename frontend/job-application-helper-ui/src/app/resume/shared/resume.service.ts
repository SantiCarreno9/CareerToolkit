import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { Resume } from './resume';
import { ResumeTemplateInfo } from './resume-template';
import { Template1Component } from '../templates/template1/template1.component';
import { PagedList } from '../../core/models/pagedlist';
import { CreateResumeRequest } from './create-resume-request';

@Injectable({
  providedIn: 'root'
})
export class ResumeService
{
  private readonly baseUrl = environment.apiUrl + 'resumes';

  private templatesInfo: ResumeTemplateInfo[] = [];

  constructor(private http: HttpClient)
  {
    this.populateTemplates();
  }

  getTemplateInfoById(id: string): ResumeTemplateInfo | null
  {
    var info = this.templatesInfo.find(ti => ti.id === id);
    if (info === undefined)
      return null;
    return info;
  }

  getTemplatesInfo(): ResumeTemplateInfo[]
  {
    return this.templatesInfo;
  }

  private populateTemplates(): void
  {
    this.templatesInfo = [
      {
        id: '1',
        name: 'Template 1',
        imageUrl: './resume-templates-thumbnail/Template1-Snapshot.png',
        component: Template1Component
      },
      {
        id: '2',
        name: 'Template 2',
        imageUrl: './resume-templates-thumbnail/Template1-Snapshot.png',
        component: Template1Component
      }
    ];
  }

  getResumes(page: number, pageSize: number): Observable<RequestResponse<PagedList<Resume>>>
  {
    return this.http.get(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<PagedList<Resume>>(res.status === 200, res.body as PagedList<Resume>, res.statusText)))
  }

  getResumeById(id: string): Observable<RequestResponse<Resume>>
  {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)));
  }

  createResume(data: Resume): Observable<RequestResponse<Resume>>
  {
    const request: CreateResumeRequest = {
      name: data.name,
      userInfo: data.userInfo,
      profileEntries: data.profileEntries,
      resumeInfo: JSON.stringify(data.resumeInfo),
      keywords: data.keywords
    }
    return this.http.post(`${this.baseUrl}`, request, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<Resume>(res.status === 200, this.convertToResume(res.body), res.statusText)));
  }

  updateResume(id: string, data: Resume): Observable<RequestResponse<Resume>>
  {
    return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' }).pipe(
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
    resume.profileEntries = response.profileEntries;
    resume.resumeInfo = response.resumeInfo !== undefined ? JSON.parse(response.resumeInfo) : { templateId: '1', sections: [] };
    resume.createdAt = response.createdAt;
    resume.modifiedAt = response.modifiedAt;
    return resume;
  }
}
