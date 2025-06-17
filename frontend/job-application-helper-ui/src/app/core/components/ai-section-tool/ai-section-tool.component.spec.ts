import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSectionToolComponent } from './ai-section-tool.component';

describe('AiSectionToolComponent', () => {
  let component: AiSectionToolComponent;
  let fixture: ComponentFixture<AiSectionToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSectionToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSectionToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
