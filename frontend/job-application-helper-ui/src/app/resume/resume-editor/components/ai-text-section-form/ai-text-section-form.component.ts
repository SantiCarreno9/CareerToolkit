import { Component, EventEmitter, inject, Inject, Input, Output, ViewChild } from '@angular/core';
import { TextSectionFormComponent } from '../text-section-form/text-section-form.component';
import { SectionInfoText } from '../../../templates/shared/models/sectioninfo';
import { Resume } from '../../../shared/models/resume';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { AiService } from '../../../../core/services/ai.service';
import { AiInstruction, AiResumeInstruction } from '../../../shared/models/ai-resume-instruction';
import { AiSectionToolComponent, Instruction } from '../../../../core/components/ai-section-tool/ai-section-tool.component';
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

  @ViewChild('textSectionForm') textSectionForm!: TextSectionFormComponent;

  protected readonly resume: Resume;
  protected aiInstructionTypeOptions: Instruction[] = [];
  protected sectionInfo: SectionInfoText = new SectionInfoText('', ResumeSectionType.Text, '');
  protected aiResponse: string = '';

  @Input() areInstructionsOptional: boolean = false;
  @Output() onSubmit = new EventEmitter<SectionInfoText>();
  @Output() onCancel = new EventEmitter<void>();


  constructor(@Inject(DIALOG_DATA) public data: { sectionInfo: SectionInfoText, resume: Resume })
  {
    if (data.sectionInfo)
      this.sectionInfo = data.sectionInfo;
    this.resume = data.resume;

    this.areInstructionsOptional = this.sectionInfo.sectionType === ResumeSectionType.Summary ||
      this.sectionInfo.sectionType === ResumeSectionType.Skills;
    // if(this.sectionInfo)
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

    if (this.sectionInfo.sectionType === ResumeSectionType.Summary)
    {
      var currentSummary: string | null = instruction.aiInstructionType === AiInstructionType.Generate ? null : this.textSectionForm?.content?.value;
      if (currentSummary != null)
        currentSummary = HelperMethods.convertToPlainText(currentSummary);
      const experienceEntries = this.resume.profileEntries.map(entry => ProfileEntryHelperMethods.convertProfileEntryToExperienceEntry(entry));
      this.aiService.tailorSummary(resumeInstruction, experienceEntries, currentSummary).subscribe(res =>
      {
        if (res.success && res.value)
        {
          this.aiResponse = HelperMethods.convertPlainTextToHtml(res.value);
        }
        else
        {
          this.aiResponse = 'Error';
        }
      })
    }
    else if (this.sectionInfo.sectionType === ResumeSectionType.Skills)
    {
      var currentSkills: string | null = instruction.aiInstructionType === AiInstructionType.Generate ? null : this.textSectionForm?.content?.value;
      if (currentSkills != null)
        currentSkills = HelperMethods.convertToPlainText(currentSkills);
      const experienceEntries = this.resume.profileEntries.map(entry => ProfileEntryHelperMethods.convertProfileEntryToExperienceEntry(entry));
      this.aiService.tailorSkills(resumeInstruction, experienceEntries, currentSkills).subscribe(res =>
      {
        if (res.success && res.value)
        {
          this.aiResponse = HelperMethods.convertPlainTextArrayToHtml(res.value);
        }
        else
        {
          this.aiResponse = 'Error';
        }
      })
    }
    else
    {
      var currentContent: string = this.textSectionForm?.content?.value || '';
      if (currentContent != null)
        currentContent = HelperMethods.convertToPlainText(currentContent);
      this.aiService.tailorSection(resumeInstruction, currentContent).subscribe(res =>
      {
        if (res.success && res.value)
        {
          this.aiResponse = HelperMethods.convertPlainTextToHtml(res.value);
        }
        else
        {
          this.aiResponse = 'Error';
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
