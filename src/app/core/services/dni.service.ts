import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DniResponse {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

@Injectable({ providedIn: 'root' })
export class DniService {
  private readonly endpoint = `${environment.apiUrl}/api/validate-dni`;

  constructor(private http: HttpClient) {}

  /**
   * Consulta el backend para validar un DNI con RENIEC.
   * El backend es responsable de llamar a la API de RENIEC con sus credenciales.
   */
  lookup(dni: string): Observable<DniResponse | null> {
    if (!/^\d{8}$/.test(dni)) {
      return of(null);
    }

    return this.http
      .get<DniResponse>(this.endpoint, { params: { dni } })
      .pipe(catchError(() => of(null)));
  }
}
