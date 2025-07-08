import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
import { environment } from '../../../environments/environment';
import { UserInfo } from '../../user/shared/models/user-info';
import { UpdateUserInfoModel } from '../../user/shared/models/update-user-info-model';

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
      map((res) => new RequestResponse<UserInfo>(res.status === 200, res.body as UserInfo, res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  updateUserInfo(id: string, data: UpdateUserInfoModel): Observable<RequestResponse<any>>
  {
    return this.http.put(`${this.baseUrl}/${id}`, data, { withCredentials: true, observe: 'response' }).pipe(
      map((res) => new RequestResponse<any>(res.status === 204, null, res.statusText)),      
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }
}
