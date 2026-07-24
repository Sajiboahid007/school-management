import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3200/api';
    constructor(private http: HttpClient) { }
    login(credentials: { Email: string; Password: string }) {
        return this.http.post(`${this.apiUrl}/login`, credentials);
    }
}