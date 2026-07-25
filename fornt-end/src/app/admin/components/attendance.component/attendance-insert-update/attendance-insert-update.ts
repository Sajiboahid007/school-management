import { Component, OnInit, Optional } from '@angular/core';
import { Attendance, AttendanceService } from '../../../../shared/services/attendance-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface StudentRow {
  StudentId: number;
  Name: string;
  RollNumber: string;
  Status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

@Component({
  selector: 'app-attendance-insert-update',
  standalone: false,
  templateUrl: './attendance-insert-update.html',
  styleUrl: './attendance-insert-update.scss'
})
export class AttendanceInsertUpdateComponent implements OnInit {
  classData: any = null;

  attendanceDate: string = '';
  recordedByTeacherId?: number;

  students: StudentRow[] = [];
  teachers: any[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  statusOptions = [
    { label: 'Present', value: 'PRESENT' },
    { label: 'Absent', value: 'ABSENT' },
    { label: 'Late', value: 'LATE' },
    { label: 'Excused', value: 'EXCUSED' }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly attendanceService: AttendanceService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.attendanceDate = new Date().toISOString().split('T')[0];

    if (this.config?.data) {
      this.classData = this.config.data;
      this.recordedByTeacherId = this.classData.ClassTeacherId ? Number(this.classData.ClassTeacherId) : undefined;
      this.loadStudentsAndTeachers();
    } else {
      this.errorMessage = 'Class details were not provided.';
    }
  }

  loadStudentsAndTeachers(): void {
    this.isLoading = true;

    // Load Teachers for Recorded By selection
    this.attendanceService.getTeachers().subscribe({
      next: (res) => {
        this.teachers = res.data || [];
        this.teacherOptions = this.teachers.map((t) => ({
          label: t.Name,
          value: t.Id
        }));
      },
      error: (err) => console.error('Error fetching teachers:', err)
    });

    // Load Students and filter by ClassId
    this.attendanceService.getStudents().subscribe({
      next: (res) => {
        const allStudents = res.data || [];
        const filtered = allStudents.filter((s: any) => Number(s.ClassId) === Number(this.classData.Id));

        this.students = filtered.map((s: any) => ({
          StudentId: s.Id,
          Name: s.Name,
          RollNumber: s.RollNumber || 'N/A',
          Status: 'PRESENT' // Default status is PRESENT
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load students for this class.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.attendanceDate || !this.recordedByTeacherId) {
      this.errorMessage = 'Date and Class Teacher are required.';
      return;
    }

    if (this.students.length === 0) {
      this.errorMessage = 'No students found in this class to record attendance.';
      return;
    }

    this.isLoading = true;

    // Prepare bulk payload
    const payload: Attendance[] = this.students.map((s) => ({
      Date: this.attendanceDate,
      Status: s.Status,
      StudentId: s.StudentId,
      ClassId: Number(this.classData.Id),
      RecordedByTeacherId: Number(this.recordedByTeacherId)
    }));

    this.attendanceService.addBulkAttendance(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Class attendance recorded successfully!';
        setTimeout(() => {
          if (this.ref) {
            this.ref.close(true);
          }
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Failed to record attendance.';
      }
    });
  }

  onCancel(): void {
    if (this.ref) {
      this.ref.close(false);
    }
  }
}
