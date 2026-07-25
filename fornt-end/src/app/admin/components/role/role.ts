import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Role as RoleModel, RoleService } from '../../../shared/services/role-service';
import { RoleInsertUpdateComponent } from './role-insert-update/role-insert-update.component';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.html',
  styleUrl: './role.scss',
})
export class RoleComponent implements OnInit {
  roles: RoleModel[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly roleService: RoleService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getRoles();
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

  getRoles(): void {
    this.isLoading = true;
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.roles = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddRole(): void {
    const dialogRef = this.dialog.open(RoleInsertUpdateComponent, {
      header: 'Add New Role',
      width: '480px',
      modal: true,
      dismissableMask: true,
      styleClass: 'role-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getRoles();
        }
      });
    }
  }

  onEditRole(role: RoleModel): void {
    if (!role || !role.Id) return;

    const dialogRef = this.dialog.open(RoleInsertUpdateComponent, {
      header: 'Edit Role Details',
      width: '480px',
      modal: true,
      dismissableMask: true,
      styleClass: 'role-modal-dialog',
      data: role,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getRoles();
        }
      });
    }
  }

  onDeleteRole(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this role?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.roleService.deleteRole(id).subscribe({
          next: () => {
            this.getRoles();
          },
          error: (error) => {
            console.error('Error deleting role:', error);
          },
        });
      },
    });
  }
}
