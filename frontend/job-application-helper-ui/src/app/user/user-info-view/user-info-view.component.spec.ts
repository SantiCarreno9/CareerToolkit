import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoViewComponent } from './user-info-view.component';

describe('UserInfoViewComponent', () => {
  let component: UserInfoViewComponent;
  let fixture: ComponentFixture<UserInfoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
