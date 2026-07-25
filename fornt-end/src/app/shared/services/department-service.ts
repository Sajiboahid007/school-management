import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Department {
  Id?: number;
  Name: string;
  Code: string;
  Description?: string;
  HeadId?: number;
  HeadTeacher?: { Id: number; Name: string; Email?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getDepartments(): Observable<AppQuery<Department[]>> {
    return this.http.get<AppQuery<Department[]>>(`${this.baseUrl}/department/get`);
  }

  getDepartmentById(id: number): Observable<AppQuery<Department>> {
    return this.http.get<AppQuery<Department>>(`${this.baseUrl}/department/getById/${id}`);
  }

  addDepartment(department: Department): Observable<AppQuery<Department>> {
    return this.http.post<AppQuery<Department>>(`${this.baseUrl}/department/add`, department);
  }

  updateDepartment(department: Department): Observable<AppQuery<Department>> {
    return this.http.put<AppQuery<Department>>(`${this.baseUrl}/department/update`, department);
  }

  deleteDepartment(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/department/delete/${id}`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }
}
