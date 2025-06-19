import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { UserInfo } from '../shared/models/userinfo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ContactOptions } from '../../core/enums/contactoptions';
import { KeyValue } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-info-form.component.html',
  styleUrl: './user-info-form.component.scss'
})
export class UserInfoFormComponent
{
  readonly fullContactOptions: KeyValue<string, string>[];
  availableContactOptions: KeyValue<string, string>[] = [];

  readonly userInfoFormGroup: FormGroup;
  userInfo: UserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    additionalContactInfo: {}
  };
  allowEmailEditing: boolean = false;

  @Output() onSubmit = new EventEmitter<UserInfo>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(@Inject(DIALOG_DATA) public data: { userInfo: UserInfo, allowEmailEditing: boolean }, private formBuilder: FormBuilder)
  {
    this.userInfo = data.userInfo;
    this.allowEmailEditing = data.allowEmailEditing;

    this.userInfoFormGroup = this.formBuilder.group({
      fullName: new FormControl(this.userInfo.fullName, [
        Validators.required,
      ]),
      email: new FormControl({ value: this.userInfo.email, disabled: !this.allowEmailEditing }, [
        Validators.required,
        Validators.email
      ]),
      phoneNumber: new FormControl(this.userInfo.phoneNumber, [
        Validators.pattern('^[0-9]{10,15}$')
      ]),
      address: new FormControl(this.userInfo.address, [
      ])
    });

    this.fullContactOptions = Object.entries(ContactOptions).map(([key, value]) => ({ key, value }));

    for (const key of Object.keys(this.userInfo.additionalContactInfo || {}))
    {
      this.addAdditionalContactInfoControl(key, this.userInfo.additionalContactInfo[key]);
    }
  }

  get fullName()
  {
    return this.userInfoFormGroup.get('fullName');
  }
  get email()
  {
    return this.userInfoFormGroup.get('email');
  }
  get phoneNumber()
  {
    return this.userInfoFormGroup.get('phoneNumber');
  }
  get address()
  {
    return this.userInfoFormGroup.get('address');
  }

  private updateAvailableContactOptions(): void
  {
    // additionalContactInfo is an object/dictionary, get its keys
    const selectedKeys = this.userInfo.additionalContactInfo
      ? Object.keys(this.userInfo.additionalContactInfo)
      : [];

    this.availableContactOptions = selectedKeys.length > 0
      ? this.fullContactOptions.filter(option => !selectedKeys.includes(option.key))
      : [...this.fullContactOptions];
  }

  // Adds a new form control for additional contact info if it doesn't already exist
  private addAdditionalContactInfoControl(key: string, value: string = ''): void
  {
    if (!this.userInfoFormGroup.contains('contact-' + key))
    {
      this.userInfoFormGroup.addControl('contact-' + key, new FormControl(value, [Validators.required]));
      this.updateAvailableContactOptions();
    }
  }

  // Removes the form control for additional contact info if it exists
  private removeAdditionalContactInfoControl(key: string): void
  {
    if (this.userInfoFormGroup.contains('contact-' + key))
    {
      this.userInfoFormGroup.removeControl('contact-' + key);
      this.updateAvailableContactOptions();
    }
  }

  // Adds a new contact info field to the userInfo object and the form control
  addAdditionalContactInfo(event: Event): void
  {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log('Selected value:', selectedValue);
    if (!selectedValue || selectedValue.length === 0)
    {
      console.warn('No valid contact option selected.');
      return;
    }

    if (selectedValue in this.userInfo.additionalContactInfo)
    {
      console.warn(`Key "${selectedValue}" already exists in additionalContactInfo.`);
      return;
    }

    this.userInfo.additionalContactInfo[selectedValue] = '';
    this.addAdditionalContactInfoControl(selectedValue);

  }

  // Removes the contact info from the userInfo object and the form control
  removeContactInfo(key: string): void
  {
    if (!(key in this.userInfo.additionalContactInfo))
    {
      console.warn(`Key "${key}" does not exist in additionalContactInfo.`);
      return;
    }
    delete this.userInfo.additionalContactInfo[key];
    this.removeAdditionalContactInfoControl(key);
  }

  protected cleanField(fieldName: string): void
  {
    this.userInfoFormGroup.get(fieldName)?.patchValue('');
  }

  protected isFieldEmpty(fieldName: string): boolean
  {
    return this.userInfoFormGroup.get(fieldName)?.value.length > 0;
  }

  submit(): void
  {
    if (this.userInfoFormGroup.invalid)
    {
      this.userInfoFormGroup.markAllAsTouched();
      console.warn('Form is invalid. Please correct the errors before submitting.');
      return;
    }
    //Gets all additional contact keys from the form controls
    const additionalContactKeys = Object.keys(this.userInfoFormGroup.controls || {}).filter(key => key.startsWith('contact-'));

    //Stores the additional contact info in the userInfo object
    for (const key of additionalContactKeys)
    {
      const control = this.userInfoFormGroup.get(key);
      if (control && control.value)
      {
        const contactKey = key.replace('contact-', '');
        this.userInfo.additionalContactInfo[contactKey] = control.value;
      }
    }
    //Creates a new UserInfo object with the updated values
    const updatedUserInfo: UserInfo = {
      id: this.userInfo.id,
      email: this.allowEmailEditing ? this.userInfoFormGroup.value.email : this.userInfo.email,
      fullName: this.userInfoFormGroup.value.fullName || '',
      phoneNumber: this.userInfoFormGroup.value.phoneNumber || '',
      address: this.userInfoFormGroup.value.address || '',
      additionalContactInfo: this.userInfo.additionalContactInfo || {}
    }
    this.onSubmit.emit(updatedUserInfo);
  }

  cancel(): void
  {
    this.onCancel.emit();
  }

}
