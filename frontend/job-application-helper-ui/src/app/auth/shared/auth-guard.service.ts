import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot, CanMatch, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService
{
  constructor(public authService: AuthService, public router: Router) { }
  
  canActivate(
       route: ActivatedRouteSnapshot,
       state: RouterStateSnapshot
     ): Observable<boolean> {
       return this.authService.isAuthenticated().pipe(
         map((isAuthenticated:boolean) => {
           if (isAuthenticated) {
             return true;
           } else {
             this.router.navigate(['/login']); // Redirect to login if not authenticated
             return false;
           }
         })
       );
     }

  // canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult>
  // {
  //   this.authService.isAuthenticated().subscribe((res=>{
  //     return res}));
  //   // if (!this.auth.isAuthenticated().subscribe((res=>{
  //   //   return res;
  //   // })))
  //   // {
  //   //   this.router.navigate(['/login']);
  //   //   return false;
  //   // }
  //   // return true;
  // }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>
  // {
  //   if (!this.auth.isAuthenticated().subscribe())
  //   {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  //   return true;
  // }
}
