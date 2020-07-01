import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnProductPaymentMethodComponent } from './return-product-payment-method.component';

describe('ReturnProductPaymentMethodComponent', () => {
  let component: ReturnProductPaymentMethodComponent;
  let fixture: ComponentFixture<ReturnProductPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnProductPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnProductPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
