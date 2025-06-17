import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { RequestResponse as CustomResponse } from '../../core/models/requestresponse';
import { environment } from '../../../environments/environment';
import { UserBasicInfo } from '../../auth/shared/models/user-basic-info';
import { RegisterModel } from '../../auth/shared/models/registermodel';
import { LoginModel } from '../../auth/shared/models/loginmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private readonly baseUrl = environment.apiUrl + 'users';
  onLoggedInStatusChange = new Subject<boolean>();

  isLoggedIn: boolean = false;
  userBasicInfo: UserBasicInfo = {
    fullName: '',
    email: '',
    id: ''
  };

  constructor(private http: HttpClient)
  {
    this.isAuthenticated().subscribe();
  }

  register(data: RegisterModel): Observable<CustomResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/register`, data, { observe: 'response' }).pipe(
      map(res => new CustomResponse<void>(res.status === 204, null, res.statusText))
    );
  }

  loginWithCookies(data: LoginModel): Observable<CustomResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/login?useCookies=true`, data, { withCredentials: true, observe: 'response' }).pipe(
      tap(res =>
      {
        if (res.status === 200)
        {
          this.isLoggedIn = true;
          this.onLoggedInStatusChange.next(this.isLoggedIn);
        } else
        {
          this.isLoggedIn = false;
          this.onLoggedInStatusChange.next(this.isLoggedIn);
        }
      }),
      map(res => new CustomResponse<void>(res.status === 200, null, res.statusText))
    );
  }

  logout(): Observable<CustomResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true, observe: 'response' }).pipe(
      tap(res =>
      {
        this.isLoggedIn = !(res.status === 204);
        this.onLoggedInStatusChange.next(this.isLoggedIn);
      }),
      map(res => new CustomResponse<void>(res.status === 204, null, res.statusText)));
  }

  isAuthenticated(): Observable<boolean>
  {
    return this.getCurrentUser().pipe(
      map(res => res != null)
    );
  }

  getCurrentUser(): Observable<CustomResponse<UserBasicInfo>>
  {
    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true, observe: 'response' }).pipe(
      map(res => new CustomResponse<UserBasicInfo>(res.status === 200, res.body as UserBasicInfo, res.statusText)),
      tap({
        next: (res) =>
        {
          if (res.success && res.value)
          {
            this.userBasicInfo = res.value;
            this.isLoggedIn = true;
          } else
          {
            this.userBasicInfo = {
              fullName: '',
              email: '',
              id: ''
            };
            this.isLoggedIn = false;
          }
          this.onLoggedInStatusChange.next(this.isLoggedIn);
        }
      })
    );
  }
}
