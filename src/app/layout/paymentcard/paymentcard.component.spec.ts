import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentcardComponent } from './paymentcard.component';

describe('PaymentcardComponent', () => {
  let component: PaymentcardComponent;
  let fixture: ComponentFixture<PaymentcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
