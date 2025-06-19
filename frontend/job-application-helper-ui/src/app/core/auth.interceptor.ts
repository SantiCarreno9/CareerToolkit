// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>
{
    // const authEvents = inject(AuthEventService);    
    const authService = inject(AuthService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) =>
        {
            if (error.status === 401)
            {
                return authService.refreshLoginWithCookies().pipe(
                    switchMap(() =>
                    {
                        // Retry the original request
                        return next(req);
                    }),
                    catchError(err =>
                    {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            // return next(req);
            return throwError(() => error);
        })
    );
}
