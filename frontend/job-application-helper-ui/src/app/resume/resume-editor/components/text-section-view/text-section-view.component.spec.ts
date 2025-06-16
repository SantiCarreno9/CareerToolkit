import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSectionViewComponent } from './text-section-view.component';

describe('TextSectionViewComponent', () => {
  let component: TextSectionViewComponent;
  let fixture: ComponentFixture<TextSectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSectionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
