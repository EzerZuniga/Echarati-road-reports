import { Injectable } from '@angular/core';
import {
  QueuedReportOperation,
  Report,
  ReportCategory,
  ReportFilter,
  ReportStatus,
} from '../models/report.model';

const CACHE_STORAGE_KEY = 'citizen_reports_cache_v2';
const QUEUE_STORAGE_KEY = 'citizen_reports_queue_v1';

@Injectable({ providedIn: 'root' })
export class ReportCacheService {
  private inMemoryReports: Report[] = [];
  private inMemoryQueue: QueuedReportOperation[] = [];

  getReports(filter?: ReportFilter): Report[] {
    const reports = this.readReports();
    if (!filter) {
      return reports;
    }
    return reports.filter((report) => this.matchesFilter(report, filter));
  }

  getReport(id: number): Report | undefined {
    return this.readReports().find((report) => report.id === id);
  }

  upsert(report: Report): Report {
    const reports = this.readReports();
    const index = report.id ? reports.findIndex((r) => r.id === report.id) : -1;

    if (index >= 0) {
      reports[index] = { ...reports[index], ...report, updatedAt: report.updatedAt ?? new Date() };
    } else {
      const assignedId = report.id ?? this.generateLocalId(reports);
      reports.push({ ...report, id: assignedId, createdAt: new Date(), updatedAt: new Date() });
    }

    this.writeReports(reports);
    return report.id ? reports[index] : reports[reports.length - 1];
  }

  remove(id: number): void {
    const reports = this.readReports().filter((report) => report.id !== id);
    this.writeReports(reports);
  }

  replaceAll(reports: Report[]): void {
    this.writeReports(reports);
  }

  enqueueOperation(operation: QueuedReportOperation): void {
    const queue = this.readQueue();
    const existingIndex = queue.findIndex((item) => item.id === operation.id);

    if (existingIndex >= 0) {
      queue[existingIndex] = operation;
    } else {
      queue.push(operation);
    }

    this.writeQueue(queue);
  }

  dequeueOperation(operationId: string): void {
    const queue = this.readQueue().filter((item) => item.id !== operationId);
    this.writeQueue(queue);
  }

  getQueue(): QueuedReportOperation[] {
    return this.readQueue();
  }

  clearQueue(): void {
    this.writeQueue([]);
  }

  seedSampleData(): Report[] {
    const existing = this.readReports();
    if (existing.length > 0) {
      return existing;
    }

    const sampleReports: Report[] = [
      {
        id: 1,
        title: 'Hundimiento en carretera principal',
        description:
          'Socavón identificado en el kilómetro 12.5 de la carretera hacia Kepashiato. Riesgo alto para tránsito pesado.',
        category: ReportCategory.INFRASTRUCTURE,
        location: 'Carretera Echarati - Kepashiato, km 12.5',
        status: ReportStatus.PENDING,
        createdAt: new Date('2025-10-02T10:20:00Z'),
        updatedAt: new Date('2025-10-02T10:20:00Z'),
        userId: 102,
        userName: 'Brigada Vial Sector 2',
      },
      {
        id: 2,
        title: 'Deslizamiento parcial por lluvias',
        description:
          'Bloqueo parcial con material suelto a la altura del Puente Kiteni. Tránsito restringido a un carril.',
        category: ReportCategory.ENVIRONMENT,
        location: 'Margen izquierda del río Urubamba, Puente Kiteni',
        status: ReportStatus.IN_PROGRESS,
        createdAt: new Date('2025-10-01T06:15:00Z'),
        updatedAt: new Date('2025-10-03T08:45:00Z'),
        userId: 87,
        userName: 'Centro de Control Echarati',
      },
      {
        id: 3,
        title: 'Señalización vertical caída',
        description:
          'Poste de señalización de curva peligrosa derribado por choque. Requiere reposición urgente.',
        category: ReportCategory.SECURITY,
        location: 'Curva de Quepashiato, sector San Martín',
        status: ReportStatus.RESOLVED,
        createdAt: new Date('2025-09-18T12:00:00Z'),
        updatedAt: new Date('2025-09-19T09:32:00Z'),
        userId: 54,
        userName: 'Equipo de Señalización',
      },
    ];

    this.writeReports(sampleReports);
    return sampleReports;
  }

  private readReports(): Report[] {
    const raw = this.getStorage()?.getItem(CACHE_STORAGE_KEY);
    if (!raw) {
      return [...this.inMemoryReports];
    }

    try {
      const parsed = JSON.parse(raw) as Array<Partial<Report>>;
      return parsed.map((item) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      })) as Report[];
    } catch {
      return [...this.inMemoryReports];
    }
  }

  private writeReports(reports: Report[]): void {
    const storage = this.getStorage();
    const serializable = reports.map((report) => ({
      ...report,
      createdAt: report.createdAt ? report.createdAt.toISOString() : undefined,
      updatedAt: report.updatedAt ? report.updatedAt.toISOString() : undefined,
    }));

    if (storage) {
      storage.setItem(CACHE_STORAGE_KEY, JSON.stringify(serializable));
    }
    this.inMemoryReports = reports.map((report) => ({ ...report }));
  }

  private readQueue(): QueuedReportOperation[] {
    const raw = this.getStorage()?.getItem(QUEUE_STORAGE_KEY);
    if (!raw) {
      return [...this.inMemoryQueue];
    }

    try {
      return JSON.parse(raw) as QueuedReportOperation[];
    } catch {
      return [...this.inMemoryQueue];
    }
  }

  private writeQueue(queue: QueuedReportOperation[]): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    }
    this.inMemoryQueue = queue.map((item) => ({ ...item }));
  }

  private matchesFilter(report: Report, filter: ReportFilter): boolean {
    if (filter.category && report.category !== filter.category) {
      return false;
    }

    if (filter.status && report.status !== filter.status) {
      return false;
    }

    if (filter.location && !report.location.toLowerCase().includes(filter.location.toLowerCase())) {
      return false;
    }

    if (filter.startDate && report.createdAt && report.createdAt < filter.startDate) {
      return false;
    }

    if (filter.endDate && report.createdAt && report.createdAt > filter.endDate) {
      return false;
    }

    return true;
  }

  private generateLocalId(reports: Report[]): number {
    const existingIds = reports.map((report) => report.id ?? 0);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return maxId + 1;
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
}
