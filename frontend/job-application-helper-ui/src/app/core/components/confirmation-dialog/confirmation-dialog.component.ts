import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent
{  
  protected title: string = '';
  protected text: string = '';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { title:string, text: string })
  {
    if (data)
    {
      this.title = data.title;
      this.text = data.text;
    }
  }

  public static OpenConfirmationDialog(dialog:Dialog, title: string, text: string, onConfirm: () => void, onCancel?: () => void)
  {
    const dialogRef = dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: title,
        text: text
      },
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onConfirm.subscribe(() =>
    {
      onConfirm();
      dialogRef.close();
    })
    dialogRef.componentInstance?.onCancel.subscribe(() =>
    {
      onCancel?.();
      dialogRef.close();
    });
  }

  confirm(): void
  {
    this.onConfirm.emit();
  }

  cancel(): void
  {
    this.onCancel.emit();
  }
}
