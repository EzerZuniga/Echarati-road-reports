import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Report, ReportStatus, ReportCategory, ReportFilter } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly STORAGE_KEY = 'citizen_reports';
  private reports: Report[] = [];

  constructor() {
    this.loadReports();
    this.initializeSampleData();
  }

  private loadReports(): void {
    const reportsJson = localStorage.getItem(this.STORAGE_KEY);
    if (reportsJson) {
      this.reports = JSON.parse(reportsJson).map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt)
      }));
    }
  }

  private saveReports(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
  }

  private initializeSampleData(): void {
    if (this.reports.length === 0) {
      const sampleReports: Report[] = [
        {
          id: 1,
          title: 'Bache en avenida principal',
          description: 'Bache grande en la avenida principal cerca del parque',
          category: ReportCategory.INFRASTRUCTURE,
          location: 'Avenida Principal 123',
          status: ReportStatus.PENDING,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          userId: 1,
          userName: 'Juan Pérez'
        },
        {
          id: 2,
          title: 'Alumbrado público defectuoso',
          description: 'Poste de luz no funciona en calle secundaria',
          category: ReportCategory.INFRASTRUCTURE,
          location: 'Calle Secundaria 456',
          status: ReportStatus.IN_PROGRESS,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-12'),
          userId: 2,
          userName: 'María García'
        },
        {
          id: 3,
          title: 'Acumulación de basura',
          description: 'Basura acumulada en esquina durante varios días',
          category: ReportCategory.ENVIRONMENT,
          location: 'Esquina Calle 5 y Avenida 8',
          status: ReportStatus.RESOLVED,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-09'),
          userId: 1,
          userName: 'Juan Pérez'
        }
      ];
      
      this.reports = sampleReports;
      this.saveReports();
    }
  }

  private generateId(): number {
    const maxId = this.reports.reduce((max, report) => 
      report.id && report.id > max ? report.id : max, 0
    );
    return maxId + 1;
  }

  getReports(filter?: ReportFilter): Observable<Report[]> {
    return of(this.reports).pipe(
      delay(500), // Simular delay de red
      map(reports => {
        if (!filter) return reports;
        
        return reports.filter(report => {
          let matches = true;
          
          if (filter.category && report.category !== filter.category) {
            matches = false;
          }
          
          if (filter.status && report.status !== filter.status) {
            matches = false;
          }
          
          if (filter.location && !report.location.toLowerCase().includes(filter.location.toLowerCase())) {
            matches = false;
          }
          
          if (filter.startDate && report.createdAt && report.createdAt < filter.startDate) {
            matches = false;
          }
          
          if (filter.endDate && report.createdAt && report.createdAt > filter.endDate) {
            matches = false;
          }
          
          return matches;
        });
      })
    );
  }

  getReport(id: number): Observable<Report> {
    const report = this.reports.find(r => r.id === id);
    
    if (report) {
      return of(report).pipe(delay(300));
    } else {
      return throwError(() => new Error('Reporte no encontrado'));
    }
  }

  createReport(report: Report): Observable<Report> {
    const newReport: Report = {
      ...report,
      id: this.generateId(),
      status: ReportStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1, // En una app real, esto vendría del usuario autenticado
      userName: 'Usuario Actual'
    };
    
    this.reports.push(newReport);
    this.saveReports();
    
    return of(newReport).pipe(delay(500));
  }

  updateReport(id: number, updates: Partial<Report>): Observable<Report> {
    const index = this.reports.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Reporte no encontrado'));
    }
    
    const updatedReport = {
      ...this.reports[index],
      ...updates,
      id: id,
      updatedAt: new Date()
    };
    
    this.reports[index] = updatedReport;
    this.saveReports();
    
    return of(updatedReport).pipe(delay(500));
  }

  deleteReport(id: number): Observable<void> {
    const index = this.reports.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Reporte no encontrado'));
    }
    
    this.reports.splice(index, 1);
    this.saveReports();
    
    return of(void 0).pipe(delay(300));
  }

  getCategories(): ReportCategory[] {
    return Object.values(ReportCategory);
  }

  getStatuses(): ReportStatus[] {
    return Object.values(ReportStatus);
  }
}