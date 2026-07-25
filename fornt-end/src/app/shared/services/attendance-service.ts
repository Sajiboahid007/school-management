import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Attendance {
  Id?: number;
  Date: string;
  Status: string;
  StudentId: number;
  ClassId: number;
  SubjectId?: number;
  RecordedByTeacherId: number;
  Student?: { Id: number; Name: string; Email?: string };
  Class?: { Id: number; Name: string; Section?: string };
  Subject?: { Id: number; Name: string; Code?: string };
  RecordedByTeacher?: { Id: number; Name: string; Email?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getAttendances(): Observable<AppQuery<Attendance[]>> {
    return this.http.get<AppQuery<Attendance[]>>(`${this.baseUrl}/attendance/get`);
  }

  getAttendanceById(id: number): Observable<AppQuery<Attendance>> {
    return this.http.get<AppQuery<Attendance>>(`${this.baseUrl}/attendance/getById/${id}`);
  }

  addAttendance(attendance: Attendance): Observable<AppQuery<Attendance>> {
    return this.http.post<AppQuery<Attendance>>(`${this.baseUrl}/attendance/add`, attendance);
  }

  addBulkAttendance(records: Attendance[]): Observable<AppQuery<Attendance[]>> {
    return this.http.post<AppQuery<Attendance[]>>(`${this.baseUrl}/attendance/add`, records);
  }

  updateAttendance(attendance: Attendance): Observable<AppQuery<Attendance>> {
    return this.http.put<AppQuery<Attendance>>(`${this.baseUrl}/attendance/update`, attendance);
  }

  deleteAttendance(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/attendance/delete/${id}`);
  }

  getStudents(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/student/get`);
  }

  getClasses(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/class/get`);
  }

  getSubjects(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/subject/get`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }
}
