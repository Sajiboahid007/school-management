import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollect } from './fee-collect';

describe('FeeCollect', () => {
  let component: FeeCollect;
  let fixture: ComponentFixture<FeeCollect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeCollect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeCollect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
