import { Component, EventEmitter, inject, Inject, Output, ViewChild } from '@angular/core';
import { ProfileEntryFormComponent } from '../../../../profile-entry/profile-entry-form/profile-entry-form.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Resume } from '../../../shared/models/resume';
import { ProfileEntry } from '../../../../profile-entry/shared/models/profile-entry';
import { ProfileEntryCategory } from '../../../../core/enums/profile-entry-category';
import { AiInstruction, AiResumeInstruction } from '../../../shared/models/ai-resume-instruction';
import { AiService } from '../../../../core/services/ai.service';
import { HelperMethods } from '../../../../core/helper-methods';
import { AiSectionToolComponent, Instruction } from '../../../../core/components/ai-section-tool/ai-section-tool.component';
import { AiInstructionType } from '../../../../core/models/ai-instruction-type';
import { ProfileEntryHelperMethods } from '../../../../profile-entry/shared/profile-entry-helper-methods';
import { DisplayMessageService } from '../../../../core/services/display-message.service';

@Component({
  selector: 'app-ai-profile-entry-form',
  imports: [ProfileEntryFormComponent, AiSectionToolComponent],
  templateUrl: './ai-profile-entry-form.component.html',
  styleUrl: './ai-profile-entry-form.component.scss'
})
export class AiProfileEntryFormComponent
{

  protected aiService: AiService = inject(AiService);
  private displayMessageService = inject(DisplayMessageService);

  @ViewChild('profileEntryForm') profileEntryForm!: ProfileEntryFormComponent;

  protected readonly profileEntry: ProfileEntry;
  protected readonly resume: Resume;
  protected aiInstructionTypeOptions: Instruction[] = [];
  protected aiResponse: string = '';
  @Output() onSubmit = new EventEmitter<ProfileEntry>();
  @Output() onCancel = new EventEmitter<void>();


  constructor(@Inject(DIALOG_DATA) public data: { resume: Resume, profileEntry: ProfileEntry })
  {
    if (data.profileEntry)
      this.profileEntry = data.profileEntry;
    else
      this.profileEntry = {
        id: '',
        category: ProfileEntryCategory.WorkExperience,
        title: '',
        organization: '',
        location: '',
        startDate: new Date(),
        endDate: null,
        isCurrent: false,
        description: ''
      };

    this.resume = data.resume;
    this.aiInstructionTypeOptions = [
      { key: 'Generate', value: AiInstructionType.Generate, description: '' },
      { key: 'Tailor', value: AiInstructionType.Tailor, description: '' },
      { key: 'Improve', value: AiInstructionType.Improve, description: '' },
      { key: 'Custom', value: AiInstructionType.Custom, description: '' }
    ]
  }

  protected submitAiInstruction(instruction: AiInstruction): void
  {
    const resumeInstruction: AiResumeInstruction = {
      aiInstructionType: instruction.aiInstructionType,
      instruction: instruction.instruction,
      jobPosting: ''
    };
    resumeInstruction.jobPosting = this.resume.jobPosting || '';
    if (this.profileEntryForm !== undefined && this.profileEntryForm.description?.value)
      this.profileEntry.description = this.profileEntryForm.description?.value;

    const experienceEntry = ProfileEntryHelperMethods.convertProfileEntryToExperienceEntry(this.profileEntry);
    this.aiService.tailorProfileEntry(resumeInstruction, experienceEntry).subscribe(res =>
    {
      if (res.success && res.value)
      {
        this.aiResponse = HelperMethods.convertPlainTextArrayToHtml(res.value);
      }
      else
      {
        this.displayMessageService.showMessage('Error: ' + res.error);
        this.aiResponse = 'Error';
      }
    })
  }

  protected submit(profileEntry: ProfileEntry): void
  {
    this.onSubmit.emit(profileEntry);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
