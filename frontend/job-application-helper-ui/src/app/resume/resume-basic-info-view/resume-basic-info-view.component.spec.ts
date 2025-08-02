import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeBasicInfoViewComponent } from './resume-basic-info-view.component';

describe('ResumeBasicInfoViewComponent', () => {
  let component: ResumeBasicInfoViewComponent;
  let fixture: ComponentFixture<ResumeBasicInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeBasicInfoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeBasicInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
