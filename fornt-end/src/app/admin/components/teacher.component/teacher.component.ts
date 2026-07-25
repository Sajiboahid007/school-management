import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Teacher, TeacherService } from '../../../shared/services/teacher-service';
import { TeacherInsertUpdateComponent } from './teacher-insert-update/teacher-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-teacher',
  standalone: false,
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly teacherService: TeacherService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  getTeachers(): void {
    this.isLoading = true;
    this.teacherService.getTeachers().subscribe({
      next: (response) => {
        this.teachers = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching teachers:', error);
        this.teachers = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddTeacher(): void {
    const dialogRef = this.dialog.open(TeacherInsertUpdateComponent, {
      header: 'Register New Teacher',
      width: '580px',
      modal: true,
      dismissableMask: true,
      styleClass: 'teacher-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getTeachers();
        }
      });
    }
  }

  onEditTeacher(id?: number): void {
    if (!id) return;

    this.teacherService.getTeacherById(id).subscribe({
      next: (res) => {
        const teacher = res?.data;

        const dialogRef = this.dialog.open(TeacherInsertUpdateComponent, {
          header: 'Edit Teacher Profile',
          width: '580px',
          modal: true,
          dismissableMask: true,
          styleClass: 'teacher-modal-dialog',
          data: teacher,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getTeachers();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching teacher details:', error);
      },
    });
  }

  onDeleteTeacher(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this teacher record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.teacherService.deleteTeacher(id).subscribe({
          next: () => {
            this.getTeachers();
          },
          error: (error) => {
            console.error('Error deleting teacher:', error);
          },
        });
      },
    });
  }
}
