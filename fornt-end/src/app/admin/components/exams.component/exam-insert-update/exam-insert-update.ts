import { ChangeDetectorRef, Component, OnInit, Optional } from '@angular/core';
import { Exam, ExamResult, ExamService } from '../../../../shared/services/exam-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface MarkRow {
  StudentId: number;
  RollNumber: string;
  Name: string;
  // SubjectId -> marks
  Marks: Record<number, { MarksObtained: number; TotalMarks: number; Grade: string; Enabled: boolean }>;
}

@Component({
  selector: 'app-exam-insert-update',
  standalone: false,
  templateUrl: './exam-insert-update.html',
  styleUrl: './exam-insert-update.scss'
})
export class ExamInsertUpdateComponent implements OnInit {
  type: 'exam' | 'result' = 'result';
  isEdit: boolean = false;

  // ─── Exam form ───
  examData: Exam = { Title: '', Term: '', AcademicYear: '', StartDate: '', EndDate: '' };

  // ─── Single result edit (edit mode only) ───
  resultData: ExamResult = {
    ExamId: 0, StudentId: 0, SubjectId: 0,
    MarksObtained: 0, TotalMarks: 100, Grade: '', Remarks: ''
  };

  // ─── Bulk marks entry ───
  classes: any[] = [];
  exams: Exam[] = [];
  allStudents: any[] = [];
  allSubjects: any[] = [];
  teachers: any[] = [];

  classOptions: { label: string; value: any }[] = [];
  examOptions: { label: string; value: any }[] = [];
  subjectOptions: { label: string; value: any }[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  selectedClassId?: number;
  selectedExamId?: number;
  selectedTeacherId?: number;
  totalMarksDefault: number = 100;

  classStudents: any[] = [];       // students of selected class
  classSubjects: any[] = [];       // subjects of selected class
  markRows: MarkRow[] = [];        // student rows

  isLoadingData = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly examService: ExamService,
    private readonly cdr: ChangeDetectorRef,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config?.data) {
      this.type = this.config.data.type || 'result';
      this.isEdit = !!this.config.data.data;

      if (this.type === 'exam' && this.isEdit) {
        const ex: Exam = this.config.data.data;
        this.examData = {
          Id: ex.Id,
          Title: ex.Title || '',
          Term: ex.Term || '',
          AcademicYear: ex.AcademicYear || '',
          StartDate: ex.StartDate ? new Date(ex.StartDate).toISOString().split('T')[0] : '',
          EndDate: ex.EndDate ? new Date(ex.EndDate).toISOString().split('T')[0] : ''
        };
      } else if (this.type === 'result' && this.isEdit) {
        const res: ExamResult = this.config.data.data;
        this.resultData = {
          Id: res.Id,
          ExamId: Number(res.ExamId),
          StudentId: Number(res.StudentId),
          SubjectId: Number(res.SubjectId),
          RecordedByTeacherId: res.RecordedByTeacherId ? Number(res.RecordedByTeacherId) : undefined,
          MarksObtained: Number(res.MarksObtained),
          TotalMarks: Number(res.TotalMarks || 100),
          Grade: res.Grade || '',
          Remarks: res.Remarks || ''
        };
      }
    }

