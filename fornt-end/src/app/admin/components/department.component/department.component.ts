import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Department, DepartmentService } from '../../../shared/services/department-service';
import { DepartmentInsertUpdateComponent } from './department-insert-update/department-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-department',
  standalone: false,
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
        this.departments = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddDepartment(): void {
    const dialogRef = this.dialog.open(DepartmentInsertUpdateComponent, {
      header: 'Create New Department',
      width: '520px',
      modal: true,
      dismissableMask: true,
      styleClass: 'dept-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getDepartments();
        }
      });
    }
  }

  onEditDepartment(id?: number): void {
    if (!id) return;

    this.departmentService.getDepartmentById(id).subscribe({
      next: (res) => {
        const dept = res?.data;

        const dialogRef = this.dialog.open(DepartmentInsertUpdateComponent, {
          header: 'Edit Department Profile',
          width: '520px',
          modal: true,
          dismissableMask: true,
          styleClass: 'dept-modal-dialog',
          data: dept,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getDepartments();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching department details:', error);
      },
    });
  }

  onDeleteDepartment(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this department? This will affect linked subjects, students, and teachers.',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.departmentService.deleteDepartment(id).subscribe({
          next: () => {
            this.getDepartments();
          },
          error: (error) => {
            console.error('Error deleting department:', error);
          },
        });
      },
    });
  }
}
