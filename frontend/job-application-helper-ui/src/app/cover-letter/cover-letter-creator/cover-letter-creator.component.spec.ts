import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterCreatorComponent } from './cover-letter-creator.component';

describe('CoverLetterCreatorComponent', () => {
  let component: CoverLetterCreatorComponent;
  let fixture: ComponentFixture<CoverLetterCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverLetterCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverLetterCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
