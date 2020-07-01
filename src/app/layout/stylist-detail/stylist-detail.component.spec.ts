import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StylistDetailComponent } from './stylist-detail.component';

describe('StylistDetailComponent', () => {
  let component: StylistDetailComponent;
  let fixture: ComponentFixture<StylistDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
