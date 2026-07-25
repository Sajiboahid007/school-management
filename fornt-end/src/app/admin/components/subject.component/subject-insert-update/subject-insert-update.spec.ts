import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectInsertUpdate } from './subject-insert-update';

describe('SubjectInsertUpdate', () => {
  let component: SubjectInsertUpdate;
  let fixture: ComponentFixture<SubjectInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
