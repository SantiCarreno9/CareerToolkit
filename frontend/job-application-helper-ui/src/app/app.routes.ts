import { Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ResumeListComponent } from './resume/resume-list/resume-list.component';

export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'resume',
        component: ResumeListComponent,
        title: 'Resume List',
    }
];
