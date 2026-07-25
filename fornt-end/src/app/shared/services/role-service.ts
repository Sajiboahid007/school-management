import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';
import { Observable } from 'rxjs';

export interface Role {
  Id?: number;
  Name: string;
  Description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient,) { }

  getRoles(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/role/get`);
  }

  addRole(role: any): Observable<AppQuery<any>> {
    return this.http.post<AppQuery<any>>(`${this.baseUrl}/role/add`, role);
  }

  updateRole(role: Role): Observable<AppQuery<any>> {
    return this.http.put<AppQuery<any>>(`${this.baseUrl}/role/update`, role);
  }

  deleteRole(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/role/delete/${id}`);
  }

  getRoleById(id: number): Observable<AppQuery<any>> {
    return this.http.get<AppQuery<any>>(`${this.baseUrl}/role/getById/${id}`);
  }
}
