import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonChatComponent } from './skeleton-chat.component';

describe('SkeletonChatComponent', () => {
  let component: SkeletonChatComponent;
  let fixture: ComponentFixture<SkeletonChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
