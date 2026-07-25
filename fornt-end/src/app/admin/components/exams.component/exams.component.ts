import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Exam, ExamResult, ExamService } from '../../../shared/services/exam-service';
import { ExamInsertUpdateComponent } from './exam-insert-update/exam-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-exams',
  standalone: false,
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss',
})
export class ExamsComponent implements OnInit {
  activeTab: 'exams' | 'results' = 'exams';

  exams: Exam[] = [];
  results: ExamResult[] = [];

  isLoadingExams: boolean = false;
  isLoadingResults: boolean = false;

  constructor(
    private readonly examService: ExamService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getExams();
    this.getResults();
  }

  getExams(): void {
    this.isLoadingExams = true;
    this.examService.getExams().subscribe({
      next: (response) => {
        this.exams = response.data || [];
        this.isLoadingExams = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching exams:', error);
        this.exams = [];
        this.isLoadingExams = false;
        this.cdr.markForCheck();
      },
    });
  }

  getResults(): void {
    this.isLoadingResults = true;
    this.examService.getExamResults().subscribe({
      next: (response) => {
        this.results = response.data || [];
        this.isLoadingResults = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching results:', error);
        this.results = [];
        this.isLoadingResults = false;
        this.cdr.markForCheck();
      },
    });
  }

  switchTab(tab: 'exams' | 'results'): void {
    this.activeTab = tab;
  }

  // Exam Actions
  onAddExam(): void {
    const dialogRef = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Create Academic Exam',
      width: '520px',
      modal: true,
      dismissableMask: true,
      styleClass: 'exam-modal-dialog',
      data: { type: 'exam', data: null },
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getExams();
        }
      });
    }
  }

  onEditExam(ex: Exam): void {
    const dialogRef = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Edit Exam Details',
      width: '520px',
      modal: true,
      dismissableMask: true,
      styleClass: 'exam-modal-dialog',
      data: { type: 'exam', data: ex },
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getExams();
        }
      });
    }
  }

  onDeleteExam(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this exam? All student marks associated with this exam will be deleted.',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.examService.deleteExam(id).subscribe({
          next: () => {
            this.getExams();
            this.getResults(); // Reload results since cascade delete may happen
          },
          error: (error) => {
            console.error('Error deleting exam:', error);
          },
        });
      },
    });
  }

  // Result Actions
  onAddResult(): void {
    const dialogRef = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Record Student Marks',
      width: '560px',
      modal: true,
      dismissableMask: true,
      styleClass: 'exam-modal-dialog',
      data: { type: 'result', data: null },
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getResults();
        }
      });
    }
  }

  onEditResult(res: ExamResult): void {
    const dialogRef = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Edit Grade Marksheet',
      width: '560px',
      modal: true,
      dismissableMask: true,
      styleClass: 'exam-modal-dialog',
      data: { type: 'result', data: res },
    });

    if (dialogRef) {
      dialogRef.onClose.subscribe((result: any) => {
        if (result) {
          this.getResults();
        }
      });
    }
  }

  onDeleteResult(id?: number): void {
    if (!id) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this exam result record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.examService.deleteExamResult(id).subscribe({
          next: () => {
            this.getResults();
          },
          error: (error) => {
            console.error('Error deleting exam result:', error);
          },
        });
      },
    });
  }

  getGradeSeverity(grade?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (grade?.toUpperCase()) {
      case 'A+':
      case 'A':
      case 'A-': return 'success';
      case 'B+':
      case 'B':
      case 'B-': return 'info';
      case 'C+':
      case 'C': return 'warn';
      case 'D': return 'secondary';
      case 'F': return 'danger';
      default: return 'secondary';
    }
  }
}
