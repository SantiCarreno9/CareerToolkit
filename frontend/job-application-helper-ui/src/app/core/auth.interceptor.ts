// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthEventService } from './services/auth-event.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authEvents: AuthEventService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authEvents.triggerUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }
}