    if (this.type === 'result' && !this.isEdit) {
      this.loadDropdowns();
    } else if (this.type === 'result' && this.isEdit) {
      this.loadSingleEditDropdowns();
    }
  }

  loadDropdowns(): void {
    this.isLoadingData = true;
    let loaded = 0;
    const check = () => { if (++loaded === 4) { this.isLoadingData = false; this.cdr.markForCheck(); } };

    this.examService.getClasses().subscribe({
      next: (r) => {
        this.classes = r.data || [];
        this.classOptions = this.classes.map(c => ({ label: `${c.Name} (${c.Section})`, value: c.Id }));
        if (this.classOptions.length > 0) { this.selectedClassId = this.classOptions[0].value; }
        check();
        this.onClassChange();
      },
      error: () => check()
    });

    this.examService.getExams().subscribe({
      next: (r) => {
        this.exams = r.data || [];
        this.examOptions = this.exams.map(e => ({ label: `${e.Title} (${e.Term})`, value: e.Id }));
        if (this.examOptions.length > 0) this.selectedExamId = this.examOptions[0].value;
        check();
      },
      error: () => check()
    });

    this.examService.getStudents().subscribe({
      next: (r) => { this.allStudents = r.data || []; check(); this.onClassChange(); },
      error: () => check()
    });

    this.examService.getSubjects().subscribe({
      next: (r) => { this.allSubjects = r.data || []; check(); this.onClassChange(); },
      error: () => check()
    });

    this.examService.getTeachers().subscribe({
      next: (r) => {
        this.teachers = r.data || [];
        this.teacherOptions = this.teachers.map(t => ({ label: t.Name, value: t.Id }));
      },
      error: () => {}
    });
  }

  loadSingleEditDropdowns(): void {
    this.examService.getExams().subscribe({ next: (r) => { this.exams = r.data || []; this.examOptions = this.exams.map(e => ({ label: `${e.Title} (${e.Term})`, value: e.Id })); }, error: () => {} });
    this.examService.getSubjects().subscribe({ next: (r) => { this.allSubjects = r.data || []; this.subjectOptions = this.allSubjects.map(s => ({ label: `${s.Name} (${s.Code})`, value: s.Id })); }, error: () => {} });
    this.examService.getTeachers().subscribe({ next: (r) => { this.teachers = r.data || []; this.teacherOptions = this.teachers.map(t => ({ label: t.Name, value: t.Id })); }, error: () => {} });
  }

  onClassChange(): void {
    if (!this.selectedClassId || !this.allStudents.length) return;

    this.classStudents = this.allStudents.filter(s => Number(s.ClassId) === Number(this.selectedClassId));
    this.classSubjects = this.allSubjects.filter(s =>
      !s.ClassId || Number(s.ClassId) === Number(this.selectedClassId)
    );
    if (!this.classSubjects.length) this.classSubjects = this.allSubjects;

    this.buildMarkRows();
    this.cdr.markForCheck();
  }

  buildMarkRows(): void {
    this.markRows = this.classStudents.map(s => {
      const marks: Record<number, { MarksObtained: number; TotalMarks: number; Grade: string; Enabled: boolean }> = {};
      this.classSubjects.forEach(sub => {
        marks[sub.Id] = { MarksObtained: 0, TotalMarks: this.totalMarksDefault, Grade: '', Enabled: true };
      });
      return {
        StudentId: s.Id,
        RollNumber: s.RollNumber || 'N/A',
        Name: s.Name,
        Marks: marks
      };
    });
  }

  onTotalMarksChange(): void {
    this.markRows.forEach(row => {
      this.classSubjects.forEach(sub => {
        if (row.Marks[sub.Id]) row.Marks[sub.Id].TotalMarks = Number(this.totalMarksDefault);
      });
    });
  }

  autoGrade(marks: number, total: number): string {
    const pct = total > 0 ? (marks / total) * 100 : 0;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  }

  onMarksInput(row: MarkRow, subId: number): void {
    const m = row.Marks[subId];
    m.Grade = this.autoGrade(m.MarksObtained, m.TotalMarks);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.type === 'exam') {
      this.saveExam();
      return;
    }

    if (this.isEdit) {
      this.saveSingleResult();
      return;
    }

    // Bulk save
    if (!this.selectedExamId) {
      this.errorMessage = 'Please select an exam.';
      this.isLoading = false;
      return;
    }

    const payload: ExamResult[] = [];
    this.markRows.forEach(row => {
      this.classSubjects.forEach(sub => {
        const m = row.Marks[sub.Id];
        if (m && m.Enabled) {
          payload.push({
            ExamId: Number(this.selectedExamId),
            StudentId: Number(row.StudentId),
            SubjectId: Number(sub.Id),
            RecordedByTeacherId: this.selectedTeacherId ? Number(this.selectedTeacherId) : undefined,
            MarksObtained: Number(m.MarksObtained),
            TotalMarks: Number(m.TotalMarks),
            Grade: m.Grade || this.autoGrade(m.MarksObtained, m.TotalMarks),
          });
        }
      });
    });

    if (payload.length === 0) {
      this.errorMessage = 'No marks to save.';
      this.isLoading = false;
      return;
    }

    let saved = 0;
    let failed = 0;
    const saveNext = (index: number): void => {
      if (index >= payload.length) {
        this.isLoading = false;
        if (failed === 0) {
          this.successMessage = `${saved} mark records saved successfully!`;
          setTimeout(() => this.ref?.close(true), 600);
        } else {
          this.errorMessage = `${saved} saved, ${failed} failed. Check console.`;
        }
        this.cdr.markForCheck();
        return;
      }
      this.examService.addExamResult(payload[index]).subscribe({
        next: () => { saved++; saveNext(index + 1); },
        error: (err) => { failed++; console.error('Failed to save result:', err); saveNext(index + 1); }
      });
    };
    saveNext(0);
  }

  saveExam(): void {
    if (!this.examData.Title || !this.examData.Term || !this.examData.AcademicYear) {
      this.errorMessage = 'Title, Term, and Academic Year are required.';
      this.isLoading = false;
      return;
    }
    const obs$ = this.isEdit
      ? this.examService.updateExam({ ...this.examData, id: this.examData.Id, Id: this.examData.Id } as any)
      : this.examService.addExam(this.examData);
    obs$.subscribe({
      next: (r) => { this.isLoading = false; this.successMessage = r.message || 'Saved!'; setTimeout(() => this.ref?.close(true), 300); },
      error: (err) => { this.isLoading = false; this.errorMessage = err?.error?.error || 'Failed to save exam.'; }
    });
  }

  saveSingleResult(): void {
    const payload = {
      id: Number(this.resultData.Id), Id: Number(this.resultData.Id),
      ExamId: Number(this.resultData.ExamId),
      StudentId: Number(this.resultData.StudentId),
      SubjectId: Number(this.resultData.SubjectId),
      RecordedByTeacherId: this.resultData.RecordedByTeacherId || undefined,
      MarksObtained: Number(this.resultData.MarksObtained),
      TotalMarks: Number(this.resultData.TotalMarks || 100),
      Grade: this.resultData.Grade,
      Remarks: this.resultData.Remarks
    };
    this.examService.updateExamResult(payload).subscribe({
      next: (r) => { this.isLoading = false; this.successMessage = r.message || 'Updated!'; setTimeout(() => this.ref?.close(true), 300); },
      error: (err) => { this.isLoading = false; this.errorMessage = err?.error?.error || 'Failed to update.'; }
    });
  }

  onCancel(): void { this.ref?.close(false); }
}
