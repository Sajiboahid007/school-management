import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClassSchedule, ScheduleService } from '../../../shared/services/schedule-service';
import { ScheduleInsertUpdateComponent } from './schedule-insert-update/schedule-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  schedules: ClassSchedule[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSchedules();
  }

  getSchedules(): void {
    this.isLoading = true;
    this.scheduleService.getSchedules().subscribe({
      next: (response) => {
        this.schedules = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching schedules:', error);
        this.schedules = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddSchedule(): void {
    const dialogRef = this.dialog.open(ScheduleInsertUpdateComponent, {
      header: 'Add Class Schedule',
      width: '560px',
      modal: true,
      dismissableMask: true,
      styleClass: 'schedule-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getSchedules();
        }
      });
    }
  }

  onEditSchedule(sch: ClassSchedule): void {
    const dialogRef = this.dialog.open(ScheduleInsertUpdateComponent, {
      header: 'Edit Schedule Details',
      width: '560px',
      modal: true,
      dismissableMask: true,
      styleClass: 'schedule-modal-dialog',
      data: sch,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getSchedules();
        }
      });
    }
  }

  onDeleteSchedule(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this schedule period?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.scheduleService.deleteSchedule(id).subscribe({
          next: () => {
            this.getSchedules();
          },
          error: (error) => {
            console.error('Error deleting schedule:', error);
          },
        });
      },
    });
  }

  getDayLabel(day?: string): string {
    if (!day) return '';
    return day[0] + day.slice(1).toLowerCase();
  }
}
