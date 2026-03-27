import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Report, ReportStatus, ReportCategory, ReportFilter } from '../models/report.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly STORAGE_KEY = 'citizen_reports';
  private reports: Report[] = [];

  constructor(private authService: AuthService) {
    this.loadReports();
    this.initializeSampleData();
  }

  private loadReports(): void {
    try {
      const reportsJson = localStorage.getItem(this.STORAGE_KEY);
      if (reportsJson) {
        this.reports = (
          JSON.parse(reportsJson) as Array<Report & { createdAt: string; updatedAt: string }>
        ).map((report) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt),
        }));
      }
    } catch (error) {
      console.error('Error al cargar reportes desde almacenamiento local:', error);
      this.reports = [];
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveReports(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error al guardar reportes:', error);
    }
  }

  private initializeSampleData(): void {
    if (this.reports.length === 0) {
      const sampleReports: Report[] = [
        {
          id: 1,
          title: 'Bache en la Av. Echarati',
          description:
            'Se ha formado un bache de aproximadamente 1 metro de diámetro en la avenida principal de Echarati, cerca del cruce con la calle Quillabamba. Representa peligro para vehículos y peatones.',
          category: ReportCategory.INFRASTRUCTURE,
          location: 'Av. Echarati cruce con Jr. Quillabamba',
          latitude: -12.7689,
          longitude: -72.5225,
          status: ReportStatus.PENDING,
          createdAt: new Date('2026-02-10T08:30:00'),
          updatedAt: new Date('2026-02-10T08:30:00'),
          userId: 1,
          userName: 'Carlos Quispe Huamán',
        },
        {
          id: 2,
          title: 'Alumbrado público defectuoso en Plaza de Armas',
          description:
            'Tres postes de alumbrado público no funcionan en el perímetro de la Plaza de Armas de Echarati. La zona queda completamente oscura después de las 6pm, generando inseguridad.',
          category: ReportCategory.SECURITY,
          location: 'Plaza de Armas de Echarati',
          latitude: -12.77,
          longitude: -72.523,
          status: ReportStatus.IN_PROGRESS,
          createdAt: new Date('2026-02-08T14:15:00'),
          updatedAt: new Date('2026-02-09T09:00:00'),
          userId: 2,
          userName: 'María Elena Condori',
        },
        {
          id: 3,
          title: 'Acumulación de basura en mercado central',
          description:
            'Se ha acumulado basura en las inmediaciones del mercado central de Echarati durante más de tres días. Genera malos olores y atrae insectos. Se requiere recojo urgente y colocación de contenedores.',
          category: ReportCategory.ENVIRONMENT,
          location: 'Mercado Central de Echarati, Jr. Comercio',
          latitude: -12.7695,
          longitude: -72.522,
          status: ReportStatus.RESOLVED,
          createdAt: new Date('2026-02-05T10:45:00'),
          updatedAt: new Date('2026-02-07T16:30:00'),
          userId: 1,
          userName: 'Carlos Quispe Huamán',
        },
        {
          id: 4,
          title: 'Puente peatonal deteriorado en río Urubamba',
          description:
            'El puente peatonal que cruza el río Urubamba cerca del sector Palma Real presenta tablas rotas y barandales sueltos. Es usado diariamente por estudiantes y agricultores de la zona.',
          category: ReportCategory.INFRASTRUCTURE,
          location: 'Puente peatonal Palma Real, río Urubamba',
          latitude: -12.75,
          longitude: -72.54,
          status: ReportStatus.PENDING,
          createdAt: new Date('2026-02-11T07:20:00'),
          updatedAt: new Date('2026-02-11T07:20:00'),
          userId: 3,
          userName: 'Rosa Mamani Yupanqui',
        },
        {
          id: 5,
          title: 'Señalización vial faltante en curva peligrosa',
          description:
            'En el kilómetro 15 de la carretera Echarati-Quillabamba falta señalización en una curva cerrada donde ya han ocurrido accidentes. Se necesitan señales de velocidad y espejos convexos.',
          category: ReportCategory.TRANSPORT,
          location: 'Km 15 Carretera Echarati-Quillabamba',
          latitude: -12.78,
          longitude: -72.51,
          status: ReportStatus.IN_PROGRESS,
          createdAt: new Date('2026-02-09T11:00:00'),
          updatedAt: new Date('2026-02-10T15:45:00'),
          userId: 2,
          userName: 'María Elena Condori',
        },
        {
          id: 6,
          title: 'Contaminación del agua en quebrada Chaupimayo',
          description:
            'Se observa agua de color oscuro y mal olor en la quebrada Chaupimayo, posiblemente por vertido de residuos. Afecta a las familias que utilizan esta fuente de agua para riego y consumo.',
          category: ReportCategory.ENVIRONMENT,
          location: 'Quebrada Chaupimayo, sector agrícola',
          latitude: -12.76,
          longitude: -72.535,
          status: ReportStatus.PENDING,
          createdAt: new Date('2026-02-12T06:50:00'),
          updatedAt: new Date('2026-02-12T06:50:00'),
          userId: 4,
          userName: 'Pedro Flores Ramos',
        },
        {
          id: 7,
          title: 'Vereda destruida frente a centro de salud',
          description:
            'La vereda frente al centro de salud de Echarati está completamente destruida. Los pacientes y personas con discapacidad tienen dificultades para acceder al establecimiento. Se necesita reconstrucción urgente.',
          category: ReportCategory.INFRASTRUCTURE,
          location: 'Centro de Salud Echarati, Av. Salud s/n',
          latitude: -12.771,
          longitude: -72.524,
          status: ReportStatus.CLOSED,
          createdAt: new Date('2026-01-20T09:30:00'),
          updatedAt: new Date('2026-02-01T14:00:00'),
          userId: 3,
          userName: 'Rosa Mamani Yupanqui',
        },
      ];

      this.reports = sampleReports;
      this.saveReports();
    }
  }

  private generateId(): number {
    const maxId = this.reports.reduce(
      (max, report) => (report.id && report.id > max ? report.id : max),
      0
    );
    return maxId + 1;
  }

  getReports(filter?: ReportFilter): Observable<Report[]> {
    return of(this.reports).pipe(
      delay(300),
      map((reports) => {
        let result = [...reports];

        if (filter) {
          result = result.filter((report) => {
            if (filter.category && report.category !== filter.category) return false;
            if (filter.status && report.status !== filter.status) return false;
            if (
              filter.location &&
              !report.location.toLowerCase().includes(filter.location.toLowerCase())
            )
              return false;
            if (filter.startDate && report.createdAt && report.createdAt < filter.startDate)
              return false;
            if (filter.endDate && report.createdAt && report.createdAt > filter.endDate)
              return false;
            return true;
          });
        }

        // Ordenar por fecha de creación descendente (más recientes primero)
        result.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        return result;
      })
    );
  }

  getReport(id: number): Observable<Report> {
    const report = this.reports.find((r) => r.id === id);

    if (report) {
      return of(report).pipe(delay(200));
    } else {
      return throwError(() => new Error('Reporte no encontrado'));
    }
  }

  createReport(report: Report): Observable<Report> {
    const currentUser = this.authService.currentUser;

    const newReport: Report = {
      ...report,
      id: this.generateId(),
      status: ReportStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: currentUser?.id ? parseInt(currentUser.id, 10) || 0 : 0,
      userName: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : 'Usuario Anónimo',
    };

    this.reports.push(newReport);
    this.saveReports();

    return of(newReport).pipe(delay(300));
  }

  updateReport(id: number, updates: Partial<Report>): Observable<Report> {
    const index = this.reports.findIndex((r) => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Reporte no encontrado'));
    }

    const updatedReport: Report = {
      ...this.reports[index],
      ...updates,
      id: id,
      updatedAt: new Date(),
    };

    this.reports[index] = updatedReport;
    this.saveReports();

    return of(updatedReport).pipe(delay(300));
  }

  deleteReport(id: number): Observable<void> {
    const index = this.reports.findIndex((r) => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Reporte no encontrado'));
    }

    this.reports.splice(index, 1);
    this.saveReports();

    return of(void 0).pipe(delay(200));
  }

  getCategories(): ReportCategory[] {
    return Object.values(ReportCategory);
  }

  getStatuses(): ReportStatus[] {
    return Object.values(ReportStatus);
  }

  /**
   * Devuelve estadísticas rápidas del total de reportes por estado.
   */
  getStats(): {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
  } {
    return {
      total: this.reports.length,
      pending: this.reports.filter((r) => r.status === ReportStatus.PENDING).length,
      inProgress: this.reports.filter((r) => r.status === ReportStatus.IN_PROGRESS).length,
      resolved: this.reports.filter((r) => r.status === ReportStatus.RESOLVED).length,
      closed: this.reports.filter((r) => r.status === ReportStatus.CLOSED).length,
    };
  }
}
