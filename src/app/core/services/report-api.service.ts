import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Report,
  CreateReportRequest,
  UpdateReportStatusRequest,
  ReportFilters,
  PaginatedResponse,
  DashboardMetrics,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private readonly base = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getAll(filters: ReportFilters): Observable<PaginatedResponse<Report>> {
    return this.http.get<PaginatedResponse<Report>>(this.base, {
      params: this.buildParams(filters),
    });
  }

  getMine(filters: ReportFilters): Observable<PaginatedResponse<Report>> {
    return this.http.get<PaginatedResponse<Report>>(`${this.base}/mine`, {
      params: this.buildParams(filters),
    });
  }

  getById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.base}/${id}`);
  }

  create(data: CreateReportRequest): Observable<Report> {
    return this.http.post<Report>(this.base, data);
  }

  update(id: string, data: Partial<CreateReportRequest>): Observable<Report> {
    return this.http.put<Report>(`${this.base}/${id}`, data);
  }

  updateStatus(id: string, body: UpdateReportStatusRequest): Observable<Report> {
    return this.http.patch<Report>(`${this.base}/${id}/status`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getDashboard(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${environment.apiUrl}/admin/dashboard`);
  }

  private buildParams(filters: ReportFilters): HttpParams {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('limit', filters.limit.toString());
    if (filters.status) params = params.set('status', filters.status);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    return params;
  }
}
