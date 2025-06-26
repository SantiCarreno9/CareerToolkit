import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterTemplate1Component } from './cover-letter-template-1.component';

describe('CoverLetterTemplate1Component', () => {
  let component: CoverLetterTemplate1Component;
  let fixture: ComponentFixture<CoverLetterTemplate1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverLetterTemplate1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
