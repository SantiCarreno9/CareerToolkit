import { Inject, Injectable } from '@angular/core';
import { RegisterModel } from '../register/registermodel';
import { LoginModel } from '../login/loginmodel';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { UserBasicInfo } from './user-basic-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private readonly baseUrl = 'http://localhost:5100/api/users';
  onLoggedInStatusChange = new Subject<boolean>();

  isLoggedIn: boolean = false;
  userBasicInfo: UserBasicInfo = {
    fullName: '',
    email: '',
    id: ''
  };

  constructor(private http: HttpClient) {
    this.isAuthenticated().subscribe();
   }

  register(data: RegisterModel): Observable<HttpResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/register`, data, { observe: 'response' });
  }

  loginWithCookies(data: LoginModel): Observable<HttpResponse<any>>
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
      })
    );
  }

  logout(): Observable<HttpResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true, observe: 'response' }).pipe(
      tap(res =>
      {
        this.isLoggedIn = !(res.status === 204);
        this.onLoggedInStatusChange.next(this.isLoggedIn);
      }));
  }

  isAuthenticated(): Observable<boolean>
  {
    return this.getCurrentUser().pipe(
      map(res => res != null)
    );
  }

  // tryToRetrieveUserBasicInfo()
  // {
  //   this.getCurrentUser().subscribe(res =>
  //   {
  //     if (res !== null)
  //     {
  //       this.userBasicInfo = res;
  //       this.isLoggedIn = true;
  //     } else
  //     {
  //       this.userBasicInfo = {
  //         fullName: '',
  //         email: '',
  //         id: ''
  //       };
  //       this.isLoggedIn = false;
  //     }
  //     this.onLoggedInStatusChange.next(this.isLoggedIn);
  //   });
  // }

  getCurrentUser(): Observable<UserBasicInfo>
  {
    return this.http.get<UserBasicInfo>(`${this.baseUrl}/me`, { withCredentials: true }).pipe((
      tap({
        next: (res) =>
        {
          if (res != null)
          {
            this.userBasicInfo = res;
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
    ));
  }
}
