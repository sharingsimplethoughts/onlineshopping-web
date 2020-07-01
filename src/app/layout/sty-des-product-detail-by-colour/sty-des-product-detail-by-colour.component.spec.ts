import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyDesProductDetailByColourComponent } from './sty-des-product-detail-by-colour.component';

describe('StyDesProductDetailByColourComponent', () => {
  let component: StyDesProductDetailByColourComponent;
  let fixture: ComponentFixture<StyDesProductDetailByColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyDesProductDetailByColourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyDesProductDetailByColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
