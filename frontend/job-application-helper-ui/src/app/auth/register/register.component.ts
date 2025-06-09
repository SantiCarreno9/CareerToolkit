import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { RegisterModel } from './registermodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent
{
  router = inject(Router);
  authService: AuthService = inject(AuthService);

  registerForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  get fullName()
  {
    return this.registerForm.get('fullName');
  }
  get email()
  {
    return this.registerForm.get('email');
  }
  get password()
  {
    return this.registerForm.get('password');
  }

  register(): void
  {
    if (this.registerForm.invalid)
    {
      // alert('Please fill in all fields');
      return;
    }
    const registerData: RegisterModel = {
      fullName: this.registerForm.value.fullName ?? '',
      email: this.registerForm.get('email')?.value ?? '',
      password: this.registerForm.get('password')?.value ?? ''
    }

    this.authService.register(registerData).subscribe(res =>
    {
      if (res.success)
      {
        alert('Registration successful');
        this.registerForm.reset();
        this.router.navigate(['/login']);
        return;
      }
      else
      {
        alert(res.error);
        return;
      }
    });

  }
}
