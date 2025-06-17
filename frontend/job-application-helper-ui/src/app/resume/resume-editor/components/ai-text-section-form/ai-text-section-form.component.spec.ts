import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiTextSectionFormComponent } from './ai-text-section-form.component';

describe('AiTextSectionFormComponent', () => {
  let component: AiTextSectionFormComponent;
  let fixture: ComponentFixture<AiTextSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiTextSectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiTextSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
