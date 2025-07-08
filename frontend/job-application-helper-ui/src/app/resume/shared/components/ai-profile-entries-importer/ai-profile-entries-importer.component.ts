import { Component, EventEmitter, Inject, inject, Input, Output, ViewChild } from '@angular/core';
import { ProfileEntriesImporterComponent } from '../profile-entries-importer/profile-entries-importer.component';
import { AiSectionToolComponent, Instruction } from '../../../../core/components/ai-section-tool/ai-section-tool.component';
import { AiService } from '../../../../core/services/ai.service';
import { AiInstructionType } from '../../../../core/models/ai-instruction-type';
import { ProfileEntry } from '../../../../profile-entry/shared/models/profile-entry';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { AiInstruction, AiResumeInstruction } from '../../models/ai-resume-instruction';
import { ProfileEntryHelperMethods } from '../../../../profile-entry/shared/profile-entry-helper-methods';
import { HelperMethods } from '../../../../core/helper-methods';
import { DisplayMessageService } from '../../../../core/services/display-message.service';

@Component({
  selector: 'app-ai-profile-entries-importer',
  imports: [ProfileEntriesImporterComponent, AiSectionToolComponent],
  templateUrl: './ai-profile-entries-importer.component.html',
  styleUrl: './ai-profile-entries-importer.component.scss'
})
export class AiProfileEntriesImporterComponent
{
  protected aiService: AiService = inject(AiService);
 private displayMessageService = inject(DisplayMessageService);
  // protected showAiTools:boolean
  @ViewChild('profileEntriesImporter') profileEntriesImporter!: ProfileEntriesImporterComponent;
  protected aiInstructionTypeOptions: Instruction[] = [];
  protected aiResponse: string = '';

  @Input() jobPosting?: string;
  @Input() entries: { [key: string]: ProfileEntry[] } = {};
  @Input() acceptButtonText: string = "Save"

  @Input() areInstructionsOptional: boolean = true;
  @Output() onSubmit = new EventEmitter<ProfileEntry[]>();
  @Output() onCancel = new EventEmitter<void>();


  constructor(@Inject(DIALOG_DATA) public data: { entries: { [key: string]: ProfileEntry[] }, jobPosting: string })
  {
    this.entries = data.entries;
    this.jobPosting = data.jobPosting;
    // if(this.sectionInfo)
    this.aiInstructionTypeOptions = [
      { key: 'Select', value: AiInstructionType.Custom, description: '' }
    ]
  }

  protected submitAiInstruction(instruction: AiInstruction): void
  {
    const resumeInstruction: AiResumeInstruction = {
      aiInstructionType: instruction.aiInstructionType,
      instruction: instruction.instruction,
      jobPosting: ''
    };
    resumeInstruction.jobPosting = this.jobPosting || '';
    const experienceEntries = Object.values(this.entries).flat().map(entry => ProfileEntryHelperMethods.convertProfileEntryToExperienceEntry(entry));
    this.aiService.selectExperienceEntries(resumeInstruction, experienceEntries).subscribe(res =>
    {
      if (res.success && res.value)
      {
        const ids = res.value.map((id: string) => id.split(',')[0]);
        this.profileEntriesImporter?.selectEntries(ids);
        const reasons = res.value.map((id: string) => id.split(',')[1]);

        const allEntries = Object.values(this.entries).flat();
        for (let i = 0; i < reasons.length; i++)
        {
          const originalReason = reasons[i];
          reasons[i] = '**' + this.getEntryInfoById(allEntries, ids[i]) + '**';
          reasons[i] += ': ' + originalReason;
        }
        this.aiResponse = HelperMethods.convertPlainTextArrayToHtml(reasons);
      }
      else
      {
        this.displayMessageService.showMessage('Error: ' + res.error);
        this.aiResponse = 'Error';
      }
    });
  }

  private getEntryInfoById(array: ProfileEntry[], id: string): string
  {
    const entry = array.find(e => e.id === id);
    if (entry === undefined)
      return '';
    const info = entry.title + (entry.organization.length > 1 ? ' at ' + entry.organization : '');
    return info;
  }
  protected submit(sectionInfo: ProfileEntry[]): void
  {
    this.onSubmit.emit(sectionInfo);
  }

  protected cancel(): void
  {
    this.onCancel.emit();
  }
}
