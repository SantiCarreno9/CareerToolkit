import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterModel } from '../shared/models/registermodel';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayMessageService } from '../../core/services/display-message.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent
{
  protected router = inject(Router);
  protected authService: AuthService = inject(AuthService);
  private displayMessageService = inject(DisplayMessageService);

  protected registerForm = new FormGroup({
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

  protected get fullName()
  {
    return this.registerForm.get('fullName');
  }
  protected get email()
  {
    return this.registerForm.get('email');
  }
  protected get password()
  {
    return this.registerForm.get('password');
  }

  protected register(): void
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
        this.displayMessageService.showMessage('Registration successful');
        this.registerForm.reset();
        this.router.navigate(['/login']);
        return;
      }
      else
      {
        if (res.error !== null)
          this.displayMessageService.showMessage(res.error);
        return;
      }
    });

  }
}
