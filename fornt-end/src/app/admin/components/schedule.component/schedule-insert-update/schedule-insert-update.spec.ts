import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInsertUpdate } from './schedule-insert-update';

describe('ScheduleInsertUpdate', () => {
  let component: ScheduleInsertUpdate;
  let fixture: ComponentFixture<ScheduleInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
