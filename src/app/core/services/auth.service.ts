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
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private storage: Storage;

  constructor() {
    this.storage = this.resolveStorage();
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.storage.getItem(this.TOKEN_KEY);
    const userJson = this.storage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
      } catch {
        this.clearStoredSession();
      }
    } else {
      this.clearStoredSession();
    }
  }

  login(username: string, _password: string): Observable<AuthResponse> {
    // Simulación de login - en producción aquí harías una petición HTTP real
    const mockUser: User = {
      id: 1,
      username: username,
      email: `${username}@example.com`,
      name: 'Usuario Demo',
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };

    return of(mockResponse).pipe(
      delay(1000), // Simular delay de red
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    this.clearStoredSession();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.storage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  private setSession(authResult: AuthResponse): void {
    this.storage.setItem(this.TOKEN_KEY, authResult.token);
    this.storage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  getToken(): string | null {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  private resolveStorage(): Storage {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage;
    }
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    } as Storage;
  }

  private clearStoredSession(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
  }
}
