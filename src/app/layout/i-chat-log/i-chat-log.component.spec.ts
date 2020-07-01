import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IChatLogComponent } from './i-chat-log.component';

describe('IChatLogComponent', () => {
  let component: IChatLogComponent;
  let fixture: ComponentFixture<IChatLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IChatLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IChatLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
