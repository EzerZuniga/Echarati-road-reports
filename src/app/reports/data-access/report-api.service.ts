import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Report, ReportFilter, ReportStatus } from '../models/report.model';

interface ReportDto {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  userName?: string;
  photos?: string[];
}

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getReports(filter?: ReportFilter): Observable<Report[]> {
    const params = this.buildFilterParams(filter);
    return this.http
      .get<ReportDto[]>(this.baseUrl, { params })
      .pipe(map((dtos) => dtos.map((dto) => this.mapDtoToReport(dto))));
  }

  getReport(id: number): Observable<Report> {
    return this.http
      .get<ReportDto>(`${this.baseUrl}/${id}`)
      .pipe(map((dto) => this.mapDtoToReport(dto)));
  }

  createReport(report: Report): Observable<Report> {
    return this.http
      .post<ReportDto>(this.baseUrl, this.mapReportToDto(report))
      .pipe(map((dto) => this.mapDtoToReport(dto)));
  }

  updateReport(id: number, updates: Partial<Report>): Observable<Report> {
    return this.http
      .patch<ReportDto>(`${this.baseUrl}/${id}`, this.mapReportToDto(updates))
      .pipe(map((dto) => this.mapDtoToReport(dto)));
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private buildFilterParams(filter?: ReportFilter): HttpParams {
    let params = new HttpParams();
    if (!filter) {
      return params;
    }

    if (filter.category) {
      params = params.set('category', filter.category);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.location) {
      params = params.set('location', filter.location);
    }

    if (filter.startDate) {
      params = params.set('startDate', filter.startDate.toISOString());
    }

    if (filter.endDate) {
      params = params.set('endDate', filter.endDate.toISOString());
    }

    return params;
  }

  private mapDtoToReport(dto: ReportDto): Report {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      category: dto.category as Report['category'],
      location: dto.location,
      latitude: dto.latitude,
      longitude: dto.longitude,
      status: (dto.status as ReportStatus) ?? ReportStatus.PENDING,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      userId: dto.userId,
      userName: dto.userName,
      photos: dto.photos,
    };
  }

  private mapReportToDto(report: Partial<Report>): Partial<ReportDto> {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
      latitude: report.latitude,
      longitude: report.longitude,
      status: report.status,
      createdAt: report.createdAt?.toISOString(),
      updatedAt: report.updatedAt?.toISOString(),
      userId: report.userId,
      userName: report.userName,
      photos: report.photos,
    };
  }
}
