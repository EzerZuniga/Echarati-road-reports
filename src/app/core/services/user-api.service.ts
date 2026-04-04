import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { User, UpdateProfileRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.base}/profile`);
  }

  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.patch<User>(`${this.base}/profile`, data);
  }
}
