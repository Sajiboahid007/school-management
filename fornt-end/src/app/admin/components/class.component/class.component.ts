import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Class, ClassService } from '../../../shared/services/class-service';
import { ClassInsertUpdateComponent } from './class-insert-update/class-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-class',
  standalone: false,
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
})
export class ClassComponent implements OnInit {
  classes: Class[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly classService: ClassService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.isLoading = true;
    this.classService.getClasses().subscribe({
      next: (response) => {
        this.classes = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.classes = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddClass(): void {
    const dialogRef = this.dialog.open(ClassInsertUpdateComponent, {
      header: 'Create New Class',
      width: '520px',
      modal: true,
      dismissableMask: true,
      styleClass: 'class-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getClasses();
        }
      });
    }
  }

  onEditClass(id?: number): void {
    if (!id) return;

    this.classService.getClassById(id).subscribe({
      next: (res) => {
        const cls = res?.data;

        const dialogRef = this.dialog.open(ClassInsertUpdateComponent, {
          header: 'Edit Class Details',
          width: '520px',
          modal: true,
          dismissableMask: true,
          styleClass: 'class-modal-dialog',
          data: cls,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getClasses();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching class details:', error);
      },
    });
  }

  onDeleteClass(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this class? This will affect linked student profiles and academic schedules.',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.classService.deleteClass(id).subscribe({
          next: () => {
            this.getClasses();
          },
          error: (error) => {
            console.error('Error deleting class:', error);
          },
        });
      },
    });
  }
}
