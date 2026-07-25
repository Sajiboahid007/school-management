import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface ClassSchedule {
  Id?: number;
  ClassId: number;
  SubjectId: number;
  TeacherId: number;
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  RoomNo?: string;
  Class?: { Id: number; Name: string; Section?: string };
  Subject?: { Id: number; Name: string; Code?: string };
  Teacher?: { Id: number; Name: string; Email?: string };
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getSchedules(): Observable<AppQuery<ClassSchedule[]>> {
    return this.http.get<AppQuery<ClassSchedule[]>>(`${this.baseUrl}/classSchedule/get`);
  }

  getScheduleById(id: number): Observable<AppQuery<ClassSchedule>> {
    return this.http.get<AppQuery<ClassSchedule>>(`${this.baseUrl}/classSchedule/getById/${id}`);
  }

  addSchedule(schedule: ClassSchedule): Observable<AppQuery<ClassSchedule>> {
    return this.http.post<AppQuery<ClassSchedule>>(`${this.baseUrl}/classSchedule/add`, schedule);
  }

  updateSchedule(schedule: ClassSchedule): Observable<AppQuery<ClassSchedule>> {
    return this.http.put<AppQuery<ClassSchedule>>(`${this.baseUrl}/classSchedule/update`, schedule);
  }

  deleteSchedule(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/classSchedule/delete/${id}`);
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
