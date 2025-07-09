import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { RequestResponse } from '../../core/models/requestresponse';
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
  private onLoggedInStatusChange = new Subject<boolean>();
  private isCheckingAuthState = new Subject<boolean>();

  onLoggedInStatusChange$ = this.onLoggedInStatusChange.asObservable();
  isCheckingAuthState$ = this.isCheckingAuthState.asObservable();

  isLoggedIn: boolean = false;
  userBasicInfo: UserBasicInfo = {
    fullName: '',
    email: '',
    id: ''
  };

  constructor(private http: HttpClient)
  {
  }

  register(data: RegisterModel): Observable<RequestResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/register`, data, { observe: 'response' }).pipe(
      map(res => new RequestResponse<void>(res.status === 204, null, res.statusText))
    );
  }

  loginWithCookies(data: LoginModel): Observable<RequestResponse<any>>
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
      map((res) => new RequestResponse<void>(res.status === 200, null, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        this.isLoggedIn = false;
        this.onLoggedInStatusChange.next(false);
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  logout(): Observable<RequestResponse<any>>
  {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true, observe: 'response' }).pipe(
      tap(res =>
      {
        this.isLoggedIn = !(res.status === 204);
        this.onLoggedInStatusChange.next(this.isLoggedIn);
      }),
      map(res => new RequestResponse<void>(res.status === 204, null, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }

  isAuthenticated(): Observable<boolean>
  {    
    return this.getCurrentUser().pipe(
      map(res => res != null)
    );
  }

  getCurrentUser(): Observable<RequestResponse<UserBasicInfo>>
  {
    this.isCheckingAuthState.next(true);
    return this.http.get(`${this.baseUrl}/me`, { withCredentials: true, observe: 'response' }).pipe(
      map(res => new RequestResponse<UserBasicInfo>(res.status === 200, res.body as UserBasicInfo, res.statusText)),
      tap({
        next: (res) =>
        {
          this.isCheckingAuthState.next(false);
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
      }),
      catchError((error: HttpErrorResponse) =>
      {
        this.isCheckingAuthState.next(false);
        return of(new RequestResponse<any>(false, null, error.error));
      })
    );
  }

  checkAuthState()
  {
    this.getCurrentUser().subscribe(res =>
    {
      if (!res.success)
      {
        this.refreshLoginWithCookies().subscribe();
      }
    });
  }

  refreshLoginWithCookies(): Observable<RequestResponse<any>>
  {
    this.isCheckingAuthState.next(true);
    return this.http.post(`${this.baseUrl}/refresh-token?useCookies=true`, null, { withCredentials: true, observe: 'response' }).pipe(
      tap(res =>
      {
        this.isCheckingAuthState.next(false);
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
      map(res => new RequestResponse<void>(res.status === 200, null, res.statusText)),
      catchError((error: HttpErrorResponse) =>
      {
        this.isCheckingAuthState.next(false);
        return of(new RequestResponse<any>(false, null, error.error));
      }));
  }
}
