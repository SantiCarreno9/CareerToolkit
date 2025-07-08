import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DisplayMessageService
{
  private snackBar = inject(MatSnackBar);  

  showMessage(message: string, action: string='Dismiss', durationInSeconds:number=5)
  {
    this.snackBar.open(message, action, { duration: durationInSeconds * 1000 });
  }
}
