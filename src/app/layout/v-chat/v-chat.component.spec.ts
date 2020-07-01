import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VChatComponent } from './v-chat.component';

describe('VChatComponent', () => {
  let component: VChatComponent;
  let fixture: ComponentFixture<VChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
