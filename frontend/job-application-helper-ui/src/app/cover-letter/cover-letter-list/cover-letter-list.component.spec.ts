import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterListComponent } from './cover-letter-list.component';

describe('CoverLetterListComponent', () => {
  let component: CoverLetterListComponent;
  let fixture: ComponentFixture<CoverLetterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverLetterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
