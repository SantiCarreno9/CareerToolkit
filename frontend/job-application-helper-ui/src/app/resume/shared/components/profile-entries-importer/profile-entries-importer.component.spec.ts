import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEntriesImporterComponent } from './profile-entries-importer.component';

describe('ProfileEntriesImporterComponent', () => {
  let component: ProfileEntriesImporterComponent;
  let fixture: ComponentFixture<ProfileEntriesImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEntriesImporterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEntriesImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
