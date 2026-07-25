import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolConstant } from '../components/schoolConstant';
import { Observable } from 'rxjs';
import { AppQuery } from './AppQuery';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  login(user: any): Observable<AppQuery<any>> {
    return this.http.post<AppQuery<any>>(`${this.baseUrl}/login`, user);
  }

  register(user: any): Observable<AppQuery<any>> {
    return this.http.post<AppQuery<any>>(`${this.baseUrl}/user/add`, user);
  }
}
