import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentInsertUpdate } from './department-insert-update';

describe('DepartmentInsertUpdate', () => {
  let component: DepartmentInsertUpdate;
  let fixture: ComponentFixture<DepartmentInsertUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentInsertUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentInsertUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
