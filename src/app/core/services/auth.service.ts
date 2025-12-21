import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  constructor() {
    this.loadStoredUser();
  }
  
  private loadStoredUser(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }
  
  login(username: string, password: string): Observable<AuthResponse> {
    // Simulación de login - en producción aquí harías una petición HTTP real
    const mockUser: User = {
      id: 1,
      username: username,
      email: `${username}@example.com`,
      name: 'Usuario Demo'
    };
    
    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now()
    };
    
    return of(mockResponse).pipe(
      delay(1000), // Simular delay de red
      tap(response => {
        this.setSession(response);
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
  
  private setSession(authResult: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}