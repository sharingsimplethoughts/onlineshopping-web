import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnProductProcessComponent } from './return-product-process.component';

describe('ReturnProductProcessComponent', () => {
  let component: ReturnProductProcessComponent;
  let fixture: ComponentFixture<ReturnProductProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnProductProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnProductProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
