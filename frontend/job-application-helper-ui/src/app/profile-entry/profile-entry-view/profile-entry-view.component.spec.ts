import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEntryViewComponent } from './profile-entry-view.component';

describe('ProfileEntryViewComponent', () => {
  let component: ProfileEntryViewComponent;
  let fixture: ComponentFixture<ProfileEntryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEntryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEntryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
