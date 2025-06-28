import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResumeTemplateBase } from '../resume-template-base';

@Component({
  selector: 'app-resume-template-1',
  imports: [CommonModule],
  templateUrl: './resume-template-1.component.html',
  styleUrl: './resume-template-1.component.scss'
})
export class ResumeTemplate1Component extends ResumeTemplateBase
{
  constructor()
  {
    super();
  }
  
}
