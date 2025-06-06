import { Component } from '@angular/core';
import { Template1Component } from '../templates/template1/template1.component';
import { Resume } from '../shared/resume';
import { ProfileEntryCategory } from '../../core/enums/profile-entry-category';
import { SectionInfoProfileEntry, SectionInfoText } from '../templates/shared/sectioninfo';

@Component({
  selector: 'app-displayresume',
  imports: [Template1Component],
  templateUrl: './displayresume.component.html',
  styleUrl: './displayresume.component.scss'
})
export class DisplayResumeComponent
{

  readonly resume: Resume;
  constructor()
  {
    this.resume = new Resume();
    this.resume.userInfo = {
      fullName: "Santiago Felipe Carreno Pardo",
      phoneNumber: "4376612248",
      email: "santiago.carreno05@gmail.com",
      address: "775 Midland Avenue, Scarborough ON M1K 4E5",
      additionalContactInfo: {
        "Linkedin": "https://www.linkedin.com/in/santiago-felipe-carreno-pardo/",
        "GitHub": "https://www.github.com/SantiCarreno9"
      }
    };
    this.resume.profileEntries = [{
      id: '1',
      title: 'Bachelor’s Degree in Mechatronics Engineering',
      category: ProfileEntryCategory.Education,
      organization: 'Tech University',
      location: 'New York, NY',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2022-01-01'),
      isCurrent: false,
      description: 'Completed a Bachelor of Science in Computer Science with a focus on software development.'
    },
    {
      id: '2',
      title: 'Web Developer',
      category: ProfileEntryCategory.WorkExperience,
      organization: 'Web Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: new Date('2022-02-01'),
      endDate: new Date('2023-06-01'),
      isCurrent: false,
      description: 'Developed and maintained web applications using Angular and Node.js.'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      category: ProfileEntryCategory.WorkExperience,
      organization: 'Global Tech Corp.',
      location: 'Remote',
      startDate: new Date('2023-07-01'),
      endDate: new Date(),
      isCurrent: true,
      description: 'Working on full stack development projects, focusing on both front-end and back-end technologies.'
    }];
    this.resume.resumeInfo = {
      sections: [
        new SectionInfoText(
          '1',
          'Summary of Skills & Experience',
          '<ul><li>Hello</li></ul>'
        ),
        new SectionInfoProfileEntry(
          '2',
          'Relevant Experience',
          ['2', '3']
        ),
        new SectionInfoProfileEntry(
          '2',
          'Additional Experience',
          ['2', '3']
        ),
        new SectionInfoProfileEntry(
          '3',
          'Education',
          ['1']
        )
      ]
    };
  }
}
