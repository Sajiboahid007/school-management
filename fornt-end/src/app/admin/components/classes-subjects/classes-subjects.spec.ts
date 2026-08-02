import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesSubjects } from './classes-subjects';

describe('ClassesSubjects', () => {
  let component: ClassesSubjects;
  let fixture: ComponentFixture<ClassesSubjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesSubjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesSubjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
