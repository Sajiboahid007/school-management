import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClassService } from '../../../shared/services/class-service';
import { Subject, SubjectService } from '../../../shared/services/subject-service';

@Component({
  selector: 'app-classes-subjects',
  standalone: false,
  templateUrl: './classes-subjects.html',
  styleUrl: './classes-subjects.scss',
})
export class ClassesSubjectsComponent implements OnInit {
  classes: any[] = [];
  classOptions: { label: string; value: any }[] = [];
  selectedClassId?: number;

  teachers: any[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  isLoading: boolean = false;
  isSaving: { [subjectId: number]: boolean } = {};

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private readonly classService: ClassService,
    private readonly subjectService: SubjectService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.isLoading = true;
    
    // Load Classes
    this.classService.getClasses().subscribe({
      next: (res) => {
        this.classes = res.data || [];
        this.classOptions = this.classes.map((c) => ({
          label: `${c.Name} (${c.Section})`,
          value: c.Id
        }));
        if (this.classOptions.length > 0) {
          this.selectedClassId = this.classOptions[0].value;
          this.loadSubjectsAndFilter();
        } else {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });

    // Load Teachers
    this.classService.getTeachers().subscribe({
      next: (res) => {
        this.teachers = res.data || [];
        this.teacherOptions = this.teachers.map((t) => ({
          label: t.Name,
          value: t.Id
        }));
      },
      error: (err) => console.error('Error fetching teachers:', err)
    });
  }

  loadSubjectsAndFilter(): void {
    this.isLoading = true;
    this.subjectService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res.data || [];
        this.filterSubjectsByClass();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching subjects:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onClassChange(): void {
    this.filterSubjectsByClass();
  }

  filterSubjectsByClass(): void {
    if (!this.selectedClassId) {
      this.filteredSubjects = [];
      return;
    }
    this.filteredSubjects = this.subjects.filter(
      (s) => Number(s.ClassId) === Number(this.selectedClassId)
    );
  }

  onTeacherAssign(sub: Subject): void {
    if (!sub.Id) return;

    this.isSaving[sub.Id] = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      id: Number(sub.Id),
      Id: Number(sub.Id),
      Name: sub.Name,
      Code: sub.Code,
      DepartmentId: sub.DepartmentId ? Number(sub.DepartmentId) : undefined,
      TeacherId: sub.TeacherId ? Number(sub.TeacherId) : null,
      ClassId: sub.ClassId ? Number(sub.ClassId) : null
    };

    this.subjectService.updateSubject(payload as any).subscribe({
      next: (res) => {
        this.isSaving[sub.Id!] = false;
        this.successMessage = `Teacher successfully assigned to ${sub.Name}!`;
        // Reload list to get updated instructor data
        this.subjectService.getSubjects().subscribe((sRes) => {
          this.subjects = sRes.data || [];
          this.filterSubjectsByClass();
          this.cdr.markForCheck();
        });
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (err) => {
        this.isSaving[sub.Id!] = false;
        this.errorMessage = err?.error?.error || `Failed to assign teacher for ${sub.Name}.`;
        this.cdr.markForCheck();
      }
    });
  }
}
