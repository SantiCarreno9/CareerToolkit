import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEntryFormComponent } from './profile-entry-form.component';

describe('ProfileEntryFormComponent', () => {
  let component: ProfileEntryFormComponent;
  let fixture: ComponentFixture<ProfileEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEntryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
