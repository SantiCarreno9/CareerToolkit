import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSectionFormComponent } from './text-section-form.component';

describe('TextSectionFormComponent', () => {
  let component: TextSectionFormComponent;
  let fixture: ComponentFixture<TextSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
