import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface User {
  Id?: number;
  Name: string;
  Email: string;
  Password?: string;
  Phone?: string;
  RoleId?: number;
  Role?: { Id: number; Name: string; Description?: string };
  CreatedAt?: string;
  UpdatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient, private readonly fb: FormBuilder,) { }

  getUsers(): Observable<AppQuery<User[]>> {
    return this.http.get<AppQuery<User[]>>(`${this.baseUrl}/user/get`);
  }

  getUserById(id: number): Observable<AppQuery<User>> {
    return this.http.get<AppQuery<User>>(`${this.baseUrl}/user/getById/${id}`);
  }

  addUser(user: User): Observable<AppQuery<User>> {
    return this.http.post<AppQuery<User>>(`${this.baseUrl}/user/add`, user);
  }

  updateUser(user: User): Observable<AppQuery<User>> {
    return this.http.put<AppQuery<User>>(`${this.baseUrl}/user/update`, user);
  }

  deleteUser(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/user/delete/${id}`);
  }

  getRoles(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/role/get`);
  }

  createUserfrom(user: User): FormGroup {
    return this.fb.group({
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
      Phone: user.Phone,
      RoleId: user.RoleId
    })
  }
}
