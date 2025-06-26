import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverLetterTemplateBase } from '../cover-letter-template-base.component';

@Component({
  selector: 'app-cover-letter-template-1',
  imports: [CommonModule],
  templateUrl: './cover-letter-template-1.component.html',
  styleUrl: './cover-letter-template-1.component.scss'
})
export class CoverLetterTemplate1Component extends CoverLetterTemplateBase
{

}
