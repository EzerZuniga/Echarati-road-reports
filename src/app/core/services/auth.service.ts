import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
  AuthTokens,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'echarati_access_token';
  private readonly REFRESH_KEY = 'echarati_refresh_token';
  private readonly USER_KEY = 'echarati_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
  get isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => this.persistSession(res)),
      catchError((err) => throwError(() => this.mapError(err)))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.persistSession(res)),
      catchError((err) => throwError(() => this.mapError(err)))
    );
  }

  loginWithGoogle(request: GoogleAuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/google`, request).pipe(
      tap((res) => this.persistSession(res)),
      catchError((err) => throwError(() => this.mapError(err)))
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = localStorage.getItem(this.REFRESH_KEY);
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((tokens) => {
        localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem(this.REFRESH_KEY, tokens.refreshToken);
      }),
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Session expired'));
      })
    );
  }

  logout(): void {
    // Notificar al servidor (fire-and-forget, no bloquea la navegación)
    const token = this.getAccessToken();
    if (token) {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({ error: () => {} });
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/profile`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.tokens.accessToken);
    if (res.tokens.refreshToken) localStorage.setItem(this.REFRESH_KEY, res.tokens.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

  private restoreSession(): void {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      if (raw && this.getAccessToken()) this.currentUserSubject.next(JSON.parse(raw) as User);
    } catch {
      this.logout();
    }
  }

  private mapError(
    err: HttpErrorResponse | { status: number; error?: { message?: string } }
  ): Error {
    // Extraer mensaje del backend si existe
    const backendMsg = (err as { error?: { message?: string } }).error?.message;

    if (err.status === 0) {
      return new Error('No se puede conectar al servidor. Verifica que el backend esté iniciado');
    }
    if (backendMsg) {
      return new Error(backendMsg);
    }
    if (err.status === 401) return new Error('Credenciales incorrectas');
    if (err.status === 403) return new Error('Acceso denegado');
    if (err.status === 409) return new Error('El email o DNI ya está registrado');
    if (err.status === 422) return new Error('Datos de registro inválidos');
    if (err.status >= 500) return new Error('Error interno del servidor');
    return new Error('Error de conexión. Intenta nuevamente');
  }
}
