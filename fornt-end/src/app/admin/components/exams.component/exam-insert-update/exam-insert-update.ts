import { Component, OnInit, Optional } from '@angular/core';
import { Exam, ExamResult, ExamService } from '../../../../shared/services/exam-service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-exam-insert-update',
  standalone: false,
  templateUrl: './exam-insert-update.html',
  styleUrl: './exam-insert-update.scss'
})
export class ExamInsertUpdateComponent implements OnInit {
  type: 'exam' | 'result' = 'exam';
  isEdit: boolean = false;

  // Form fields for Exam
  examData: Exam = {
    Title: '',
    Term: '',
    AcademicYear: '',
    StartDate: '',
    EndDate: ''
  };

  // Form fields for ExamResult
  resultData: ExamResult = {
    ExamId: 0,
    StudentId: 0,
    SubjectId: 0,
    RecordedByTeacherId: undefined,
    MarksObtained: 0,
    TotalMarks: 100,
    Grade: '',
    Remarks: ''
  };

  // Dropdown lists
  exams: Exam[] = [];
  students: any[] = [];
  subjects: any[] = [];
  teachers: any[] = [];

  examOptions: { label: string; value: any }[] = [];
  studentOptions: { label: string; value: any }[] = [];
  subjectOptions: { label: string; value: any }[] = [];
  teacherOptions: { label: string; value: any }[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly examService: ExamService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config?.data) {
      this.type = this.config.data.type || 'exam';
      this.isEdit = !!this.config.data.data;

      if (this.type === 'exam') {
        if (this.isEdit) {
          const ex: Exam = this.config.data.data;
          this.examData = {
            Id: ex.Id,
            Title: ex.Title || '',
            Term: ex.Term || '',
            AcademicYear: ex.AcademicYear || '',
            StartDate: ex.StartDate ? new Date(ex.StartDate).toISOString().split('T')[0] : '',
            EndDate: ex.EndDate ? new Date(ex.EndDate).toISOString().split('T')[0] : ''
          };
        }
      } else {
        this.loadDropdowns();
        if (this.isEdit) {
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
    } else {
      this.type = 'exam';
      this.isEdit = false;
    }
  }

  loadDropdowns(): void {
    this.examService.getExams().subscribe({
      next: (res) => {
        this.exams = res.data || [];
        this.examOptions = this.exams.map((e) => ({
          label: `${e.Title} (${e.Term})`,
          value: e.Id
        }));
      },
      error: (err) => console.error('Error fetching exams:', err)
    });

    this.examService.getStudents().subscribe({
      next: (res) => {
        this.students = res.data || [];
        this.studentOptions = this.students.map((s) => ({
          label: s.Name,
          value: s.Id
        }));
      },
      error: (err) => console.error('Error fetching students:', err)
    });

    this.examService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res.data || [];
        this.subjectOptions = this.subjects.map((sb) => ({
          label: `${sb.Name} (${sb.Code})`,
          value: sb.Id
        }));
      },
      error: (err) => console.error('Error fetching subjects:', err)
    });

    this.examService.getTeachers().subscribe({
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

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.type === 'exam') {
      if (!this.examData.Title || !this.examData.Term || !this.examData.AcademicYear) {
        this.errorMessage = 'Title, Term, and Academic Year are required.';
        this.isLoading = false;
        return;
      }

      if (this.isEdit) {
        const payload = {
          id: Number(this.examData.Id),
          Id: Number(this.examData.Id),
          Title: this.examData.Title,
          Term: this.examData.Term,
          AcademicYear: this.examData.AcademicYear,
          StartDate: this.examData.StartDate,
          EndDate: this.examData.EndDate
        };
        this.examService.updateExam(payload).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.successMessage = res.message || 'Exam updated successfully!';
            setTimeout(() => this.ref?.close(true), 300);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.error || 'Failed to update exam.';
          }
        });
      } else {
        this.examService.addExam(this.examData).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.successMessage = res.message || 'Exam created successfully!';
            setTimeout(() => this.ref?.close(true), 300);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.error || 'Failed to create exam.';
          }
        });
      }
    } else {
      // result
      if (!this.resultData.ExamId || !this.resultData.StudentId || !this.resultData.SubjectId) {
        this.errorMessage = 'Exam, Student, and Subject are required.';
        this.isLoading = false;
        return;
      }

      if (this.isEdit) {
        const payload = {
          id: Number(this.resultData.Id),
          Id: Number(this.resultData.Id),
          ExamId: Number(this.resultData.ExamId),
          StudentId: Number(this.resultData.StudentId),
          SubjectId: Number(this.resultData.SubjectId),
          RecordedByTeacherId: this.resultData.RecordedByTeacherId ? Number(this.resultData.RecordedByTeacherId) : undefined,
          MarksObtained: Number(this.resultData.MarksObtained),
          TotalMarks: Number(this.resultData.TotalMarks || 100),
          Grade: this.resultData.Grade,
          Remarks: this.resultData.Remarks
        };
        this.examService.updateExamResult(payload).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.successMessage = res.message || 'Exam result updated successfully!';
            setTimeout(() => this.ref?.close(true), 300);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.error || 'Failed to update exam result.';
          }
        });
      } else {
        const payload = {
          ExamId: Number(this.resultData.ExamId),
          StudentId: Number(this.resultData.StudentId),
          SubjectId: Number(this.resultData.SubjectId),
          RecordedByTeacherId: this.resultData.RecordedByTeacherId ? Number(this.resultData.RecordedByTeacherId) : undefined,
          MarksObtained: Number(this.resultData.MarksObtained),
          TotalMarks: Number(this.resultData.TotalMarks || 100),
          Grade: this.resultData.Grade,
          Remarks: this.resultData.Remarks
        };
        this.examService.addExamResult(payload).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.successMessage = res.message || 'Exam result recorded successfully!';
            setTimeout(() => this.ref?.close(true), 300);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err?.error?.error || 'Failed to record exam result.';
          }
        });
      }
    }
  }

  onCancel(): void {
    this.ref?.close(false);
  }
}
