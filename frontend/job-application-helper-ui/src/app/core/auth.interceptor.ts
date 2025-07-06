import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { EMPTY, Observable, catchError, switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>
{
    const authService = inject(AuthService);
    const router = inject(Router);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) =>
        {
            if (error.status === 401)
            {
                if (!req.url.includes('refresh-token'))
                {
                    return authService.refreshLoginWithCookies().pipe(
                        switchMap(res =>
                        {
                            if (res.success)
                            {
                                return next(req);
                            } else
                            {
                                router.navigate(['login']);
                                return EMPTY;
                            }
                        })
                    );
                }
                else
                {
                    router.navigate(['login']);
                    return EMPTY;
                }
            }
            if (error.status === 429)
                return EMPTY;
            throw error;
        })
    );
}
