import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

export interface UploadResponse {
  url: string;
  publicId?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly base = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen al servidor.
   * @param file Archivo seleccionado por el usuario
   * @returns URL pública de la imagen subida
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<UploadResponse>(`${this.base}/image`, formData)
      .pipe(map((res) => res.url));
  }
}
