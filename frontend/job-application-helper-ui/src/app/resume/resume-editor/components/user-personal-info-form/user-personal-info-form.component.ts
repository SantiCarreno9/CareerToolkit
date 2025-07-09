import { CommonModule, KeyValue } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ContactInfo, ContactOptions, UserPersonalInfo } from '../../../shared/models/user-personal-info';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
  selector: 'app-user-personal-info-form',
  imports: [ReactiveFormsModule,
    CommonModule,
    CdkDropList,
    CdkDrag,
    CdkAccordionModule],
  templateUrl: './user-personal-info-form.component.html',
  styleUrl: './user-personal-info-form.component.scss'
})
export class UserPersonalInfoFormComponent
{
  readonly fullContactOptions: KeyValue<string, string>[];
  availableContactOptions: KeyValue<string, string>[] = [];

  readonly userInfoFormGroup: FormGroup;
  userPersonalInfo: UserPersonalInfo = {
    fullName: '',
    contactInfo: []
  };

  @Output() onSubmit = new EventEmitter<UserPersonalInfo>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { userPersonalInfo: UserPersonalInfo }, private formBuilder: FormBuilder)
  {
    this.userPersonalInfo = data.userPersonalInfo;
    this.userInfoFormGroup = this.formBuilder.group({
      fullName: new FormControl(this.userPersonalInfo.fullName, [
        Validators.required,
      ])
    });

    this.fullContactOptions = Object.entries(ContactOptions).map(([key, value]) => ({ key, value }));

    for (let index = 0; index < this.userPersonalInfo.contactInfo.length; index++)
    {
      const contactInfo = this.userPersonalInfo.contactInfo[index];
      this.addContactInfoControl(contactInfo.name, contactInfo);
    }
  }

  get fullName()
  {
    return this.userInfoFormGroup.get('fullName');
  }

  private updateAvailableContactOptions(): void
  {
    const selectedKeys = this.userPersonalInfo.contactInfo.map(ci => ci.name);

    this.availableContactOptions = selectedKeys.length > 0
      ? this.fullContactOptions.filter(option => !selectedKeys.includes(option.key))
      : [...this.fullContactOptions];
  }

  // Adds a new form control for additional contact info if it doesn't already exist
  private addContactInfoControl(key: string, value: ContactInfo): void
  {
    if (!this.userInfoFormGroup.contains('contact-value-' + key))
    {
      this.userInfoFormGroup.addControl('contact-value-' + key, new FormControl(value.value));
      this.userInfoFormGroup.addControl('contact-display-text-' + key, new FormControl(value.displayText??value.value));
      this.updateAvailableContactOptions();
    }
  }

  // Removes the form control for additional contact info if it exists
  private removeContactInfoControl(key: string): void
  {
    if (this.userInfoFormGroup.contains('contact-value-' + key) &&
      this.userInfoFormGroup.contains('contact-display-text' + key))
    {
      this.userInfoFormGroup.removeControl('contact-value-' + key);
      this.userInfoFormGroup.removeControl('contact-display-text-' + key);
      this.updateAvailableContactOptions();
    }
  }

  // Adds a new contact info field to the userInfo object and the form control
  addContactInfo(event: Event): void
  {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (!selectedValue || selectedValue.length === 0)
    {
      console.warn('No valid contact option selected.');
      return;
    }

    if (this.userPersonalInfo.contactInfo.find(ci => ci.name === selectedValue) !== undefined)
    {
      console.warn(`Key "${selectedValue}" already exists in additionalContactInfo.`);
      return;
    }

    const contactOption: ContactOptions = selectedValue as ContactOptions;
    const isUrl = contactOption !== ContactOptions.PhoneNumber && contactOption !== ContactOptions.Address;
    const contactInfo = {
      name: contactOption,
      value: '',
      displayText: undefined,
      isUrl: isUrl
    };
    this.userPersonalInfo.contactInfo.push(contactInfo);
    this.addContactInfoControl(selectedValue, contactInfo);

  }

  // Removes the contact info from the userInfo object and the form control
  removeContactInfo(key: string): void
  {
    const index = this.userPersonalInfo.contactInfo.findIndex(ci => ci.name == key);
    if (index === -1)
    {
      console.warn(`Key "${key}" does not exist in additionalContactInfo.`);
      return;
    }
    this.userPersonalInfo.contactInfo.splice(index, 1);
    this.removeContactInfoControl(key);
  }

  protected cleanField(fieldName: string): void
  {
    this.userInfoFormGroup.get(fieldName)?.patchValue('');
  }

  protected isFieldEmpty(fieldName: string): boolean
  {
    return this.userInfoFormGroup.get(fieldName)?.value.length > 0;
  }

  protected drop(event: CdkDragDrop<string[]>)
  {
    moveItemInArray(this.userPersonalInfo.contactInfo, event.previousIndex, event.currentIndex);
  }

  protected needDisplayText(name:string):boolean{
    return !(name === ContactOptions.Address || name === ContactOptions.Other || name === ContactOptions.PhoneNumber);
  }

  protected getContactInfoControl(name: string)
  {
    return this.userInfoFormGroup.get(name);
  }

  submit(): void
  {  
    if (this.userInfoFormGroup.invalid)
    {
      this.userInfoFormGroup.markAllAsTouched();
      console.warn('Form is invalid. Please correct the errors before submitting:', this.userInfoFormGroup.valueChanges);
      return;
    }
    //Gets all additional contact keys from the form controls
    const contactKeys = Object.keys(this.userInfoFormGroup.controls || {}).filter(key => key.startsWith('contact-'));
    //Stores the additional contact info in the userInfo object
    for (const key of contactKeys)
    {
      const control = this.userInfoFormGroup.get(key);
      const name = key.split('-').at(-1);
      if (!name)
        continue;
      if (control && control.value)
      {
        const index = this.userPersonalInfo.contactInfo.findIndex(ci => ci.name === name);        
        if (index === -1)
        {
          continue;
        }        
        if (key.includes('value'))
        {
          this.userPersonalInfo.contactInfo[index].value = control.value;
          this.userPersonalInfo.contactInfo[index].displayText = control.value;
        } else
        {
          if (control.value.trim() === '')
            this.userPersonalInfo.contactInfo[index].displayText = this.userPersonalInfo.contactInfo[index].value;
          else
            this.userPersonalInfo.contactInfo[index].displayText = control.value;
        }
      }
    }
    //Creates a new UserInfo object with the updated values
    const updatedUserInfo: UserPersonalInfo = {
      fullName: this.userInfoFormGroup.value.fullName || '',
      contactInfo: this.userPersonalInfo.contactInfo
    }
    this.onSubmit.emit(updatedUserInfo);
  }

  cancel(): void
  {
    this.onCancel.emit();
  }
}
