import { TestBed } from '@angular/core/testing';

import { ResumeTemplateService } from './resume-template.service';

describe('ResumeTemplateService', () => {
  let service: ResumeTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
