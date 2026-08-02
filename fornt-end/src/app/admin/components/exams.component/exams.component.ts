import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Exam, ExamResult, ExamService } from '../../../shared/services/exam-service';
import { ExamInsertUpdateComponent } from './exam-insert-update/exam-insert-update';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

interface StudentMarkRow {
  StudentId: number;
  RollNumber: string;
  Name: string;
  // key = SubjectName, value = { marks, total, grade, resultId }
  Subjects: Record<string, { MarksObtained: number; TotalMarks: number; Grade: string; ResultId?: number }>;
  TotalObtained: number;
  TotalPossible: number;
  Percentage: number;
  OverallGrade: string;
}

@Component({
  selector: 'app-exams',
  standalone: false,
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss',
})
export class ExamsComponent implements OnInit {
  activeTab: 'marksheet' | 'exams' | 'results' = 'marksheet';

  // ── Marksheet tab ──
  classes: any[] = [];
  classOptions: { label: string; value: any }[] = [];
  exams: Exam[] = [];
  examOptions: { label: string; value: any }[] = [];
  results: ExamResult[] = [];
  students: any[] = [];
  subjects: any[] = [];

  selectedClassId?: number;
  selectedExamId?: number;

  marksheetRows: StudentMarkRow[] = [];
  subjectColumns: string[] = [];

  isLoadingClasses = false;
  isLoadingMarksheet = false;
  isLoadingExams = false;
  isLoadingResults = false;

  constructor(
    private readonly examService: ExamService,
    private readonly dialog: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoadingClasses = true;
    this.isLoadingExams = true;
    this.isLoadingResults = true;

    this.examService.getClasses().subscribe({
      next: (r) => {
        this.classes = r.data || [];
        this.classOptions = this.classes.map(c => ({ label: `${c.Name} (${c.Section})`, value: c.Id }));
        if (this.classOptions.length > 0) this.selectedClassId = this.classOptions[0].value;
        this.isLoadingClasses = false;
        this.buildMarksheet();
        this.cdr.markForCheck();
      },
      error: () => { this.isLoadingClasses = false; }
    });

    this.examService.getExams().subscribe({
      next: (r) => {
        this.exams = r.data || [];
        this.examOptions = this.exams.map(e => ({ label: `${e.Title} (${e.Term})`, value: e.Id }));
        if (this.examOptions.length > 0) this.selectedExamId = this.examOptions[0].value;
        this.isLoadingExams = false;
        this.buildMarksheet();
        this.cdr.markForCheck();
      },
      error: () => { this.isLoadingExams = false; }
    });

    this.examService.getStudents().subscribe({
      next: (r) => { this.students = r.data || []; this.buildMarksheet(); this.cdr.markForCheck(); },
      error: () => {}
    });

    this.examService.getSubjects().subscribe({
      next: (r) => { this.subjects = r.data || []; this.buildMarksheet(); this.cdr.markForCheck(); },
      error: () => {}
    });

    this.examService.getExamResults().subscribe({
      next: (r) => {
        this.results = r.data || [];
        this.isLoadingResults = false;
        this.buildMarksheet();
        this.cdr.markForCheck();
      },
      error: () => { this.isLoadingResults = false; }
    });
  }

