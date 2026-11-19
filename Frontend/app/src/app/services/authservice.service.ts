import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'member' | 'admin';
  goal: string;
  experience: string;
  height: number;
  currentWeight: number;
  targetWeight: number;
  bmi: number;
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000/api/auth';

  currentUser = signal<UserProfile | null>(this.getStoredUser());

  signup(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, payload);
  }

  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-email`, { email, otp }).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
        }
      })
    );
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/resend-otp`, { email });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
        }
      })
    );
  }

  forgotPassword(payload: { email: string; otp?: string; newPassword?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, payload);
  }

  logout(): void {
    localStorage.removeItem('growwgym_token');
    localStorage.removeItem('growwgym_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('growwgym_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setSession(token: string, user: UserProfile): void {
    localStorage.setItem('growwgym_token', token);
    localStorage.setItem('growwgym_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): UserProfile | null {
    const raw = localStorage.getItem('growwgym_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}