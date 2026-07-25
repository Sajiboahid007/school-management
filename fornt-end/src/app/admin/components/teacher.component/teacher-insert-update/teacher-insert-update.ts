import { Component, OnInit, Optional } from '@angular/core';
import { Teacher, TeacherService } from '../../../../shared/services/teacher-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-teacher-insert-update',
  standalone: false,
  templateUrl: './teacher-insert-update.html',
  styleUrl: './teacher-insert-update.scss'
})
export class TeacherInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Teacher = {
    Name: '',
    Email: '',
    Password: '',
    Phone: '',
    Address: '',
    Gender: '',
    Qualification: '',
    JoiningDate: undefined,
    DepartmentId: undefined,
    RoleId: undefined
  };

  departments: any[] = [];
  roles: any[] = [];

  departmentOptions: { label: string; value: any }[] = [];
  roleOptions: { label: string; value: any }[] = [];
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly teacherService: TeacherService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const teacher: Teacher = this.config.data;
      this.formData = {
        Id: teacher.Id,
        Name: teacher.Name || '',
        Email: teacher.Email || '',
        Password: '',
        Phone: teacher.Phone || '',
        Address: teacher.Address || '',
        Gender: teacher.Gender || '',
        Qualification: teacher.Qualification || '',
        JoiningDate: teacher.JoiningDate ? teacher.JoiningDate.substring(0, 10) : undefined,
        DepartmentId: teacher.DepartmentId ? Number(teacher.DepartmentId) : (teacher.Department?.Id ? Number(teacher.Department.Id) : undefined),
        RoleId: teacher.RoleId ? Number(teacher.RoleId) : (teacher.Role?.Id ? Number(teacher.Role.Id) : undefined)
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
    this.teacherService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data || [];
        this.departmentOptions = this.departments.map((d) => ({
          label: d.Name,
          value: d.Id
        }));
      },
      error: (err) => console.error('Error fetching departments:', err)
    });

    this.teacherService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data || [];
        this.roleOptions = this.roles.map((r) => ({
          label: r.Name,
          value: r.Id
        }));
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      Email: '',
      Password: '',
      Phone: '',
      Address: '',
      Gender: '',
      Qualification: '',
      JoiningDate: undefined,
      DepartmentId: undefined,
      RoleId: undefined
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name || !this.formData.Email) {
      this.errorMessage = 'Teacher Name and Email are required.';
      return;
    }

    if (!this.isEdit && !this.formData.Password) {
      this.errorMessage = 'Password is required when registering a new teacher.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload: any = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        Name: this.formData.Name,
        Email: this.formData.Email,
        Phone: this.formData.Phone,
        Address: this.formData.Address,
        Gender: this.formData.Gender,
        Qualification: this.formData.Qualification,
        JoiningDate: this.formData.JoiningDate,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };
      if (this.formData.Password) {
        updatePayload.Password = this.formData.Password;
      }

      this.teacherService.updateTeacher(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Teacher profile updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update teacher.';
        }
      });
    } else {
      const createPayload: any = {
        Name: this.formData.Name,
        Email: this.formData.Email,
        Password: this.formData.Password,
        Phone: this.formData.Phone,
        Address: this.formData.Address,
        Gender: this.formData.Gender,
        Qualification: this.formData.Qualification,
        JoiningDate: this.formData.JoiningDate,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };

      this.teacherService.addTeacher(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Teacher registered successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to register teacher.';
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
