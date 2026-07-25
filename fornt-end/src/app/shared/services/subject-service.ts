import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Subject {
  Id?: number;
  Name: string;
  Code: string;
  DepartmentId?: number;
  TeacherId?: number;
  ClassId?: number;
  Department?: { Id: number; Name: string; Code?: string };
  Teacher?: { Id: number; Name: string; Email?: string };
  Class?: { Id: number; Name: string; Section?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getSubjects(): Observable<AppQuery<Subject[]>> {
    return this.http.get<AppQuery<Subject[]>>(`${this.baseUrl}/subject/get`);
  }

  getSubjectById(id: number): Observable<AppQuery<Subject>> {
    return this.http.get<AppQuery<Subject>>(`${this.baseUrl}/subject/getById/${id}`);
  }

  addSubject(subject: Subject): Observable<AppQuery<Subject>> {
    return this.http.post<AppQuery<Subject>>(`${this.baseUrl}/subject/add`, subject);
  }

  updateSubject(subject: Subject): Observable<AppQuery<Subject>> {
    return this.http.put<AppQuery<Subject>>(`${this.baseUrl}/subject/update`, subject);
  }

  deleteSubject(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/subject/delete/${id}`);
  }

  getDepartments(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/department/get`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }

  getClasses(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/class/get`);
  }
}
