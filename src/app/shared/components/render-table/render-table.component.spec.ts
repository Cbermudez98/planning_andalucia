import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderTableComponent } from './render-table.component';

describe('RenderTableComponent', () => {
  let component: RenderTableComponent;
  let fixture: ComponentFixture<RenderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
