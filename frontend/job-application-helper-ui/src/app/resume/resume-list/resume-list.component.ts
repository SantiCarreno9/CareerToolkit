import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Resume } from '../shared/models/resume';
import { ResumeCreatorComponent } from '../resume-creator/resume-creator.component';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';
import { ResumeService } from '../../core/services/resume.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { LightResume } from '../shared/models/light-resume';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PagedList } from '../../core/models/pagedlist';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-resume-list',
  imports: [CommonModule, DialogModule, MatTooltipModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './resume-list.component.html',
  styleUrl: './resume-list.component.scss'
})
export class ResumeListComponent
{
  protected resumeService = inject(ResumeService);
  protected dialog = inject(Dialog);
  protected router = inject(Router);

  protected length = 0;
  protected pageSize: number = 15;
  protected pageIndex: number = 0;
  protected pageSizeOptions: number[] = [5, 10, 15];
  protected showFirstLastButtons = true;

  protected resumes: LightResume[] = [];

  protected isLoading: boolean = false;
  protected searchTermForm: FormControl = new FormControl('');
  protected selection = new SelectionModel<LightResume>(true, []);
  displayedColumns: string[] = ['select', 'name', 'modifiedAt', 'keywords','buttons'];

  @ViewChild(MatTable)
  table!: MatTable<LightResume>;

  constructor()
  {
    this.requestResumes();
  }

  private requestResumes(): void
  {
    this.isLoading = true;
    this.resumeService.getResumes(this.searchTermForm.value, this.pageIndex, this.pageSize).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.resumes = res.value.items;
        this.length = res.value.totalCount;
      }
      this.isLoading = false;
    })
  }

  protected openResumeCreatorDialog(quickResume: boolean): void
  {
    const dialogRef = this.dialog.open(ResumeCreatorComponent, {
      data: {
        quickResume: quickResume
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });

    dialogRef.componentInstance?.onResumeCreated.subscribe((resume: Resume) =>
    {
      dialogRef.close();
      this.router.navigate([`/edit-resume/${resume.id}`]);
    });
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    })
  }

  protected deleteResume(id: string): void
  {
    const index: number = this.resumes.findIndex(r => r.id === id);
    if (index === -1)
      return;
    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Resume', 'Do you want to delete this resume?', () =>
    {
      this.resumeService.deleteResume(id).subscribe(res =>
      {
        if (res.success)
          this.resumes.splice(index, 1);
        this.length--;
        this.table.renderRows();
      })
    });
  }

  protected handlePageEvent(event: PageEvent)
  {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.requestResumes();
  }

  protected search(): void
  {
    this.requestResumes();
  }

  protected cleanField(): void
  {
    this.searchTermForm.patchValue('');
    this.search();
  }

  protected isFieldEmpty(): boolean
  {
    return this.searchTermForm.value.length > 0;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean
  {
    const numSelected = this.selection.selected.length;
    const numRows = this.resumes.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void
  {
    if (this.isAllSelected())
    {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.resumes);
  }
}
