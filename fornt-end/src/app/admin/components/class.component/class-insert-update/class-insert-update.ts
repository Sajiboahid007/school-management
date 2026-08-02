import { Component, OnInit, Optional } from '@angular/core';
import { Class, ClassService } from '../../../../shared/services/class-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-class-insert-update',
  standalone: false,
  templateUrl: './class-insert-update.html',
  styleUrl: './class-insert-update.scss'
})
export class ClassInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Class = {
    Name: '',
    Section: '',
    RoomNumber: '',
    Capacity: 40,
    ClassTeacherId: undefined,
    SubjectIds: []
  };

  teachers: any[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  subjects: any[] = [];
  subjectOptions: { label: string; value: any }[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly classService: ClassService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const cls: Class = this.config.data;
      this.formData = {
        Id: cls.Id,
        Name: cls.Name || '',
        Section: cls.Section || '',
        RoomNumber: cls.RoomNumber || '',
        Capacity: cls.Capacity || 40,
        ClassTeacherId: cls.ClassTeacherId ? Number(cls.ClassTeacherId) : (cls.ClassTeacher?.Id ? Number(cls.ClassTeacher.Id) : undefined),
        SubjectIds: cls.Subjects ? cls.Subjects.map((s: any) => s.Id) : []
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
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

    this.classService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res.data || [];
        this.subjectOptions = this.subjects.map((s) => ({
          label: `${s.Name} (${s.Code})`,
          value: s.Id
        }));
      },
      error: (err) => console.error('Error fetching subjects:', err)
    });
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      Section: '',
      RoomNumber: '',
      Capacity: 40,
      ClassTeacherId: undefined,
      SubjectIds: []
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name || !this.formData.Section) {
      this.errorMessage = 'Class Name and Section are required.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        Name: this.formData.Name,
        Section: this.formData.Section,
        RoomNumber: this.formData.RoomNumber,
        Capacity: this.formData.Capacity ? Number(this.formData.Capacity) : undefined,
        ClassTeacherId: this.formData.ClassTeacherId ? Number(this.formData.ClassTeacherId) : undefined,
        SubjectIds: this.formData.SubjectIds
      };

      this.classService.updateClass(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Class updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update class.';
        }
      });
    } else {
      const createPayload = {
        Name: this.formData.Name,
        Section: this.formData.Section,
        RoomNumber: this.formData.RoomNumber,
        Capacity: this.formData.Capacity ? Number(this.formData.Capacity) : undefined,
        ClassTeacherId: this.formData.ClassTeacherId ? Number(this.formData.ClassTeacherId) : undefined,
        SubjectIds: this.formData.SubjectIds
      };

      this.classService.addClass(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Class created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create class.';
        }
      });
    }
  }

  onCancel(): void {
    if (this.ref) {
      this.ref.close(false);
    }
  }
}
