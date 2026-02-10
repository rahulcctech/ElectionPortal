import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, SignupRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  
  currentUser = signal<AuthResponse | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUser.set(response);
      })
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, request).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUser.set(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.userType === 'ADMIN';
  }

  isVoter(): boolean {
    const user = this.currentUser();
    return user?.userType === 'VOTER';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const user = this.currentUser();
    return user?.userId || null;
  }

  getUserName(): string {
    const user = this.currentUser();
    return user?.name || '';
  }
}



