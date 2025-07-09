import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit
{

  title = 'job-application-helper-ui';
  protected authService = inject(AuthService);
  protected isCheckingLoggedInStatus: boolean = false;

  ngOnInit(): void
  {
    // this.isCheckingLoggedInStatus = false;
    this.authService.getCurrentUser().subscribe(res =>
    {
      // this.isCheckingLoggedInStatus = false;
    });
    // this.authService.onLoggedInStatusChange$.subscribe((isLoggedIn: boolean) =>
    // {
    //   this.isLoggedIn = isLoggedIn;
    //   this.userName = this.authService.userBasicInfo.fullName.split(" ")[0]
    // });
  }

}
