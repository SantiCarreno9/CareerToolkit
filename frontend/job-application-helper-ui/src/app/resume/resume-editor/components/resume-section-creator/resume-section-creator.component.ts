import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { SectionInfoBase, SectionInfoProfileEntry, SectionInfoText } from '../../../templates/shared/models/sectioninfo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ResumeSectionType } from '../../../shared/models/resume-section-type';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-resume-section-creator',
  imports: [ReactiveFormsModule, MatRadioModule, CommonModule, CdkDropList, CdkDrag],
  templateUrl: './resume-section-creator.component.html',
  styleUrl: './resume-section-creator.component.scss'
})
export class ResumeSectionCreatorComponent
{
  ResumeSectionType = ResumeSectionType;
  protected readonly sectionCreatorForm: FormGroup;
  protected sections: any[] = [];
  protected section: any;

  protected resumeSectionType: ResumeSectionType = ResumeSectionType.ProfileEntry;

  @Output() onSubmit = new EventEmitter<any[]>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { sections: any[] })
  {
    if (data)
    {
      this.sections = [...data.sections];
    }
    this.section = new SectionInfoBase('', this.resumeSectionType)
    this.sections.push(this.section);
    this.sectionCreatorForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ])
    });
  }

  get title()
  {
    return this.sectionCreatorForm.get('title');
  }

  get content()
  {
    return this.sectionCreatorForm.get('content');
  }

  protected doesSummarySectionExist(): boolean
  {
    return this.sections.some((section: SectionInfoBase) => section.sectionType === ResumeSectionType.Summary);
  }

  protected doesSkillsSectionExist(): boolean
  {
    return this.sections.some((section: SectionInfoBase) => section.sectionType === ResumeSectionType.Skills);
  }

  protected typeSelectionChanged(selection: MatRadioChange<ResumeSectionType>): void
  {
    this.resumeSectionType = selection.value;
  }

  protected drop(event: CdkDragDrop<string[]>)
  {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  protected submit(): void
  {
    if (this.sectionCreatorForm.invalid)
    {
      this.sectionCreatorForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
    this.section.title = this.sectionCreatorForm.value.title;
    const index = this.sections.findIndex((s) => s === this.section);
    this.sections[index] = (this.resumeSectionType === ResumeSectionType.ProfileEntry) ?
      new SectionInfoProfileEntry(this.sectionCreatorForm.value.title, []) :
      new SectionInfoText(this.sectionCreatorForm.value.title, this.resumeSectionType, '');
    for (let i = 0; i < this.sections.length; i++)
    {
      this.sections[i].id = i.toString();
    }
    this.onSubmit.emit(this.sections);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
