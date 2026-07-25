import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface Class {
  Id?: number;
  Name: string;
  Section: string;
  RoomNumber?: string;
  Capacity?: number;
  ClassTeacherId?: number;
  ClassTeacher?: { Id: number; Name: string; Email?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getClasses(): Observable<AppQuery<Class[]>> {
    return this.http.get<AppQuery<Class[]>>(`${this.baseUrl}/class/get`);
  }

  getClassById(id: number): Observable<AppQuery<Class>> {
    return this.http.get<AppQuery<Class>>(`${this.baseUrl}/class/getById/${id}`);
  }

  addClass(cls: Class): Observable<AppQuery<Class>> {
    return this.http.post<AppQuery<Class>>(`${this.baseUrl}/class/add`, cls);
  }

  updateClass(cls: Class): Observable<AppQuery<Class>> {
    return this.http.put<AppQuery<Class>>(`${this.baseUrl}/class/update`, cls);
  }

  deleteClass(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/class/delete/${id}`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }
}
