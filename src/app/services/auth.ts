import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient); // Yeni Angular 18+ yöntemiyle inject
  private apiUrl = 'https://angular-net-backend.onrender.com/api/auth';

  login(model: any) {
    return this.http.post(`${this.apiUrl}/login`, model);
  }

  register(model: any) {
    return this.http.post(`${this.apiUrl}/register`, model);
  }
}