import { Component, inject, ViewChild } from '@angular/core';
import { Resume } from '../shared/models/resume';
import { ResumeTemplateService } from '../templates/shared/resume-template.service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../../core/services/resume.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResumeBasicInfoViewComponent } from '../resume-basic-info-view/resume-basic-info-view.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-display-resume',
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './display-resume.component.html',
  styleUrl: './display-resume.component.scss'
})
export class DisplayResumeComponent
{
  private dialog = inject(Dialog);
  private templateService: ResumeTemplateService = inject(ResumeTemplateService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);

  protected resume: Resume = new Resume();
  protected template: any;
  private resumeId: string | null;

  @ViewChild(NgComponentOutlet, { static: false }) ngComponentOutlet?: NgComponentOutlet;
  // readonly resume: Resume;
  constructor()
  {
    this.resumeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.resumeId === null)
    {
      this.goBack();
      return;
    }

    this.requestResumeData();
  }

  protected requestResumeData()
  {
    if (this.resumeId === null)
      return;

    this.resumeService.getResumeById(this.resumeId).subscribe(res =>
    {
      if (!res.success || !res.value)
      {
        this.goBack();
        return;
      }

      this.resume = res.value;
      this.updateTemplate();
    })
  }

  updateTemplate(): void
  {
    const templateInfo = this.templateService.getTemplateInfoById(this.resume.resumeInfo.templateId);
    if (templateInfo === null)
      return;

    this.template = templateInfo.component;
    setTimeout(() =>
    {
      this.retrieveTemplateData()
    }, 100);
  }

  retrieveTemplateData(): void
  {
    if (this.ngComponentOutlet)
    {
      const componentInstance = this.ngComponentOutlet.componentInstance;
      this.resume.resumeInfo = componentInstance.resumeInfo;
    }
  }

  protected openViewBasicInfoDialog(): void
  {
    const dialogRef = this.dialog.open(ResumeBasicInfoViewComponent, {
      data: {
        name: this.resume.name,
        keywords: this.resume.keywords,
        jobPosting: this.resume.jobPosting
      },      
      panelClass: ['custom-dialog-container', 'p-3'],
      disableClose: true
    });
    dialogRef.componentInstance?.onClose.subscribe(() =>
    {
      dialogRef.close();
    });
  }

  protected goBack(): void
  {
    this.router.navigate(['/resumes']);
  }

  protected download(): void
  {
    document.title = this.resume.name;
    window.print();
  }

  protected get modifiedAtTime()
  {
    const time = this.resume.modifiedAt.toLocaleTimeString();
    return 'Last time saved: ' + time;
  }
}
