import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot, CanMatch, Route, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanMatch
{
  constructor(public auth: AuthService, public router: Router) { }
  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult>
  {
    if (!this.auth.isAuthenticated())
    {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>
  {
    if (!this.auth.isAuthenticated())
    {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
