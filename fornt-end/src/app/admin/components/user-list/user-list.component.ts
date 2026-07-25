import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User, UserService } from '../../../shared/services/user-service';
import { UserInsertUpdateComponent } from './user-insert-update/user-insert-update.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'user',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles: any[] = [];
  roleOptions: { label: string; value: any }[] = [];
  selectedRoleFilter: any = null;
  isLoading: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getRoleSeverity(roleName?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (!roleName) return 'secondary';
    const lower = roleName.toLowerCase();
    if (lower.includes('super')) return 'danger';
    if (lower.includes('admin')) return 'info';
    if (lower.includes('teacher')) return 'warn';
    if (lower.includes('student')) return 'success';
    return 'secondary';
  }

  getUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.users = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }



  applyRoleFilter(table: any): void {
    if (this.selectedRoleFilter !== null && this.selectedRoleFilter !== undefined) {
      const selectedRoleObj = this.roles.find(r => Number(r.Id) === Number(this.selectedRoleFilter));
      const roleName = selectedRoleObj ? selectedRoleObj.Name : '';
      if (table) {
        table.filter(roleName, 'Role.Name', 'equals');
      }
    } else {
      if (table) {
        table.filter('', 'Role.Name', 'equals');
      }
    }
  }

  onAddUser(): void {
    const dialogRef = this.dialog.open(UserInsertUpdateComponent, {
      header: 'Add New User',
      width: '540px',
      modal: true,
      dismissableMask: true,
      styleClass: 'user-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getUsers();
        }
      });
    }
  }

  onEditUser(id: number): void {
    if (!id) return;

    this.userService.getUserById(id).subscribe({
      next: (res) => {
        const user = res?.data;

        const dialogRef = this.dialog.open(UserInsertUpdateComponent, {
          header: 'Edit User Details',
          width: '540px',
          modal: true,
          dismissableMask: true,
          styleClass: 'user-modal-dialog',
          data: user,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getUsers();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  onDeleteUser(id: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.getUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          },
        });
      },
    });
  }
}
