import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = '/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          const user: User = {
            username: response.username,
            email: response.email,
            role: response.role,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.token) {
          const user: User = {
            username: response.username,
            email: response.email,
            role: response.role,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expiredPasswordUsername');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    if (!user || !user.token) {
      return false;
    }

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const isExpired = Date.now() >= expirationTime;

      if (isExpired) {
        // Clear expired token silently (don't navigate to avoid loops)
        localStorage.removeItem('currentUser');
        localStorage.removeItem('expiredPasswordUsername');
        this.currentUserSubject.next(null);
        return false;
      }

      return true;
    } catch (e) {
      // Invalid token format, clear it silently
      localStorage.removeItem('currentUser');
      localStorage.removeItem('expiredPasswordUsername');
      this.currentUserSubject.next(null);
      return false;
    }
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }

  getRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  isUser(): boolean {
    return this.currentUserValue?.role === 'USER';
  }

  changePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const request = {
      username,
      currentPassword,
      newPassword,
      confirmPassword
    };
    return this.http.post<any>(`${this.apiUrl}/change-password`, request);
  }

  checkPasswordExpiry(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/password-expiry-status?username=${username}`);
  }
}
