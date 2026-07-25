import { Component, OnInit, Optional } from '@angular/core';
import { Department, DepartmentService } from '../../../../shared/services/department-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-department-insert-update',
  standalone: false,
  templateUrl: './department-insert-update.html',
  styleUrl: './department-insert-update.scss'
})
export class DepartmentInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Department = {
    Name: '',
    Code: '',
    Description: '',
    HeadId: undefined
  };

  teachers: any[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly departmentService: DepartmentService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const dept: Department = this.config.data;
      this.formData = {
        Id: dept.Id,
        Name: dept.Name || '',
        Code: dept.Code || '',
        Description: dept.Description || '',
        HeadId: dept.HeadId ? Number(dept.HeadId) : (dept.HeadTeacher?.Id ? Number(dept.HeadTeacher.Id) : undefined)
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
    this.departmentService.getTeachers().subscribe({
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

  resetForm(): void {
    this.formData = {
      Name: '',
      Code: '',
      Description: '',
      HeadId: undefined
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name || !this.formData.Code) {
      this.errorMessage = 'Department Name and Code are required.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        Name: this.formData.Name,
        Code: this.formData.Code,
        Description: this.formData.Description || '',
        HeadId: this.formData.HeadId ? Number(this.formData.HeadId) : undefined
      };

      this.departmentService.updateDepartment(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Department updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update department.';
        }
      });
    } else {
      const createPayload = {
        Name: this.formData.Name,
        Code: this.formData.Code,
        Description: this.formData.Description || '',
        HeadId: this.formData.HeadId ? Number(this.formData.HeadId) : undefined
      };

      this.departmentService.addDepartment(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Department created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create department.';
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
