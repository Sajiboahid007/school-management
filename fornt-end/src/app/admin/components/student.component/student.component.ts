import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Student, StudentService } from '../../../shared/services/student-service';
import { StudentInsertUpdateComponent } from './student-insert-update/student-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly studentService: StudentService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.isLoading = true;
    this.studentService.getStudents().subscribe({
      next: (response) => {
        this.students = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.students = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddStudent(): void {
    const dialogRef = this.dialog.open(StudentInsertUpdateComponent, {
      header: 'Register New Student',
      width: '580px',
      modal: true,
      dismissableMask: true,
      styleClass: 'student-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getStudents();
        }
      });
    }
  }

  onEditStudent(id?: number): void {
    if (!id) return;

    this.studentService.getStudentById(id).subscribe({
      next: (res) => {
        const student = res?.data;

        const dialogRef = this.dialog.open(StudentInsertUpdateComponent, {
          header: 'Edit Student Profile',
          width: '580px',
          modal: true,
          dismissableMask: true,
          styleClass: 'student-modal-dialog',
          data: student,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getStudents();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching student details:', error);
      },
    });
  }

  onDeleteStudent(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.getStudents();
          },
          error: (error) => {
            console.error('Error deleting student:', error);
          },
        });
      },
    });
  }
}
