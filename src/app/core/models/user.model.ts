export type UserRole = 'citizen' | 'admin';

export type AuthProvider = 'local' | 'google';

export interface User {
  id: string;
  dni?: string; // Solo ciudadanos con registro manual
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  provider: AuthProvider;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // segundos
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface GoogleAuthRequest {
  idToken: string; // token de Google Identity Services
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
