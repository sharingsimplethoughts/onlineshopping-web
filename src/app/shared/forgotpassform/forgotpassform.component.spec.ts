import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpassformComponent } from './forgotpassform.component';

describe('ForgotpassformComponent', () => {
  let component: ForgotpassformComponent;
  let fixture: ComponentFixture<ForgotpassformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpassformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpassformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
