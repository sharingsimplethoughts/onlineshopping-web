import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnProductDetailComponent } from './return-product-detail.component';

describe('ReturnProductDetailComponent', () => {
  let component: ReturnProductDetailComponent;
  let fixture: ComponentFixture<ReturnProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
