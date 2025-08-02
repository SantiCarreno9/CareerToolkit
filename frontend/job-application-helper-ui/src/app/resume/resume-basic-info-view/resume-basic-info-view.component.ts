import { ClipboardModule } from '@angular/cdk/clipboard';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';

@Component({
  selector: 'app-resume-basic-info-view',
  imports: [CommonModule, ClipboardModule],
  templateUrl: './resume-basic-info-view.component.html',
  styleUrl: './resume-basic-info-view.component.scss'
})
export class ResumeBasicInfoViewComponent {
      
  @Output() onClose = new EventEmitter<void>();

  protected name: string = '';
  protected jobPosting: string = '';
  protected keywords: string[] = [];
  protected isLoading: boolean = false;
  
  constructor(@Inject(DIALOG_DATA) public data: { name: string, keywords: string[], jobPosting: string })
  {
    if (data && data.name)
    {
      this.name = data.name;
    }
    if (data && data.jobPosting)
    {
      this.jobPosting = data.jobPosting;
    }
    if (data && data.keywords && data.keywords.length > 0)
    {
      this.keywords = data.keywords;
    }
  }    

  protected close(): void
  {    
    this.onClose.emit();
  }

}
