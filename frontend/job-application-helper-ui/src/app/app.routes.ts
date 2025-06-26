import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ResumeListComponent } from './resume/resume-list/resume-list.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { HomeComponent } from './core/components/home/home.component';
import { DisplayResumeComponent } from './resume/displayresume/displayresume.component';
import { ResumeEditorComponent } from './resume/resume-editor/resume-editor.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { CanDeactivateGuard } from './core/services/can-deactivate-guard.service';
import { CoverLetterTemplate1Component } from './cover-letter/templates/cover-letter-template-1/cover-letter-template-1.component';
import { CoverLetterEditorComponent } from './cover-letter/cover-letter-editor/cover-letter-editor.component';
import { CoverLetterListComponent } from './cover-letter/cover-letter-list/cover-letter-list.component';

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
        path: 'resumes',
        component: ResumeListComponent,
        title: 'Resume List',
        canActivate: [AuthGuardService]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile',
        canActivate: [AuthGuardService]
    },
    {
        path: 'edit-resume/:id',
        component: ResumeEditorComponent,
        title: 'Resume Editor',
        canDeactivate: [CanDeactivateGuard],
        canActivate: [AuthGuardService]
    },
    {
        path: 'resume/:id',
        component: DisplayResumeComponent,
        title: 'Resume Viewer',
        canActivate: [AuthGuardService]
    },
    {
        path: 'cover-letters',
        component: CoverLetterListComponent,
        title: 'Cover Letter List',
        canActivate: [AuthGuardService]
    },
    {
        path: 'cover-letter/:id',
        component: CoverLetterTemplate1Component,
        title: 'Cover Letter',
        canActivate: [AuthGuardService]
    },
    {
        path: 'edit-cover-letter/:id',
        component: CoverLetterEditorComponent,
        title: 'Cover Letter Editor',
        canActivate: [AuthGuardService]
    }
];
