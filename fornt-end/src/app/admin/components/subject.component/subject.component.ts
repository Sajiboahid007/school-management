import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject, SubjectService } from '../../../shared/services/subject-service';
import { SubjectInsertUpdateComponent } from './subject-insert-update/subject-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-subject',
  standalone: false,
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss',
})
export class SubjectComponent implements OnInit {
  subjects: Subject[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly subjectService: SubjectService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getSubjects();
  }

  getSubjects(): void {
    this.isLoading = true;
    this.subjectService.getSubjects().subscribe({
      next: (response) => {
        this.subjects = response.data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching subjects:', error);
        this.subjects = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onAddSubject(): void {
    const dialogRef = this.dialog.open(SubjectInsertUpdateComponent, {
      header: 'Add New Subject',
      width: '520px',
      modal: true,
      dismissableMask: true,
      styleClass: 'subject-modal-dialog',
      data: null,
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getSubjects();
        }
      });
    }
  }

  onEditSubject(id?: number): void {
    if (!id) return;

    this.subjectService.getSubjectById(id).subscribe({
      next: (res) => {
        const sub = res?.data;

        const dialogRef = this.dialog.open(SubjectInsertUpdateComponent, {
          header: 'Edit Subject Details',
          width: '520px',
          modal: true,
          dismissableMask: true,
          styleClass: 'subject-modal-dialog',
          data: sub,
        });

        if (dialogRef) {
          dialogRef.onClose.subscribe((result: any) => {
            if (result) {
              this.getSubjects();
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching subject details:', error);
      },
    });
  }

  onDeleteSubject(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this subject? This will affect academic schedules and exam marks.',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.subjectService.deleteSubject(id).subscribe({
          next: () => {
            this.getSubjects();
          },
          error: (error) => {
            console.error('Error deleting subject:', error);
          },
        });
      },
    });
  }
}
