import { Component, OnInit, Optional } from '@angular/core';
import { User, UserService } from '../../../../shared/services/user-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-insert-update',
  standalone: false,
  templateUrl: './user-insert-update.component.html',
  styleUrl: './user-insert-update.component.scss'
})
export class UserInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: User = {
    Name: '',
    Email: '',
    Password: '',
    Phone: '',
    RoleId: undefined
  };

  roles: any[] = [];
  roleOptions: { label: string; value: any }[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly userService: UserService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    if (this.config?.data) {
      this.isEdit = true;
      const user: User = this.config.data;
      this.formData = {
        Id: user.Id,
        Name: user.Name || '',
        Email: user.Email || '',
        Password: '',
        Phone: user.Phone || '',
        RoleId: user.RoleId ? Number(user.RoleId) : (user.Role?.Id ? Number(user.Role.Id) : undefined)
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data || [];
        this.roleOptions = this.roles.map((r) => ({
          label: r.Name,
          value: r.Id
        }));
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  resetForm(): void {
    this.formData = {
      Name: '',
      Email: '',
      Password: '',
      Phone: '',
      RoleId: undefined
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.Name || !this.formData.Email) {
      this.errorMessage = 'Name and Email are required.';
      return;
    }

    if (!this.isEdit && !this.formData.Password) {
      this.errorMessage = 'Password is required when creating a new user.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload: User = {
        Id: this.formData.Id,
        Name: this.formData.Name,
        Email: this.formData.Email,
        Phone: this.formData.Phone,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };
      if (this.formData.Password) {
        updatePayload.Password = this.formData.Password;
      }

      this.userService.updateUser(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'User updated successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update user.';
        }
      });
    } else {
      const createPayload: User = {
        Name: this.formData.Name,
        Email: this.formData.Email,
        Password: this.formData.Password,
        Phone: this.formData.Phone,
        RoleId: this.formData.RoleId ? Number(this.formData.RoleId) : undefined
      };

      this.userService.addUser(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'User created successfully!';
          setTimeout(() => {
            if (this.ref) {
              this.ref.close(true);
            }
          }, 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create user.';
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
