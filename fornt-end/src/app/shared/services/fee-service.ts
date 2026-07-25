import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SchoolConstant } from '../components/schoolConstant';
import { AppQuery } from './AppQuery';

export interface FeeManagement {
  Id?: number;
  InvoiceNo: string;
  StudentId: number;
  FeeType: string;
  Amount: number;
  PaidAmount: number;
  DueDate: string;
  PaymentDate?: string;
  PaymentMethod?: string;
  Status: string;
  Student?: { 
    Id: number; 
    Name: string; 
    RollNumber?: string; 
    Email?: string; 
    Class?: { Id: number; Name: string; Section?: string } 
  };
}

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private baseUrl = SchoolConstant.BaseUrl;

  constructor(private readonly http: HttpClient) { }

  getFees(): Observable<AppQuery<FeeManagement[]>> {
    return this.http.get<AppQuery<FeeManagement[]>>(`${this.baseUrl}/feeManagement/get`);
  }

  getFeeById(id: number): Observable<AppQuery<FeeManagement>> {
    return this.http.get<AppQuery<FeeManagement>>(`${this.baseUrl}/feeManagement/getById/${id}`);
  }

  addFee(fee: FeeManagement): Observable<AppQuery<FeeManagement>> {
    return this.http.post<AppQuery<FeeManagement>>(`${this.baseUrl}/feeManagement/add`, fee);
  }

  addBulkFees(fees: FeeManagement[]): Observable<AppQuery<FeeManagement[]>> {
    return this.http.post<AppQuery<FeeManagement[]>>(`${this.baseUrl}/feeManagement/add`, fees);
  }

  updateFee(fee: FeeManagement): Observable<AppQuery<FeeManagement>> {
    return this.http.put<AppQuery<FeeManagement>>(`${this.baseUrl}/feeManagement/update`, fee);
  }

  deleteFee(id: number): Observable<AppQuery<any>> {
    return this.http.delete<AppQuery<any>>(`${this.baseUrl}/feeManagement/delete/${id}`);
  }

  getClasses(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/class/get`);
  }

  getStudents(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/student/get`);
  }

  getTeachers(): Observable<AppQuery<any[]>> {
    return this.http.get<AppQuery<any[]>>(`${this.baseUrl}/teacher/get`);
  }
}
