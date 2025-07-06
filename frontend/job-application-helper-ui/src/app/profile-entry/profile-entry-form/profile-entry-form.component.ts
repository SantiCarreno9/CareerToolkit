import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ProfileEntry } from '../shared/models/profile-entry';
import { HelperMethods } from '../../core/helper-methods';
import { ProfileEntryHelperMethods } from '../shared/profile-entry-helper-methods';

@Component({
  selector: 'app-profile-entry-form',
  imports: [ReactiveFormsModule, CommonModule, QuillModule],
  templateUrl: './profile-entry-form.component.html',
  styleUrl: './profile-entry-form.component.scss'
})
export class ProfileEntryFormComponent
{

  readonly profileEntryFormGroup: FormGroup;
  protected ProfileEntryCategory = ProfileEntryCategory;
  @Input() profileEntry: ProfileEntry = {
    id: '',
    title: '',
    category: ProfileEntryCategory.Education,
    organization: '',
    location: '',
    startDate: new Date(),
    endDate: null,
    isCurrent: false,
    description: ''
  };

  protected descriptionQuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'header': [1, 2, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']                                         // remove formatting button
    ]
  }

  @Output() onSubmit = new EventEmitter<ProfileEntry>();
  @Output() onCancel = new EventEmitter<void>();

  @ViewChild('editor') editorContainer: ElementRef | undefined;

  constructor(@Inject(DIALOG_DATA) public data: { profileEntry: ProfileEntry })
  {
    if (data && data.profileEntry)
    {
      this.profileEntry = data.profileEntry;
    }

    this.profileEntryFormGroup = new FormGroup({
      title: new FormControl(this.profileEntry.title, [
        Validators.required,
        Validators.minLength(2)
      ]),
      category: new FormControl(this.profileEntry.category, [
        Validators.required
      ]),
      organization: new FormControl(this.profileEntry.organization),
      location: new FormControl(this.profileEntry.location),
      startDate: new FormControl(HelperMethods.convertDateToDateOnlyString(this.profileEntry.startDate), [
        Validators.required
      ]),
      endDate: new FormControl(this.profileEntry.endDate !== null ? HelperMethods.convertDateToDateOnlyString(this.profileEntry.endDate) : ''),
      isCurrent: new FormControl(this.profileEntry.isCurrent),
      description: new FormControl(this.profileEntry.description)
    });
  }

  get header()
  {
    return ProfileEntryHelperMethods.getCategoryName(this.profileEntry.category);
  }

  get title()
  {
    return this.profileEntryFormGroup.get('title');
  }

  get category()
  {
    return this.profileEntryFormGroup.get('category');
  }

  get organization()
  {
    return this.profileEntryFormGroup.get('organization');
  }

  get location()
  {
    return this.profileEntryFormGroup.get('location');
  }
  get startDate()
  {
    return this.profileEntryFormGroup.get('startDate');
  }
  get endDate()
  {
    return this.profileEntryFormGroup.get('endDate');
  }
  get isCurrent()
  {
    return this.profileEntryFormGroup.get('isCurrent');
  }
  get description()
  {
    return this.profileEntryFormGroup.get('description');
  }

  protected cleanDescription(): void
  {
    this.profileEntryFormGroup.patchValue({ 'description': '' });
  }

  protected isDescriptionEmpty(): boolean
  {
    return this.description?.value ===null || this.description?.value.length == 0;
  }

  protected submit(): void
  {
    if (this.profileEntryFormGroup.invalid)
    {
      this.profileEntryFormGroup.markAllAsTouched();
      console.error('Form is invalid');
      return;
    }
    const startDate = new Date(this.profileEntryFormGroup.value.startDate);
    const endDate = this.profileEntryFormGroup.value.isCurrent ? null : new Date(this.profileEntryFormGroup.value.endDate);
    const updatedEntry: ProfileEntry = {
      ...this.profileEntry,
      ...this.profileEntryFormGroup.value,
      startDate: startDate,
      endDate: endDate
    };
    this.onSubmit.emit(updatedEntry);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
