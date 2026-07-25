import { Component, OnInit, Optional } from '@angular/core';
import { ClassSchedule, ScheduleService } from '../../../../shared/services/schedule-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-schedule-insert-update',
  standalone: false,
  templateUrl: './schedule-insert-update.html',
  styleUrl: './schedule-insert-update.scss'
})
export class ScheduleInsertUpdateComponent implements OnInit {
  isEdit: boolean = false;

  formData: ClassSchedule = {
    ClassId: 0,
    SubjectId: 0,
    TeacherId: 0,
    DayOfWeek: 'MONDAY',
    StartTime: '09:00',
    EndTime: '10:00',
    RoomNo: ''
  };

  classes: any[] = [];
  subjects: any[] = [];
  teachers: any[] = [];

  classOptions: { label: string; value: any }[] = [];
  subjectOptions: { label: string; value: any }[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  dayOptions = [
    { label: 'Monday', value: 'MONDAY' },
    { label: 'Tuesday', value: 'TUESDAY' },
    { label: 'Wednesday', value: 'WEDNESDAY' },
    { label: 'Thursday', value: 'THURSDAY' },
    { label: 'Friday', value: 'FRIDAY' },
    { label: 'Saturday', value: 'SATURDAY' },
    { label: 'Sunday', value: 'SUNDAY' }
  ];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly scheduleService: ScheduleService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.loadDropdownData();

    if (this.config?.data) {
      this.isEdit = true;
      const sch: ClassSchedule = this.config.data;
      this.formData = {
        Id: sch.Id,
        ClassId: Number(sch.ClassId),
        SubjectId: Number(sch.SubjectId),
        TeacherId: Number(sch.TeacherId),
        DayOfWeek: sch.DayOfWeek || 'MONDAY',
        StartTime: sch.StartTime || '09:00',
        EndTime: sch.EndTime || '10:00',
        RoomNo: sch.RoomNo || ''
      };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  loadDropdownData(): void {
    this.scheduleService.getClasses().subscribe({
      next: (res) => {
        this.classes = res.data || [];
        this.classOptions = this.classes.map((c) => ({
          label: `${c.Name} (${c.Section})`,
          value: c.Id
        }));
      },
      error: (err) => console.error('Error fetching classes:', err)
    });

    this.scheduleService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res.data || [];
        this.subjectOptions = this.subjects.map((s) => ({
          label: `${s.Name} (${s.Code})`,
          value: s.Id
        }));
      },
      error: (err) => console.error('Error fetching subjects:', err)
    });

    this.scheduleService.getTeachers().subscribe({
      next: (res) => {
        this.teachers = res.data || [];
        this.teacherOptions = this.teachers.map((t) => ({
          label: t.Name,
          value: t.Id
        }));
      },
      error: (err) => console.error('Error fetching teachers:', err)
    });
  }

  resetForm(): void {
    this.formData = {
      ClassId: 0,
      SubjectId: 0,
      TeacherId: 0,
      DayOfWeek: 'MONDAY',
      StartTime: '09:00',
      EndTime: '10:00',
      RoomNo: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.ClassId || !this.formData.SubjectId || !this.formData.TeacherId || !this.formData.StartTime || !this.formData.EndTime) {
      this.errorMessage = 'Class, Subject, Teacher, Start Time, and End Time are required.';
      return;
    }

    this.isLoading = true;

    if (this.isEdit) {
      const updatePayload = {
        id: Number(this.formData.Id),
        Id: Number(this.formData.Id),
        ClassId: Number(this.formData.ClassId),
        SubjectId: Number(this.formData.SubjectId),
        TeacherId: Number(this.formData.TeacherId),
        DayOfWeek: this.formData.DayOfWeek,
        StartTime: this.formData.StartTime,
        EndTime: this.formData.EndTime,
        RoomNo: this.formData.RoomNo
      };

      this.scheduleService.updateSchedule(updatePayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Schedule updated successfully!';
          setTimeout(() => this.ref?.close(true), 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to update schedule.';
        }
      });
    } else {
      const createPayload = {
        ClassId: Number(this.formData.ClassId),
        SubjectId: Number(this.formData.SubjectId),
        TeacherId: Number(this.formData.TeacherId),
        DayOfWeek: this.formData.DayOfWeek,
        StartTime: this.formData.StartTime,
        EndTime: this.formData.EndTime,
        RoomNo: this.formData.RoomNo
      };

      this.scheduleService.addSchedule(createPayload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = res.message || 'Schedule created successfully!';
          setTimeout(() => this.ref?.close(true), 300);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.error || 'Failed to create schedule.';
        }
      });
    }
  }

  onCancel(): void {
    this.ref?.close(false);
  }
}
