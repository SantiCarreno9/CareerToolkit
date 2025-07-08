import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SectionInfoText } from '../../../templates/shared/models/sectioninfo';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ResumeSectionType } from '../../../shared/models/resume-section-type';

@Component({
  selector: 'app-text-section-form',
  imports: [ReactiveFormsModule, CommonModule, QuillModule],
  templateUrl: './text-section-form.component.html',
  styleUrl: './text-section-form.component.scss'
})
export class TextSectionFormComponent
{

  protected readonly sectionInfoForm: FormGroup;
  @Input() sectionInfo: SectionInfoText = new SectionInfoText('', ResumeSectionType.Text, '');

  protected quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'header': [1, 2, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']                                         // remove formatting button
    ]
  }

  @Output() onSubmit = new EventEmitter<SectionInfoText>();
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('editor') editorContainer: ElementRef | undefined;

  constructor(@Inject(DIALOG_DATA) public data: { sectionInfo: SectionInfoText })
  {
    if (data && data.sectionInfo)
    {
      this.sectionInfo = data.sectionInfo;
    }

    this.sectionInfoForm = new FormGroup({
      content: new FormControl(this.sectionInfo.content, [
        Validators.required
      ])
    });
  }

  get content()
  {
    return this.sectionInfoForm.get('content');
  }

  protected cleanContent(): void
  {
    this.sectionInfoForm.patchValue({ 'content': '' });
  }

  protected isContentEmpty(): boolean
  {
    return this.content?.value ===null || this.content?.value.length == 0;
  }

  submit(): void
  {
    if (this.sectionInfoForm.invalid)
    {
      this.sectionInfoForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
    this.sectionInfo.content = this.sectionInfoForm.value.content;
    this.onSubmit.emit(this.sectionInfo);
  }

  cancel(): void
  {
    this.onCancel.emit();
  }
}
