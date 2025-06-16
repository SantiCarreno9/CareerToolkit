import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResumeComponent } from './displayresume.component';

describe('DisplayresumeComponent', () => {
  let component: DisplayResumeComponent;
  let fixture: ComponentFixture<DisplayResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
