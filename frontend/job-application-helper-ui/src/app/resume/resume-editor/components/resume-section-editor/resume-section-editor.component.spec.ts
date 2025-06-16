import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSectionEditorComponent } from './resume-section-editor.component';

describe('ResumeSectionEditorComponent', () => {
  let component: ResumeSectionEditorComponent;
  let fixture: ComponentFixture<ResumeSectionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeSectionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeSectionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
