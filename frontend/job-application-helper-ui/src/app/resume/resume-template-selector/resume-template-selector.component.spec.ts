import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTemplateSelectorComponent } from './resume-template-selector.component';

describe('ResumeTemplateSelectorComponent', () => {
  let component: ResumeTemplateSelectorComponent;
  let fixture: ComponentFixture<ResumeTemplateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeTemplateSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTemplateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
