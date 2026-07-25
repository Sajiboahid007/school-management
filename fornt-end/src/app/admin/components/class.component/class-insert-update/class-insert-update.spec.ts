import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassInsertUpdate } from './class-insert-update';

describe('ClassInsertUpdate', () => {
  let component: ClassInsertUpdate;
  let fixture: ComponentFixture<ClassInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
