import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Resume } from '../shared/resume';
import { ResumeCreatorComponent } from '../resume-creator/resume-creator.component';
import { ResumeService } from '../shared/resume.service';
import { PagedList } from '../../core/models/pagedlist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-list',
  imports: [CommonModule, DialogModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.scss'
})
export class ResumeListComponent
{
  resumeService = inject(ResumeService);
  dialog = inject(Dialog);
  router = inject(Router);

  page: number = 1;
  pageSize: number = 15;

  resumes: Resume[] = [];

  constructor()
  {
    this.requestResumes();
    // const resume1 = new Resume();
    // resume1.id = '1';
    // resume1.name = 'Resume 1';
    // resume1.modifiedAt = new Date(2025, 4, 5, 9, 59);

    // const resume2 = new Resume();
    // resume2.id = '2';
    // resume2.name = 'Resume 2';
    // resume2.modifiedAt = new Date(2024, 4, 5, 9, 59);
    // this.mockResumes = [
    //   resume1,
    //   resume2
    // ];
  }

  private requestResumes(): void
  {
    this.resumeService.getResumes(this.page, this.pageSize).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.resumes = res.value.items;
      }
    })
  }

  openResumeCreatorDialog(quickResume: boolean): void
  {
    const dialogRef = this.dialog.open(ResumeCreatorComponent, {
      width: '500px',
      data: {
        quickResume: quickResume
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });

    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    })
  }

  goToResumeEditor(id: string): void
  {
    this.router.navigate([`/resume/${id}`]);
  }
}
