import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserInfo } from './models/userinfo';
import { UpdateUserInfoModel } from './models/updateuserinfomodel';
import { RequestResponse } from '../../core/models/requestresponse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService
{
  private readonly baseUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<RequestResponse<UserInfo>>
  {
    return this.http.get(`${this.baseUrl}/myinfo`, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<UserInfo>(res.status === 200, res.body as UserInfo, res.statusText)));
  }

  updateUserInfo(id: string, data: UpdateUserInfoModel): Observable<RequestResponse<any>>
  {
    return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<any>(res.status === 204, null, res.statusText))
    );
  }
}
