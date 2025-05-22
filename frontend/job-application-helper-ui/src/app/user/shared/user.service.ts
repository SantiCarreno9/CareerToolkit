import { Injectable } from '@angular/core';
import { RegisterModel } from '../register/registermodel';
import { LoginModel } from '../login/loginmodel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async register(data: RegisterModel): Promise<void>
  {    
    // Simulate a registration process
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User registered:', { fullName: data.fullName, email: data.email, password: data.password });
        resolve();
      }, 1000);
    });
  }

  async login(data: LoginModel): Promise<string>
  {    
    // Simulate a registration process
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Login Successful:', { email: data.email, password: data.password });
        resolve("token");
      }, 1000);
    });
  }
}
