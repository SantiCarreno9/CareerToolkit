import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/shared/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent
{  
  authService: AuthService = inject(AuthService);
  route: Router = inject(Router);

  protected userName: string = '';
  protected isLoggedIn: boolean = false;

  constructor()
  {
    this.authService.onLoggedInStatusChange.subscribe({
      next: (isLoggedIn) =>
      {
        console.log('NavbarComponent: isLoggedIn status changed:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
        this.userName = this.authService.userBasicInfo.fullName.split(" ")[0]
      }
    });
  }

  protected logout(): void
  {
    this.authService.logout().subscribe(res =>
    {
      if (res.success)
      {
        this.route.navigate(['/login']);
      }
    });
  }
}
