import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Resume } from '../shared/resume';

@Component({
  selector: 'app-resume-list',
  imports: [CommonModule, DialogModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.scss'
})
export class ResumeListComponent
{

  dialog = inject(Dialog);

  readonly mockResumes: Resume[];

  constructor()
  {
    const resume1 = new Resume();
    resume1.id = '1';
    resume1.name = 'Resume 1';
    resume1.modifiedAt = new Date(2025, 4, 5, 9, 59);

    const resume2 = new Resume();
    resume2.id = '2';
    resume2.name = 'Resume 2';
    resume2.modifiedAt = new Date(2024, 4, 5, 9, 59);
    this.mockResumes = [
      resume1,
      resume2
    ];    
  }

  openResumeCreatorDialog()
  {
    console.log('Hey');
    // const dialogRef = this.dialog
  }
}
