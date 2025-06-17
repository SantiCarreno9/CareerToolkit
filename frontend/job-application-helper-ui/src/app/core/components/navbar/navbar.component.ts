import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit
{  
  protected authService: AuthService = inject(AuthService);
  protected route: Router = inject(Router);

  protected userName: string = '';
  protected isLoggedIn: boolean = false;
  
  ngOnInit(): void
  {
    this.authService.onLoggedInStatusChange.subscribe({
      next: (isLoggedIn:boolean) =>
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
