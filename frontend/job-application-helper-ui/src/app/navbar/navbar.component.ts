import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { UserBasicInfo } from '../auth/shared/user-basic-info';
import { Router } from '@angular/router';

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
  isLoggedIn: boolean = false;

  constructor()
  {
    this.authService.onLoggedInStatusChange.subscribe({
      next: (isLoggedIn) =>
      {
        console.log('NavbarComponent: isLoggedIn status changed:', isLoggedIn);        
        this.isLoggedIn = isLoggedIn;
      }
    });
  }

  logout()
  {
    this.authService.logout().subscribe(res =>
    {
      if (res.status == 204)
      {
        this.route.navigate(['/login']);
      }
    });
    // this.authService.logout().subscribe(res =>
    // {
    //   if (res.status == 204)
    //   {
    //     this.isLoggedIn = false;
    //     this.userBasicInfo = {
    //       fullName: '',
    //       email: '',
    //       id: ''
    //     };
    //     this.route.navigate(['/login']);
    //   }
    //   else
    //   {
    //     alert('Logout failed');
    //   }
    // });
  }
}
