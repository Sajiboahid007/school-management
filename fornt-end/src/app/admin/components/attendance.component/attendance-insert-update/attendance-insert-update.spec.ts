import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceInsertUpdate } from './attendance-insert-update';

describe('AttendanceInsertUpdate', () => {
  let component: AttendanceInsertUpdate;
  let fixture: ComponentFixture<AttendanceInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
