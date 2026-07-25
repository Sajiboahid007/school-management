import { Component, OnInit, Optional } from '@angular/core';
import { Student, StudentService } from '../../../../shared/services/student-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-student-insert-update',
  standalone: false,
  templateUrl: './student-insert-update.html',
  styleUrl: './student-insert-update.scss'
})
export class StudentInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Student = {
    RollNumber: '',
    Name: '',
    Email: '',
    Password: '',
    Phone: '',
    Address: '',
    Gender: '',
    DateOfBirth: undefined,
    ClassId: undefined,
    DepartmentId: undefined,
    RoleId: undefined
  };

  classes: any[] = [];
  departments: any[] = [];
  roles: any[] = [];

  classOptions: { label: string; value: any }[] = [];
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
    private readonly studentService: StudentService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const student: Student = this.config.data;
      this.formData = {
        Id: student.Id,
        RollNumber: student.RollNumber || '',
        Name: student.Name || '',
        Email: student.Email || '',
        Password: '',
        Phone: student.Phone || '',
        Address: student.Address || '',
        Gender: student.Gender || '',
        DateOfBirth: student.DateOfBirth ? student.DateOfBirth.substring(0, 10) : undefined,
        ClassId: student.ClassId ? Number(student.ClassId) : (student.Class?.Id ? Number(student.Class.Id) : undefined),
        DepartmentId: student.DepartmentId ? Number(student.DepartmentId) : (student.Department?.Id ? Number(student.Department.Id) : undefined),
        RoleId: student.RoleId ? Number(student.RoleId) : (student.Role?.Id ? Number(student.Role.Id) : undefined)
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
    this.studentService.getClasses().subscribe({
      next: (res) => {
        this.classes = res.data || [];
        this.classOptions = this.classes.map((c) => ({
          label: `${c.Name} (${c.Section})`,
          value: c.Id
        }));
      },
      error: (err) => console.error('Error fetching classes:', err)
    });

    this.studentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.data || [];
        this.departmentOptions = this.departments.map((d) => ({
          label: d.Name,
          value: d.Id
        }));
      },
      error: (err) => console.error('Error fetching departments:', err)
    });

    this.studentService.getRoles().subscribe({
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
      RollNumber: '',
      Name: '',
      Email: '',
      Password: '',
      Phone: '',
      Address: '',
      Gender: '',
      DateOfBirth: undefined,
      ClassId: undefined,
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
      this.errorMessage = 'Student Name and Email are required.';
      return;
    }

    if (!this.isEdit && !this.formData.Password) {
      this.errorMessage = 'Password is required when adding a new student.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload: any = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        RollNumber: this.formData.RollNumber,
        Name: this.formData.Name,
        Email: this.formData.Email,
        Phone: this.formData.Phone,
        Address: this.formData.Address,
        Gender: this.formData.Gender,
        DateOfBirth: this.formData.DateOfBirth,
        ClassId: this.formData.ClassId ? Number(this.formData.ClassId) : undefined,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };
      if (this.formData.Password) {
        updatePayload.Password = this.formData.Password;
      }

      this.studentService.updateStudent(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Student updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update student.';
        }
      });
    } else {
      const createPayload: any = {
        RollNumber: this.formData.RollNumber,
        Name: this.formData.Name,
        Email: this.formData.Email,
        Password: this.formData.Password,
        Phone: this.formData.Phone,
        Address: this.formData.Address,
        Gender: this.formData.Gender,
        DateOfBirth: this.formData.DateOfBirth,
        ClassId: this.formData.ClassId ? Number(this.formData.ClassId) : undefined,
        DepartmentId: this.formData.DepartmentId ? Number(this.formData.DepartmentId) : undefined,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };

      this.studentService.addStudent(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Student created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create student.';
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
