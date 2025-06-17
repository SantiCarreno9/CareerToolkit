import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ResumeListComponent } from './resume/resume-list/resume-list.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { HomeComponent } from './core/components/home/home.component';
import { DisplayResumeComponent } from './resume/displayresume/displayresume.component';
import { ResumeEditorComponent } from './resume/resume-editor/resume-editor.component';
import { ProfileComponent } from './core/components/profile/profile.component';

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
        // canMatch: [AuthGuardService],
        canActivate:[AuthGuardService]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        // canMatch: [AuthGuardService],
        canActivate:[AuthGuardService]
    },
    {
        path: 'edit-resume/:id',
        component: ResumeEditorComponent,
        title: 'Resume Editor',
        // canMatch: [AuthGuardService],
        canActivate:[AuthGuardService]
    },
    {
        path: 'resume/:id',
        component: DisplayResumeComponent,
        title: 'Resume Viewer',
        // canMatch: [AuthGuardService],
        canActivate:[AuthGuardService]
    }
];
