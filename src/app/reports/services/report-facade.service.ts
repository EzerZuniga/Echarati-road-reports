import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { NetworkService } from '../../core/services/network.service';
import { ReportDataService } from '../data-access/report-data.service';
import { Report, ReportCategory, ReportFilter, ReportStatus } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportFacadeService {
  private readonly reportsSubject = new BehaviorSubject<Report[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string>('');
  private readonly filterSubject = new BehaviorSubject<ReportFilter | undefined>(undefined);

  readonly reports$ = this.reportsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly filter$ = this.filterSubject.asObservable();
  readonly isOnline$ = this.network.online$;

  constructor(
    private dataService: ReportDataService,
    private network: NetworkService
  ) {}

  loadReports(filter?: ReportFilter): void {
    this.loadingSubject.next(true);
    this.errorSubject.next('');
    this.filterSubject.next(filter);

    this.dataService
      .fetchReports(filter)
      .pipe(
        tap((reports) => this.reportsSubject.next(this.sortReports(reports))),
        catchError((error: Error) => {
          this.errorSubject.next(error.message ?? 'No se pudo cargar los reportes');
          return of([] as Report[]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  getReport(id: number): Observable<Report> {
    const cached = this.reportsSubject.value.find((report) => report.id === id);
    if (cached) {
      return of(cached);
    }

    return this.dataService.fetchReport(id).pipe(
      tap((report) => {
        const reports = [...this.reportsSubject.value];
        const index = report.id ? reports.findIndex((r) => r.id === report.id) : -1;
        if (index >= 0) {
          reports[index] = report;
        } else {
          reports.push(report);
        }
        this.reportsSubject.next(this.sortReports(reports));
      })
    );
  }

  createReport(report: Report): Observable<Report> {
    this.loadingSubject.next(true);
    return this.dataService.createReport(report).pipe(
      tap((created) => {
        const reports = [...this.reportsSubject.value, created];
        this.reportsSubject.next(this.sortReports(reports));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateReport(id: number, updates: Partial<Report>): Observable<Report> {
    this.loadingSubject.next(true);
    return this.dataService.updateReport(id, updates).pipe(
      tap((updated) => {
        const reports = this.reportsSubject.value.map((report) =>
          report.id === updated.id ? { ...report, ...updated } : report
        );
        this.reportsSubject.next(this.sortReports(reports));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  deleteReport(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.dataService.deleteReport(id).pipe(
      tap(() => {
        const reports = this.reportsSubject.value.filter((report) => report.id !== id);
        this.reportsSubject.next(this.sortReports(reports));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  flushQueue(): void {
    if (!this.network.isOnline) {
      return;
    }

    this.dataService.flushQueue().subscribe({
      complete: () => {
        const filter = this.filterSubject.value;
        this.loadReports(filter);
      },
    });
  }

  getCategories(): ReportCategory[] {
    return Object.values(ReportCategory);
  }

  getStatuses(): ReportStatus[] {
    return Object.values(ReportStatus);
  }

  private sortReports(reports: Report[]): Report[] {
    return [...reports].sort((a, b) => {
      const dateA = a.updatedAt?.getTime() ?? 0;
      const dateB = b.updatedAt?.getTime() ?? 0;
      return dateB - dateA;
    });
  }
}
