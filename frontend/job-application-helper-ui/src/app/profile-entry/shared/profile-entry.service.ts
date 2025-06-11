import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { environment } from '../../../environments/environment';
import { ProfileEntry } from './models/profile-entry';

@Injectable({
  providedIn: 'root'
})
export class ProfileEntryService
{
  private readonly baseUrl = environment.apiUrl + 'profile-entries';

  constructor(private http: HttpClient) { }

  profileEntries: ProfileEntry[] = [
    {
      id: '1',
      title: 'Software Engineer',
      category: ProfileEntryCategory.Education,
      organization: 'Tech University',
      location: 'New York, NY',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2022-01-01'),
      isCurrent: false,
      description: 'Completed a Bachelor of Science in Computer Science with a focus on software development.'
    },
    {
      id: '2',
      title: 'Web Developer',
      category: ProfileEntryCategory.WorkExperience,
      organization: 'Web Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: new Date('2022-02-01'),
      endDate: new Date('2023-06-01'),
      isCurrent: false,
      description: 'Developed and maintained web applications using Angular and Node.js.'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      category: ProfileEntryCategory.WorkExperience,
      organization: 'Global Tech Corp.',
      location: 'Remote',
      startDate: new Date('2023-07-01'),
      endDate: new Date(),
      isCurrent: true,
      description: 'Working on full stack development projects, focusing on both front-end and back-end technologies.'
    }
  ];

  getProfileEntries(): Observable<RequestResponse<ProfileEntry[]>>
  {
    return this.http.get<ProfileEntry[]>(`${this.baseUrl}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<ProfileEntry[]>(res.status === 200, this.convertResponseToProfileEntries(res.body), res.statusText))
    );
  }

  getProfileEntryById(id: string): Observable<RequestResponse<ProfileEntry>>
  {
    return this.http.get<ProfileEntry>(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<ProfileEntry>(res.status === 200, this.convertResponseToProfileEntry(res.body), res.statusText))
    );
  }

  getProfileEntriesByCategory(category: ProfileEntryCategory): Observable<RequestResponse<ProfileEntry[]>>
  {
    return this.http.get<ProfileEntry[]>(`${this.baseUrl}/category/${category}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<ProfileEntry[]>(res.status === 200, this.convertResponseToProfileEntries(res.body), res.statusText))
    );
  }

  createProfileEntry(data: ProfileEntry): Observable<RequestResponse<string>>
  {
    return this.http.post<string>(`${this.baseUrl}`, data, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<string>(res.status === 201, res.body, res.statusText))
    );
  }

  updateProfileEntry(id: string, data: ProfileEntry): Observable<RequestResponse<any>>
  {
    return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<any>(res.status === 204, null, res.statusText))
    );
  }

  deleteProfileEntry(id: string): Observable<RequestResponse<any>>
  {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<any>(res.status === 204, null, res.statusText))
    );
  }

  private convertResponseToProfileEntry(response: any | null): ProfileEntry | null
  {
    if(response===null)
      return response;

    if (response as ProfileEntry === undefined)
      return response;

    return {
      id: response.id,
      category: response.category,
      title: response.title,
      organization: response.organization,
      location: response.location,
      startDate: new Date(response.startDate),
      endDate: new Date(response.endDate),
      isCurrent: response.isCurrent,
      description: response.description
    };
  }

  private convertResponseToProfileEntries(response:any[]|null):ProfileEntry[] | null{
    if(response===null)
      return response;

    return response
      .map((res) => this.convertResponseToProfileEntry(res))
      .filter((entry): entry is ProfileEntry => entry !== null);
  }
}