  buildMarksheet(): void {
    if (!this.selectedClassId || !this.students.length || !this.results.length) {
      this.marksheetRows = [];
      this.subjectColumns = [];
      return;
    }

    const classStudents = this.students.filter(s => Number(s.ClassId) === Number(this.selectedClassId));

    // Filter results by class students and optionally by exam
    const filteredResults = this.results.filter(r => {
      const isInClass = classStudents.some(s => Number(s.Id) === Number(r.StudentId));
      const matchesExam = !this.selectedExamId || Number(r.ExamId) === Number(this.selectedExamId);
      return isInClass && matchesExam;
    });

    // Collect unique subject names from filtered results
    const subjectSet = new Set<string>();
    filteredResults.forEach(r => {
      const subName = r.Subject?.Name || `Sub-${r.SubjectId}`;
      subjectSet.add(subName);
    });
    this.subjectColumns = Array.from(subjectSet).sort();

    this.marksheetRows = classStudents.map(s => {
      const studentResults = filteredResults.filter(r => Number(r.StudentId) === Number(s.Id));
      const subjectsMap: Record<string, { MarksObtained: number; TotalMarks: number; Grade: string; ResultId?: number }> = {};

      this.subjectColumns.forEach(subName => {
        const result = studentResults.find(r => (r.Subject?.Name || `Sub-${r.SubjectId}`) === subName);
        subjectsMap[subName] = result
          ? { MarksObtained: result.MarksObtained, TotalMarks: result.TotalMarks, Grade: result.Grade || '—', ResultId: result.Id }
          : { MarksObtained: 0, TotalMarks: 100, Grade: '—' };
      });

      const totalObtained = studentResults.reduce((sum, r) => sum + Number(r.MarksObtained), 0);
      const totalPossible = studentResults.reduce((sum, r) => sum + Number(r.TotalMarks), 0);
      const pct = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

      return {
        StudentId: s.Id,
        RollNumber: s.RollNumber || 'N/A',
        Name: s.Name,
        Subjects: subjectsMap,
        TotalObtained: totalObtained,
        TotalPossible: totalPossible,
        Percentage: pct,
        OverallGrade: this.calcGrade(pct)
      };
    });

    this.isLoadingMarksheet = false;
    this.cdr.markForCheck();
  }

  calcGrade(pct: number): string {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  }

  onFilterChange(): void {
    this.isLoadingMarksheet = true;
    this.buildMarksheet();
  }

  switchTab(tab: 'marksheet' | 'exams' | 'results'): void {
    this.activeTab = tab;
  }

  // ── Exam CRUD ──
  onAddExam(): void {
    const ref = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Create Academic Exam', width: '520px', modal: true,
      dismissableMask: true, styleClass: 'exam-modal-dialog', data: { type: 'exam', data: null }
    });
    ref?.onClose.subscribe(r => { if (r) this.loadAll(); });
  }

  onEditExam(ex: Exam): void {
    const ref = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Edit Exam Details', width: '520px', modal: true,
      dismissableMask: true, styleClass: 'exam-modal-dialog', data: { type: 'exam', data: ex }
    });
    ref?.onClose.subscribe(r => { if (r) this.loadAll(); });
  }

  onDeleteExam(id?: number): void {
    if (!id) return;
    this.confirmationService.confirm({
      message: 'Delete this exam and all its results?', header: 'Confirm', icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.examService.deleteExam(id).subscribe({ next: () => this.loadAll() })
    });
  }

  // ── Result CRUD ──
  onAddResult(): void {
    const ref = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Enter Class Marks', width: '850px', modal: true,
      dismissableMask: true, styleClass: 'exam-modal-dialog', data: { type: 'result', data: null }
    });
    ref?.onClose.subscribe(r => { if (r) this.loadAll(); });
  }

  onEditResult(res: ExamResult): void {
    const ref = this.dialog.open(ExamInsertUpdateComponent, {
      header: 'Edit Marks', width: '560px', modal: true,
      dismissableMask: true, styleClass: 'exam-modal-dialog', data: { type: 'result', data: res }
    });
    ref?.onClose.subscribe(r => { if (r) this.loadAll(); });
  }

  onDeleteResult(id?: number): void {
    if (!id) return;
    this.confirmationService.confirm({
      message: 'Delete this exam result?', header: 'Confirm', icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.examService.deleteExamResult(id).subscribe({ next: () => this.loadAll() })
    });
  }

  getGradeSeverity(grade?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (grade?.toUpperCase()) {
      case 'A+': case 'A': case 'A-': return 'success';
      case 'B+': case 'B': case 'B-': return 'info';
      case 'C+': case 'C': return 'warn';
      case 'D': return 'secondary';
      case 'F': return 'danger';
      default: return 'secondary';
    }
  }
}
