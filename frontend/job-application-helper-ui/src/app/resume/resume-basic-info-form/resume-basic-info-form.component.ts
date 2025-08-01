import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule, KeyValue } from '@angular/common';
import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ResumeBasicInfo } from '../shared/models/basic-resume-info';
import { HelperMethods } from '../../core/helper-methods';

@Component({
  selector: 'app-resume-basic-info-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resume-basic-info-form.component.html',
  styleUrl: './resume-basic-info-form.component.scss'
})
export class ResumeBasicInfoFormComponent
{
  protected readonly basicInfoForm: FormGroup;
  protected keywords: KeyValue<string, string>[] = [];
  
  @Input() acceptButtonText: string = "Save"
  @Output() onSave = new EventEmitter<ResumeBasicInfo>();
  @Output() onCancel = new EventEmitter<void>();

  protected isLoading: boolean = false;
  
  constructor(@Inject(DIALOG_DATA) public data: { name: string, keywords: string[], jobPosting: string }, private formBuilder: FormBuilder)
  {
    this.basicInfoForm = this.formBuilder.group({
      name: new FormControl(data.name, [
        Validators.required,
        Validators.minLength(5)
      ]),
      jobPosting: new FormControl(this.data.jobPosting)
    });

    if (data.keywords && data.keywords.length > 0)
      data.keywords.forEach(v => this.addKeyword(v));
  }

  get name()
  {
    return this.basicInfoForm.get('name');
  }

  get jobPosting()
  {
    return this.basicInfoForm.get('jobPosting');
  }

  protected addKeyword(value: string = ''): void
  {
    const key = Math.floor(Math.random() * 1000).toString();
    if (!this.basicInfoForm.contains('keyword-' + key))
    {
      this.basicInfoForm.addControl('keyword-' + key, new FormControl(value, [Validators.required]));
      this.keywords.push({ key: key, value: value });
    }
  }

  protected removeKeyword(key: string, index: number): void
  {
    if (this.basicInfoForm.contains('keyword-' + key))
    {
      this.basicInfoForm.removeControl('keyword-' + key);
      this.keywords.splice(index, 1);
    }
  }

  public setIsLoading(isLoading: boolean): void{
    this.isLoading = isLoading;
  }

  protected save(): void
  {
    if (this.basicInfoForm.invalid)
    {
      this.basicInfoForm.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }

    const formKeywords = Object.keys(this.basicInfoForm.controls || {}).filter(key => key.startsWith('keyword-'));
    const newKeywords: string[] = [];
    // //Stores the additional contact info in the userInfo object
    for (const key of formKeywords)
    {
      const control = this.basicInfoForm.get(key);
      if (control && control.value)
      {
        newKeywords.push(control.value);
      }
    }
    const data: ResumeBasicInfo = {
      name: this.basicInfoForm.value.name,
      keywords: newKeywords,
      jobPosting: this.basicInfoForm.value.jobPosting ? HelperMethods.cleanTextForAI(this.basicInfoForm.value.jobPosting) : ''
    };

    this.onSave.emit(data);
  }

  protected cancel(): void
  {
    this.basicInfoForm.markAsUntouched();
    this.basicInfoForm.clearValidators();
    this.onCancel.emit();
  }

  protected cleanField(fieldName: string): void
  {
    this.basicInfoForm.get(fieldName)?.patchValue('');
  }

  protected isFieldEmpty(fieldName: string): boolean
  {
    return this.basicInfoForm.get(fieldName)?.value.length > 0;
  }

}
