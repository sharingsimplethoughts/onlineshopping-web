import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistDesignerProductDetailComponent } from './stylist-designer-product-detail.component';

describe('StylistDesignerProductDetailComponent', () => {
  let component: StylistDesignerProductDetailComponent;
  let fixture: ComponentFixture<StylistDesignerProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistDesignerProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylistDesignerProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
