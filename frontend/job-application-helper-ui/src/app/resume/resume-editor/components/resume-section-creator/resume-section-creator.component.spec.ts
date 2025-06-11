import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSectionCreatorComponent } from './resume-section-creator.component';

describe('ResumeSectionCreatorComponent', () => {
  let component: ResumeSectionCreatorComponent;
  let fixture: ComponentFixture<ResumeSectionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeSectionCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeSectionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
