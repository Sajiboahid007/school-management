import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Exam {
  Id?: number;
  Title: string;
  Term: string;
  AcademicYear: string;
  StartDate: string;
  EndDate: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface ExamResult {
  Id?: number;
  ExamId: number;
  StudentId: number;
  SubjectId: number;
  RecordedByTeacherId?: number;
  MarksObtained: number;
  TotalMarks: number;
  Grade?: string;
  Remarks?: string;
  Exam?: Exam;
  Student?: { Id: number; Name: string; Email?: string };
  Subject?: { Id: number; Name: string; Code?: string };
  RecordedByTeacher?: { Id: number; Name: string; Email?: string };
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  // Exam CRUD
  getExams(): Observable<AppQuery<Exam[]>> {
    return this.http.get<AppQuery<Exam[]>>(`${this.baseUrl}/exam/get`);
  }

  getExamById(id: number): Observable<AppQuery<Exam>> {
    return this.http.get<AppQuery<Exam>>(`${this.baseUrl}/exam/getById/${id}`);
  }

  addExam(exam: Exam): Observable<AppQuery<Exam>> {
    return this.http.post<AppQuery<Exam>>(`${this.baseUrl}/exam/add`, exam);
  }

  updateExam(exam: Exam): Observable<AppQuery<Exam>> {
    return this.http.put<AppQuery<Exam>>(`${this.baseUrl}/exam/update`, exam);
  }

  deleteExam(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/exam/delete/${id}`);
  }

  // Exam Result CRUD
  getExamResults(): Observable<AppQuery<ExamResult[]>> {
    return this.http.get<AppQuery<ExamResult[]>>(`${this.baseUrl}/examsResult/get`);
  }

  getExamResultById(id: number): Observable<AppQuery<ExamResult>> {
    return this.http.get<AppQuery<ExamResult>>(`${this.baseUrl}/examsResult/getById/${id}`);
  }

  addExamResult(res: ExamResult): Observable<AppQuery<ExamResult>> {
    return this.http.post<AppQuery<ExamResult>>(`${this.baseUrl}/examsResult/add`, res);
  }

  updateExamResult(res: ExamResult): Observable<AppQuery<ExamResult>> {
    return this.http.put<AppQuery<ExamResult>>(`${this.baseUrl}/examsResult/update`, res);
  }

  deleteExamResult(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/examsResult/delete/${id}`);
  }

  // Helpers
  getStudents(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/student/get`);
  }

  getSubjects(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/subject/get`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }

  getClasses(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/class/get`);
  }
}
