import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterTemplate2Component } from './cover-letter-template-2.component';

describe('CoverLetterTemplate2Component', () => {
  let component: CoverLetterTemplate2Component;
  let fixture: ComponentFixture<CoverLetterTemplate2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverLetterTemplate2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterTemplate2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
