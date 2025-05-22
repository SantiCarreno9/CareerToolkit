import { Component, inject } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginModel } from './loginmodel';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
userService: UserService = inject(UserService);

  loginForm = new FormGroup({    
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required      
    ])
  });
  
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  login()
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
    this.userService.login(loginData);
  }
}
