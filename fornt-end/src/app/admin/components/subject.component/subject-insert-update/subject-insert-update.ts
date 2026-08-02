import { Component, OnInit, Optional } from '@angular/core';
import { Subject, SubjectService } from '../../../../shared/services/subject-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-subject-insert-update',
  standalone: false,
  templateUrl: './subject-insert-update.html',
  styleUrl: './subject-insert-update.scss'
})
export class SubjectInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Subject = {
    Name: '',
    Code: '',
    DepartmentId: undefined
  };

  departments: any[] = [];
  departmentOptions: { label: string; value: any }[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly subjectService: SubjectService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const sub: Subject = this.config.data;
      this.formData = {
        Id: sub.Id,
        Name: sub.Name || '',
        Code: sub.Code || '',
        DepartmentId: sub.DepartmentId ? Number(sub.DepartmentId) : (sub.Department?.Id ? Number(sub.Department.Id) : undefined)
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
    this.subjectService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data || [];
        this.departmentOptions = this.departments.map((d) => ({
          label: d.Name,
          value: d.Id
        }));
      },
      error: (err) => console.error('Error fetching departments:', err)
    });
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      Code: '',
      DepartmentId: undefined
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name || !this.formData.Code) {
      this.errorMessage = 'Subject Name and Code are required.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        Name: this.formData.Name,
        Code: this.formData.Code,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        TeacherId: undefined,
        ClassId: undefined
      };

      this.subjectService.updateSubject(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Subject updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update subject.';
        }
      });
    } else {
      const createPayload = {
        Name: this.formData.Name,
        Code: this.formData.Code,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        TeacherId: undefined,
        ClassId: undefined
      };

      this.subjectService.addSubject(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Subject created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create subject.';
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
