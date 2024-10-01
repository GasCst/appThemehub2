import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPurchasesComponentComponent } from './user-purchases-component.component';

describe('UserPurchasesComponentComponent', () => {
  let component: UserPurchasesComponentComponent;
  let fixture: ComponentFixture<UserPurchasesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPurchasesComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPurchasesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
