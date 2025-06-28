import { Component } from '@angular/core';
import { ResumeTemplateBase } from '../resume-template-base';
import { CommonModule } from '@angular/common';
import { ContactItem } from '../shared/models/contact-item';


@Component({
  selector: 'app-resume-template-2',
  imports: [CommonModule],
  templateUrl: './resume-template-2.component.html',
  styleUrl: './resume-template-2.component.scss'
})
export class ResumeTemplate2Component extends ResumeTemplateBase
{
  protected contactInfo: ContactItem[] = []
  constructor()
  {
    super();
    this.resumeInfo = {
      templateId: '2',
      sections: []
    }
  }  
}
