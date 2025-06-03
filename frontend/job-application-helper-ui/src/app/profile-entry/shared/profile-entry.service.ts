import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { ProfileEntry } from './profile-entry';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';

@Injectable({
  providedIn: 'root'
})
export class ProfileEntryService
{
  private readonly baseUrl = 'http://localhost:5100/api/profile-entries';

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
  // getUserInfo(): Observable<RequestResponse<UserInfo>>
  // {
  //   return this.http.get(`${this.baseUrl}/myinfo`, { withCredentials: true, observe: 'response' }).pipe(
  //     map((res) => new RequestResponse<UserInfo>(res.status === 200, res.body as UserInfo, res.statusText)));
  // }

  // updateUserInfo(id: string, data: UpdateUserInfoModel): Observable<RequestResponse<any>>
  // {
  //   return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' }).pipe(
  //     map((res) => new RequestResponse<any>(res.status === 204, null, res.statusText))
  //   );
  // }
}
