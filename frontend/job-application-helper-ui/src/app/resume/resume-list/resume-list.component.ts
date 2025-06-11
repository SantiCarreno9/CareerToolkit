import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Resume } from '../shared/models/resume';
import { ResumeCreatorComponent } from '../resume-creator/resume-creator.component';
import { ResumeService } from '../shared/resume.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-resume-list',
  imports: [CommonModule, DialogModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.scss'
})
export class ResumeListComponent
{
  protected resumeService = inject(ResumeService);
  protected dialog = inject(Dialog);
  protected router = inject(Router);

  protected page: number = 1;
  protected pageSize: number = 15;

  protected resumes: Resume[] = [];

  protected isLoading: boolean = false;

  constructor()
  {
    this.requestResumes();
  }

  private requestResumes(): void
  {
    this.isLoading = true;
    this.resumeService.getResumes(this.page, this.pageSize).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.resumes = res.value.items;
      }
      this.isLoading = false;
    })
  }

  protected openResumeCreatorDialog(quickResume: boolean): void
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

  protected deleteResume(id: string, index: number): void
  {
    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Resume', 'Do you want to delete this resume?', () =>
    {
      this.resumeService.deleteResume(id).subscribe(res =>
      {
        if (res.success)
          this.resumes.splice(index, 1);
      })
    });
  }

  protected goToResumeViewer(id: string): void
  {
    this.router.navigate([`/resume/${id}`]);
  }

  protected goToResumeEditor(id: string): void
  {
    this.router.navigate([`/edit-resume/${id}`]);
  }
}
