import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Attendance, AttendanceService } from '../../../shared/services/attendance-service';
import { AttendanceInsertUpdateComponent } from './attendance-insert-update/attendance-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

interface ReportRow {
  RollNumber: string;
  Name: string;
  TotalDays: number;
  PresentDays: number;
  AbsentDays: number;
  LateDays: number;
  Percentage: number;
  DayStatusMap: { [day: number]: string };
}

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  activeTab: 'classes' | 'report' | 'history' = 'classes';

  classes: any[] = [];
  classOptions: { label: string; value: any }[] = [];
  attendances: Attendance[] = [];

  isLoadingClasses: boolean = false;
  isLoadingHistory: boolean = false;
  isLoadingReport: boolean = false;

  // Monthly Report Fields
  selectedClassId?: number;
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  daysInMonth: number[] = [];
  reportData: ReportRow[] = [];

  monthOptions = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 }
  ];

  yearOptions = [
    { label: '2025', value: 2025 },
    { label: '2026', value: 2026 },
    { label: '2027', value: 2027 },
    { label: '2028', value: 2028 }
  ];

  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getClasses();
    this.getAttendances();
  }

  getClasses(): void {
    this.isLoadingClasses = true;
    this.attendanceService.getClasses().subscribe({
      next: (response) => {
        this.classes = response.data || [];
        this.classOptions = this.classes.map((c) => ({
          label: `${c.Name} (${c.Section})`,
          value: c.Id
        }));
        if (this.classOptions.length > 0) {
          this.selectedClassId = this.classOptions[0].value;
          this.onReportParamChange();
        }
        this.isLoadingClasses = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.classes = [];
        this.isLoadingClasses = false;
        this.cdr.markForCheck();
      },
    });
  }

  getAttendances(): void {
    this.isLoadingHistory = true;
    this.attendanceService.getAttendances().subscribe({
      next: (response) => {
        this.attendances = response.data || [];
        this.isLoadingHistory = false;
        this.onReportParamChange();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching attendance logs:', error);
        this.attendances = [];
        this.isLoadingHistory = false;
        this.cdr.markForCheck();
      },
    });
  }

  switchTab(tab: 'classes' | 'report' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'report') {
      this.onReportParamChange();
    }
  }

  onReportParamChange(): void {
    if (!this.selectedClassId) {
      this.reportData = [];
      this.daysInMonth = [];
      return;
    }

    this.isLoadingReport = true;

    // Calculate days in selected month & year
    const totalDays = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Fetch students of this class and compute report data
    this.attendanceService.getStudents().subscribe({
      next: (res) => {
        const classStudents = (res.data || []).filter((s: any) => Number(s.ClassId) === Number(this.selectedClassId));

        // Filter attendance logs for this class, month, and year
        const filteredLogs = this.attendances.filter((att) => {
          const attDate = new Date(att.Date);
          return (
            Number(att.ClassId) === Number(this.selectedClassId) &&
            attDate.getMonth() === Number(this.selectedMonth) &&
            attDate.getFullYear() === Number(this.selectedYear)
          );
        });

        // Compute stats for each student
        this.reportData = classStudents.map((student: any) => {
          const studentLogs = filteredLogs.filter((log) => Number(log.StudentId) === Number(student.Id));
          const total = studentLogs.length;
          const present = studentLogs.filter((log) => log.Status === 'PRESENT').length;
          const absent = studentLogs.filter((log) => log.Status === 'ABSENT').length;
          const late = studentLogs.filter((log) => log.Status === 'LATE').length;
          const percentage = total > 0 ? Math.round(((present + late * 0.7) / total) * 100) : 100;

          // Day map for checklist columns
          const dayStatusMap: { [day: number]: string } = {};
          studentLogs.forEach((log) => {
            const d = new Date(log.Date).getDate();
            dayStatusMap[d] = log.Status;
          });

          return {
            RollNumber: student.RollNumber || 'N/A',
            Name: student.Name,
            TotalDays: total,
            PresentDays: present,
            AbsentDays: absent,
            LateDays: late,
            Percentage: percentage,
            DayStatusMap: dayStatusMap
          };
        });

        this.isLoadingReport = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.isLoadingReport = false;
        this.cdr.markForCheck();
      }
    });
  }

  onTakeAttendance(cls: any): void {
    const dialogRef = this.dialog.open(AttendanceInsertUpdateComponent, {
      header: `Take Attendance - ${cls.Name} (${cls.Section})`,
      width: '680px',
      modal: true,
      dismissableMask: true,
      styleClass: 'attendance-modal-dialog',
      data: cls,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getAttendances();
        }
      });
    }
  }

  onDeleteAttendance(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student attendance log entry?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.attendanceService.deleteAttendance(id).subscribe({
          next: () => {
            this.getAttendances();
          },
          error: (error) => {
            console.error('Error deleting attendance:', error);
          },
        });
      },
    });
  }

  getStatusSeverity(status?: string): 'success' | 'danger' | 'warn' | 'secondary' {
    switch (status?.toUpperCase()) {
      case 'PRESENT': return 'success';
      case 'ABSENT': return 'danger';
      case 'LATE': return 'warn';
      default: return 'secondary';
    }
  }

  getDayLabel(day?: string): string {
    if (!day) return '';
    return day[0] + day.slice(1).toLowerCase();
  }
}
