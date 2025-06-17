import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBasicInfoFormComponent } from './resume-basic-info-form.component';

describe('ResumeBasicInfoFormComponent', () => {
  let component: ResumeBasicInfoFormComponent;
  let fixture: ComponentFixture<ResumeBasicInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeBasicInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeBasicInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
