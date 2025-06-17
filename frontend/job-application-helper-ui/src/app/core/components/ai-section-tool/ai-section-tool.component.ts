import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AiInstructionType } from '../../models/ai-instruction-type';
import { AiInstruction } from '../../../resume/shared/models/ai-resume-instruction';
import { HelperMethods } from '../../helper-methods';

export enum ContentType
{
  ExperienceEntry,
  Summary
};

@Component({
  selector: 'app-ai-section-tool',
  imports: [ReactiveFormsModule, MatRadioModule, CommonModule, ClipboardModule],
  templateUrl: './ai-section-tool.component.html',
  styleUrl: './ai-section-tool.component.scss'
})
export class AiSectionToolComponent
{
  AiInstruction = AiInstructionType;
  protected instructionType?: AiInstructionType;

  protected readonly aiSectionForm: FormGroup;
  protected readonly options: any;
  @Input() submitButtonText: string = "Submit";
  @Input() responseText: string = '';
  @Input() instructionTypeOptions: { key: string, value: AiInstructionType }[] = [];
  @Input() areInstructionsOptional: boolean = true;

  @Output() onSubmit = new EventEmitter<AiInstruction>();

  constructor()
  {
    this.aiSectionForm = new FormGroup({
      instruction: new FormControl('', { nonNullable: false }),
      instructionType: new FormControl(undefined, { nonNullable: true })
    });

    this.instructionTypeOptions = Object.keys(AiInstructionType)
      .filter(k => isNaN(Number(k))) // filter out numeric keys
      .map(key => ({
        key: key.split(/(?=[A-Z])/).join(' '), // Convert camelCase to spaced words
        value: AiInstructionType[key as keyof typeof AiInstructionType]
      }));
  }
  // @Input() 

  protected instructionChanged(selection: MatRadioChange<AiInstructionType>): void
  {
    this.instructionType = selection.value;
    console.log(this.instructionType);
    this.submitButtonText = 'Submit';
  }

  protected shouldDisableSubmit(): boolean
  {
    return this.instructionType === undefined || (!this.areInstructionsOptional && this.aiSectionForm.get('instruction')?.value === '');
  }

  async copyToClipboard()
  {
    const blob = new Blob([this.responseText], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });

    try
    {
      await navigator.clipboard.write([clipboardItem]);
      console.log('Copied as rich text (HTML)!');
    } catch (err)
    {
      console.error('Failed to copy:', err);
    }
  }
  protected submit(): void
  {
    this.onSubmit.emit({
      aiInstructionType: this.instructionType!,
      instruction: this.aiSectionForm.value.instruction,
    });
  }
}
