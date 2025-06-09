import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ResumeListComponent } from './resume/resume-list/resume-list.component';
import { AuthGuardService } from './auth/shared/auth-guard.service';
import { HomeComponent } from './core/components/home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { Template1Component } from './resume/templates/template1/template1.component';
import { DisplayResumeComponent } from './resume/displayresume/displayresume.component';
import { ResumeEditorComponent } from './resume/resume-editor/resume-editor.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home',
    },
    {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'        
    },
    {
        path: 'resume',
        component: ResumeListComponent,
        title: 'Resume List',
        // canMatch: [AuthGuardService]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        canMatch: [AuthGuardService]
    },
    {
        path: 'resume/:id',
        component: ResumeEditorComponent,
        title: 'Resume'
    }
];
