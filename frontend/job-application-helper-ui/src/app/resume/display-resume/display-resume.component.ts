import { Component, inject, ViewChild } from '@angular/core';
import { Resume } from '../shared/models/resume';
import { ResumeTemplateService } from '../templates/shared/resume-template.service';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumeService } from '../../core/services/resume.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-display-resume',
  imports: [CommonModule,MatTooltipModule],
  templateUrl: './display-resume.component.html',
  styleUrl: './display-resume.component.scss'
})
export class DisplayResumeComponent
{
  private templateService: ResumeTemplateService = inject(ResumeTemplateService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private resumeService = inject(ResumeService);

  protected resume: Resume = new Resume();
  protected template: any;
  private resumeId: string | null;

  @ViewChild(NgComponentOutlet, { static: false }) ngComponentOutlet?: NgComponentOutlet;
  // readonly resume: Resume;
  constructor()
  {
    this.resumeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.resumeId === null)
    {
      this.goBack();
      return;
    }

    this.requestResumeData();
    // this.resume = new Resume();
    // this.resume.userInfo = {
    //   fullName: "Santiago Felipe Carreno Pardo",
    //   phoneNumber: "4376612248",
    //   email: "santiago.carreno05@gmail.com",
    //   address: "775 Midland Avenue, Scarborough ON M1K 4E5",
    //   additionalContactInfo: {
    //     "Linkedin": "https://www.linkedin.com/in/santiago-felipe-carreno-pardo/",
    //     "GitHub": "https://www.github.com/SantiCarreno9"
    //   }
    // };
    // this.resume.profileEntries = [{
    //   id: '1',
    //   title: 'Bachelor’s Degree in Mechatronics Engineering',
    //   category: ProfileEntryCategory.Education,
    //   organization: 'Tech University',
    //   location: 'New York, NY',
    //   startDate: new Date('2020-01-01'),
    //   endDate: new Date('2022-01-01'),
    //   isCurrent: false,
    //   description: 'Completed a Bachelor of Science in Computer Science with a focus on software development.'
    // },
    // {
    //   id: '2',
    //   title: 'Web Developer',
    //   category: ProfileEntryCategory.WorkExperience,
    //   organization: 'Web Solutions Inc.',
    //   location: 'San Francisco, CA',
    //   startDate: new Date('2022-02-01'),
    //   endDate: new Date('2023-06-01'),
    //   isCurrent: false,
    //   description: 'Developed and maintained web applications using Angular and Node.js.'
    // },
    // {
    //   id: '3',
    //   title: 'Full Stack Developer',
    //   category: ProfileEntryCategory.WorkExperience,
    //   organization: 'Global Tech Corp.',
    //   location: 'Remote',
    //   startDate: new Date('2023-07-01'),
    //   endDate: new Date(),
    //   isCurrent: true,
    //   description: 'Working on full stack development projects, focusing on both front-end and back-end technologies.'
    // }];
    // this.resume.resumeInfo = {
    //   templateId:'1',
    //   sections: [
    //     new SectionInfoText(
    //       '1',
    //       'Summary of Skills & Experience',
    //       '<ul><li>Hello</li></ul>'
    //     ),
    //     new SectionInfoProfileEntry(
    //       '2',
    //       'Relevant Experience',
    //       ['2', '3']
    //     ),
    //     new SectionInfoProfileEntry(
    //       '2',
    //       'Additional Experience',
    //       ['2', '3']
    //     ),
    //     new SectionInfoProfileEntry(
    //       '3',
    //       'Education',
    //       ['1']
    //     )
    //   ]
    // };
  }

  protected requestResumeData()
  {
    if (this.resumeId === null)
      return;

    this.resumeService.getResumeById(this.resumeId).subscribe(res =>
    {
      if (!res.success || !res.value)
      {
        this.goBack();
        return;
      }

      this.resume = res.value;      
      this.updateTemplate();
    })
  }

  updateTemplate(): void
  {
    const templateInfo = this.templateService.getTemplateInfoById(this.resume.resumeInfo.templateId);
    if (templateInfo === null)
      return;

    this.template = templateInfo.component;
    setTimeout(() =>
    {
      this.retrieveTemplateData()
    }, 100);
  }

  retrieveTemplateData(): void
  {
    if (this.ngComponentOutlet)
    {
      const componentInstance = this.ngComponentOutlet.componentInstance;
      this.resume.resumeInfo = componentInstance.resumeInfo;
    }
  }

  protected goBack(): void
  {
    this.router.navigate(['/resumes']);
  }

  protected download():void{
    document.title = this.resume.name;
    window.print();
  }

  protected get modifiedAtTime()
  {
    const time = this.resume.modifiedAt.toLocaleTimeString();
    return 'Last time saved: ' + time;
  }
}
