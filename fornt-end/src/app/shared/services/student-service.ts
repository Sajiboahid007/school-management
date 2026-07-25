import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Student {
  Id?: number;
  RollNumber?: string;
  Name: string;
  Email: string;
  Password?: string;
  Phone?: string;
  Address?: string;
  Gender?: string;
  DateOfBirth?: string;
  ClassId?: number;
  DepartmentId?: number;
  RoleId?: number;
  Class?: { Id: number; Name: string; Section?: string };
  Department?: { Id: number; Name: string; Code?: string };
  Role?: { Id: number; Name: string; Description?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getStudents(): Observable<AppQuery<Student[]>> {
    return this.http.get<AppQuery<Student[]>>(`${this.baseUrl}/student/get`);
  }

  getStudentById(id: number): Observable<AppQuery<Student>> {
    return this.http.get<AppQuery<Student>>(`${this.baseUrl}/student/getById/${id}`);
  }

  addStudent(student: Student): Observable<AppQuery<Student>> {
    return this.http.post<AppQuery<Student>>(`${this.baseUrl}/student/add`, student);
  }

  updateStudent(student: Student): Observable<AppQuery<Student>> {
    return this.http.put<AppQuery<Student>>(`${this.baseUrl}/student/update`, student);
  }

  deleteStudent(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/student/delete/${id}`);
  }

  getClasses(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/class/get`);
  }

  getDepartments(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/department/get`);
  }

  getRoles(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/role/get`);
  }
}
