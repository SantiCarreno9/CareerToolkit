import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { TextSectionFormComponent } from '../text-section-form/text-section-form.component';
import { SectionInfoText } from '../../../templates/shared/models/sectioninfo';
import { Resume } from '../../../shared/models/resume';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { AiService } from '../../../../core/services/ai.service';
import { AiInstruction, AiResumeInstruction } from '../../../shared/models/ai-resume-instruction';
import { AiSectionToolComponent } from '../../../../core/components/ai-section-tool/ai-section-tool.component';
import { ResumeSectionType } from '../../../shared/models/resume-section-type';
import { AiInstructionType } from '../../../../core/models/ai-instruction-type';
import { HelperMethods } from '../../../../core/helper-methods';
import { ProfileEntryHelperMethods } from '../../../../profile-entry/shared/profile-entry-helper-methods';

@Component({
  selector: 'app-ai-text-section-form',
  imports: [TextSectionFormComponent, AiSectionToolComponent],
  templateUrl: './ai-text-section-form.component.html',
  styleUrl: './ai-text-section-form.component.scss'
})
export class AiTextSectionFormComponent
{

  protected aiService: AiService = inject(AiService);

  protected textSectionForm?: TextSectionFormComponent;
  protected readonly resume: Resume;
  protected aiInstructionTypeOptions: { key: string, value: AiInstructionType }[] = [];
  protected sectionInfo: SectionInfoText = new SectionInfoText('', '', '');
  protected aiResponse: string = '';

  @Input() areInstructionsOptional: boolean = false;
  @Output() onSubmit = new EventEmitter<SectionInfoText>();
  @Output() onCancel = new EventEmitter<void>();


  constructor(@Inject(DIALOG_DATA) public data: { sectionInfo: SectionInfoText, resume: Resume })
  {
    if (data.sectionInfo)
      this.sectionInfo = data.sectionInfo;
    this.resume = data.resume;

    this.areInstructionsOptional = this.sectionInfo.sectionType === ResumeSectionType.Summary;
    // if(this.sectionInfo)
    this.aiInstructionTypeOptions = [
      { key: 'Generate', value: AiInstructionType.Generate },
      { key: 'Tailor', value: AiInstructionType.Tailor },
      { key: 'Improve', value: AiInstructionType.Improve },
      { key: 'Custom', value: AiInstructionType.Custom }
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
    if (this.sectionInfo.sectionType === ResumeSectionType.Summary)
    {
      const currentSummary: string | null = instruction.aiInstructionType === AiInstructionType.Generate ? null : this.textSectionForm?.content?.value;

      const experienceEntries = this.resume.profileEntries.map(entry => ProfileEntryHelperMethods.convertProfileEntryToExperienceEntry(entry));
      this.aiService.tailorSummary(resumeInstruction, experienceEntries, currentSummary).subscribe(res =>
      {
        if (res.success && res.value)
        {
          this.aiResponse = HelperMethods.convertPlainTextArrayToHtml(res.value);
        }
      })
    }
    else
    {
      const currentContent: string = this.textSectionForm?.content?.value || '';
      this.aiService.tailorSection(resumeInstruction, currentContent).subscribe(res =>
      {
        if (res.success && res.value)
        {
          this.aiResponse = HelperMethods.convertPlainTextArrayToHtml(res.value);
        }
      });
    }
  }

  protected submit(sectionInfo: SectionInfoText): void
  {
    this.onSubmit.emit(sectionInfo);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
