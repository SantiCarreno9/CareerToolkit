import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from '../shared/models/loginmodel';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DisplayMessageService } from '../../core/services/display-message.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent
{
  protected authService: AuthService = inject(AuthService);
  protected route = inject(Router);  
  private displayMessageService = inject(DisplayMessageService);

  protected isLoggingIn: boolean = false;

  protected loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });


  protected get email()
  {
    return this.loginForm.get('email');
  }
  protected get password()
  {
    return this.loginForm.get('password');
  }

  protected login(): void
  {
    if (this.loginForm.invalid)
    {
      // alert('Please fill in all fields');
      return;
    }
    const loginData: LoginModel = {
      email: this.loginForm.get('email')?.value ?? '',
      password: this.loginForm.get('password')?.value ?? ''
    }
    this.isLoggingIn = true;
    this.authService.loginWithCookies(loginData).subscribe(res =>
    {
      this.isLoggingIn = false;
      if (res.success)
      {
        this.loginForm.reset();
        this.route.navigate(['/']);
      }
      else
      {
        this.displayMessageService.showMessage('Login failed: ' + res.error);
      }
    }
    );
  }
}
