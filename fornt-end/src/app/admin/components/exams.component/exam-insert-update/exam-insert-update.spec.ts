import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInsertUpdate } from './exam-insert-update';

describe('ExamInsertUpdate', () => {
  let component: ExamInsertUpdate;
  let fixture: ComponentFixture<ExamInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
