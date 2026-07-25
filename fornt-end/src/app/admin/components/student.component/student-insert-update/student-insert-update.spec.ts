import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInsertUpdate } from './student-insert-update';

describe('StudentInsertUpdate', () => {
  let component: StudentInsertUpdate;
  let fixture: ComponentFixture<StudentInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
