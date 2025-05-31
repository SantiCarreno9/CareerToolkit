import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from './userinfo';
import { UpdateUserInfoModel } from './updateuserinfomodel';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private readonly baseUrl = 'http://localhost:5100/api/users';

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<UserInfo>
  {
    return this.http.get<UserInfo>(`${this.baseUrl}/myinfo`, { withCredentials: true });
  }

  updateUserInfo(id: string, data: UpdateUserInfoModel): Observable<HttpResponse<any>>
  {
    return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' });
  }
}
