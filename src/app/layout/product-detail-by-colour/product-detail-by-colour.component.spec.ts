import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailByColourComponent } from './product-detail-by-colour.component';

describe('ProductDetailByColourComponent', () => {
  let component: ProductDetailByColourComponent;
  let fixture: ComponentFixture<ProductDetailByColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailByColourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailByColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
