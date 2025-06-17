import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiProfileEntryFormComponent } from './ai-profile-entry-form.component';

describe('AiProfileEntryFormComponent', () => {
  let component: AiProfileEntryFormComponent;
  let fixture: ComponentFixture<AiProfileEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiProfileEntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiProfileEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
