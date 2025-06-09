import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResumeService } from '../shared/resume.service';
import { ResumeTemplateInfo } from '../shared/resume-template';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatRadioChange, MatRadioGroup, MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-resume-template-selector',
  imports: [CommonModule, NgOptimizedImage, MatRadioModule],
  templateUrl: './resume-template-selector.component.html',
  styleUrl: './resume-template-selector.component.scss'
})
export class ResumeTemplateSelectorComponent
{
  resumeService = inject(ResumeService);
  templates: ResumeTemplateInfo[] = [];
  @Input() acceptButtonText: string = "Select"

  selectedTemplate?: ResumeTemplateInfo;
  @Output() onSelectTemplate = new EventEmitter<ResumeTemplateInfo>();
  @Output() onCancel = new EventEmitter<void>();

  constructor()
  {
    this.templates = [...this.resumeService.getTemplatesInfo()]
  }

  templateSelectionChanged(selection: MatRadioChange<ResumeTemplateInfo>): void
  {
    this.selectedTemplate = { ...selection.value };
  }

  selectTemplate(): void
  {
    if (this.selectedTemplate !== undefined)
      this.onSelectTemplate.emit(this.selectedTemplate);
  }

  cancel(): void
  {
    this.onCancel.emit();
  }
}
