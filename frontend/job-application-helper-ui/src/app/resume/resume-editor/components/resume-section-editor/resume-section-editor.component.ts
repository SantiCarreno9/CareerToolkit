import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-section-editor',
  imports: [CommonModule, ReactiveFormsModule, CdkDropList, CdkDrag],
  templateUrl: './resume-section-editor.component.html',
  styleUrl: './resume-section-editor.component.scss'
})
export class ResumeSectionEditorComponent
{
  protected readonly sectionEditorForm: FormGroup;
  protected sections: any[] = [];
  protected sectionIndex: number = 0;
  protected section:any={};

  @Output() onSubmit = new EventEmitter<any[]>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { sectionIndex: number, sections: any[] })
  {
    if (data)
    {
      this.sections =[...data.sections];
      this.sectionIndex = data.sectionIndex;
      this.section = {...this.sections[this.sectionIndex]};
    }
    this.sectionEditorForm = new FormGroup({
      title: new FormControl(this.section.title, [
        Validators.required,
        Validators.minLength(2)
      ])
    });
  }  

  get title()
  {
    return this.sectionEditorForm.get('title');
  }

  protected drop(event: CdkDragDrop<string[]>)
  {
    if (event.previousIndex == this.sectionIndex)
      this.sectionIndex = event.currentIndex;
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

  protected submit(): void
  {
    if (this.sectionEditorForm.invalid)
    {
      this.sectionEditorForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
    this.sections[this.sectionIndex].title = this.sectionEditorForm.value.title;    
    this.onSubmit.emit(this.sections);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
