import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderCsvComponent } from './render-csv.component';

describe('RenderCsvComponent', () => {
  let component: RenderCsvComponent;
  let fixture: ComponentFixture<RenderCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderCsvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
