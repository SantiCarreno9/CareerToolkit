import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResumeTemplateInfo } from '../shared/models/resume-template';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ResumeTemplateService } from '../templates/shared/resume-template.service';

@Component({
  selector: 'app-resume-template-selector',
  imports: [CommonModule, NgOptimizedImage, MatRadioModule],
  templateUrl: './resume-template-selector.component.html',
  styleUrl: './resume-template-selector.component.scss'
})
export class ResumeTemplateSelectorComponent
{
  templateService = inject(ResumeTemplateService);
  templates: ResumeTemplateInfo[] = [];
  @Input() acceptButtonText: string = "Select"

  selectedTemplate?: ResumeTemplateInfo;
  @Output() onSelectTemplate = new EventEmitter<ResumeTemplateInfo>();
  @Output() onCancel = new EventEmitter<void>();

  constructor()
  {
    this.templates = [...this.templateService.getTemplatesInfo()]
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
