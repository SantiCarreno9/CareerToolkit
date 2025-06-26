import { Component, inject, ViewChild } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';
import { ResumeService } from '../../core/services/resume.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { LightCoverLetter } from '../shared/models/light-cover-letter';
import { CoverLetterService } from '../../core/services/cover-letter.service';
import { CoverLetterCreatorComponent } from '../cover-letter-creator/cover-letter-creator.component';
import { CoverLetter } from '../shared/models/cover-letter';

@Component({
  selector: 'app-cover-letter-list',
  imports: [CommonModule, DialogModule, MatTooltipModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './cover-letter-list.component.html',
  styleUrl: './cover-letter-list.component.scss'
})
export class CoverLetterListComponent
{
  protected resumeService = inject(ResumeService);
  protected coverLetterService = inject(CoverLetterService);
  protected dialog = inject(Dialog);
  protected router = inject(Router);

  protected length = 0;
  protected pageSize: number = 15;
  protected pageIndex: number = 0;
  protected pageSizeOptions: number[] = [5, 10, 15];
  protected showFirstLastButtons = true;

  protected coverLetters: LightCoverLetter[] = [];

  protected isLoading: boolean = false;
  protected searchTermForm: FormControl = new FormControl('');
  protected selection = new SelectionModel<LightCoverLetter>(true, []);
  displayedColumns: string[] = ['select', 'name', 'modifiedAt', 'keywords','buttons'];

  @ViewChild(MatTable)
  table!: MatTable<LightCoverLetter>;

  constructor()
  {
    this.requestCoverLetters();
  }

  private requestCoverLetters(): void
  {
    this.isLoading = true;
    this.coverLetterService.getCoverLetters(this.searchTermForm.value, this.pageIndex, this.pageSize).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.coverLetters = res.value.items;
        this.length = res.value.totalCount;
      }
      this.isLoading = false;
    })
  }

  protected openCoverLetterCreatorDialog(quickResume: boolean): void
  {
    const dialogRef = this.dialog.open(CoverLetterCreatorComponent, {
      data: {
        // quickResume: quickResume
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });

    dialogRef.componentInstance?.onCoverLetterCreated.subscribe((coverLetter: CoverLetter) =>
    {
      dialogRef.close();
      this.router.navigate([`/edit-cover-letter/${coverLetter.id}`]);
    });
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      dialogRef.close();
    })
  }

  protected deleteCoverLetter(id: string): void
  {
    const index: number = this.coverLetters.findIndex(cl => cl.id === id);
    if (index === -1)
      return;
    ConfirmationDialogComponent.OpenConfirmationDialog(this.dialog, 'Delete Cover Letter', 'Do you want to delete this cover letter?', () =>
    {
      this.resumeService.deleteResume(id).subscribe(res =>
      {
        if (res.success)
          this.coverLetters.splice(index, 1);
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
    this.requestCoverLetters();
  }

  protected search(): void
  {
    this.requestCoverLetters();
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
    const numRows = this.coverLetters.length;
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

    this.selection.select(...this.coverLetters);
  }
}
