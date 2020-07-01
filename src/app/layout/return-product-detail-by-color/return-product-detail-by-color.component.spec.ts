import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnProductDetailByColorComponent } from './return-product-detail-by-color.component';

describe('ReturnProductDetailByColorComponent', () => {
  let component: ReturnProductDetailByColorComponent;
  let fixture: ComponentFixture<ReturnProductDetailByColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnProductDetailByColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnProductDetailByColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
