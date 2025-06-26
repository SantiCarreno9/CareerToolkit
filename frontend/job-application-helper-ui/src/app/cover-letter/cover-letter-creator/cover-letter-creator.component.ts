import { Component, EventEmitter, Output } from '@angular/core';
import { CoverLetter } from '../shared/models/cover-letter';

@Component({
  selector: 'app-cover-letter-creator',
  imports: [],
  templateUrl: './cover-letter-creator.component.html',
  styleUrl: './cover-letter-creator.component.scss'
})
export class CoverLetterCreatorComponent
{
  @Output() onCoverLetterCreated = new EventEmitter<CoverLetter>();
  @Output() onCancel = new EventEmitter<void>();
}
