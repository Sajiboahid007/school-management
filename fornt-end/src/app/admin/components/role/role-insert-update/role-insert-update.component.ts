import { Component, OnInit, Optional } from '@angular/core';
import { Role, RoleService } from '../../../../shared/services/role-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-role-insert-update',
  standalone: false,
  templateUrl: './role-insert-update.component.html',
  styleUrl: './role-insert-update.component.scss'
})
export class RoleInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: Role = {
    Name: '',
    Description: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly roleService: RoleService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config?.data) {
      this.isEdit = true;
      const role: Role = this.config.data;
      this.formData = {
        Id: role.Id,
        Name: role.Name || '',
        Description: role.Description || ''
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      Description: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name) {
      this.errorMessage = 'Role Name is required.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        Name: this.formData.Name,
        Description: this.formData.Description || ''
      };
      this.roleService.updateRole(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Role updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update role.';
        }
      });
    } else {
      this.roleService.addRole(this.formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Role created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create role.';
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
