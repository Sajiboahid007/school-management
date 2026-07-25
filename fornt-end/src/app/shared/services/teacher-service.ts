import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Teacher {
  Id?: number;
  Name: string;
  Email: string;
  Password?: string;
  Phone?: string;
  Address?: string;
  Gender?: string;
  Qualification?: string;
  JoiningDate?: string;
  DepartmentId?: number;
  RoleId?: number;
  Department?: { Id: number; Name: string; Code?: string };
  Role?: { Id: number; Name: string; Description?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getTeachers(): Observable<AppQuery<Teacher[]>> {
    return this.http.get<AppQuery<Teacher[]>>(`${this.baseUrl}/teacher/get`);
  }

  getTeacherById(id: number): Observable<AppQuery<Teacher>> {
    return this.http.get<AppQuery<Teacher>>(`${this.baseUrl}/teacher/getById/${id}`);
  }

  addTeacher(teacher: Teacher): Observable<AppQuery<Teacher>> {
    return this.http.post<AppQuery<Teacher>>(`${this.baseUrl}/teacher/add`, teacher);
  }

  updateTeacher(teacher: Teacher): Observable<AppQuery<Teacher>> {
    return this.http.put<AppQuery<Teacher>>(`${this.baseUrl}/teacher/update`, teacher);
  }

  deleteTeacher(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/teacher/delete/${id}`);
  }

  getDepartments(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/department/get`);
  }

  getRoles(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/role/get`);
  }
}
