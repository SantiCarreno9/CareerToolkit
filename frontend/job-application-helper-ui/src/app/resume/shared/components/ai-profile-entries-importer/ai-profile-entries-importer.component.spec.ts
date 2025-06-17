import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiProfileEntriesImporterComponent } from './ai-profile-entries-importer.component';

describe('AiProfileEntriesImporterComponent', () => {
  let component: AiProfileEntriesImporterComponent;
  let fixture: ComponentFixture<AiProfileEntriesImporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiProfileEntriesImporterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiProfileEntriesImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
