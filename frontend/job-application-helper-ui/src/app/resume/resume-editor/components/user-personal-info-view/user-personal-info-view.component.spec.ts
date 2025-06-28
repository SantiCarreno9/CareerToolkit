import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonalInfoViewComponent } from './user-personal-info-view.component';

describe('UserPersonalInfoViewComponent', () => {
  let component: UserPersonalInfoViewComponent;
  let fixture: ComponentFixture<UserPersonalInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPersonalInfoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPersonalInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
