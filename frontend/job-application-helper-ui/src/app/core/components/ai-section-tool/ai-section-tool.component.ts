import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiInstructionType } from '../../models/ai-instruction-type';
import { AiInstruction } from '../../../resume/shared/models/ai-resume-instruction';
import { MatTooltipModule } from '@angular/material/tooltip';
export enum ContentType
{
  ExperienceEntry,
  Summary
};

@Component({
  selector: 'app-ai-section-tool',
  imports: [ReactiveFormsModule, CommonModule, MatTooltipModule],
  templateUrl: './ai-section-tool.component.html',
  styleUrl: './ai-section-tool.component.scss'
})
export class AiSectionToolComponent implements OnInit, OnChanges
{
  @Input() instructionsPlaceholder: string = "e.g. 3 bullet points, shorter";
  @Input() submitButtonText: string = "Submit";
  @Input() responseText: string = '';
  @Input() instructionTypeOptions: { key: string, value: AiInstructionType }[] = [];
  @Input() areInstructionsOptional: boolean = true;

  @Output() onSubmit = new EventEmitter<AiInstruction>();

  AiInstruction = AiInstructionType;
  // protected instructionType?: AiInstructionType;

  protected readonly aiSectionForm: FormGroup;
  protected readonly options: any;
  protected isWaitingForResponse: boolean = false;
  constructor()
  {
    this.aiSectionForm = new FormGroup({
      instruction: new FormControl('', { nonNullable: false }),
      instructionType: new FormControl(AiInstructionType.Custom, { nonNullable: false })
    });

    this.instructionTypeOptions = [
      { key: 'Generate', value: AiInstructionType.Generate },
      { key: 'Tailor', value: AiInstructionType.Tailor },
      { key: 'Improve', value: AiInstructionType.Improve },
      { key: 'Custom', value: AiInstructionType.Custom }
    ];
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes['responseText'] !== undefined)
      this.isWaitingForResponse = false;
  }
  ngOnInit(): void
  {
    console.log(this.instructionTypeOptions[0].value);
    this.aiSectionForm.setValue({
      'instruction': '',
      'instructionType': this.instructionTypeOptions[0].value
    });
  }

  get instructionType()
  {
    return this.aiSectionForm.get('instructionType');
  }

  protected shouldDisableSubmit(): boolean
  {
    return this.instructionType === null ||
      (!this.areInstructionsOptional && this.aiSectionForm.get('instruction')?.value === '') ||
      this.isWaitingForResponse;
  }

  async copyToClipboard()
  {
    const blob = new Blob([this.responseText], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });

    try
    {
      await navigator.clipboard.write([clipboardItem]);
    } catch (err)
    {
      console.error('Failed to copy:', err);
    }
  }
  protected submit(): void
  {
    this.isWaitingForResponse = true;
    const instructionType: AiInstructionType = parseInt(this.aiSectionForm.value.instructionType) as AiInstructionType;    
    this.onSubmit.emit({
      aiInstructionType: instructionType,
      instruction: this.aiSectionForm.value.instruction,
    });
  }
}
