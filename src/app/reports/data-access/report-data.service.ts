import { Injectable, OnDestroy } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { NetworkService } from '../../core/services/network.service';
import {
  QueuedReportActionType,
  QueuedReportOperation,
  Report,
  ReportFilter,
} from '../models/report.model';
import { ReportApiService } from './report-api.service';
import { ReportCacheService } from './report-cache.service';

@Injectable({ providedIn: 'root' })
export class ReportDataService implements OnDestroy {
  private readonly queueSubscription = this.network.online$
    .pipe(catchError(() => of(true)))
    .subscribe((online) => {
      if (online) {
        this.flushQueue().subscribe({
          error: () => {
            // swallow errors; queue will be retried on the next connectivity change
          },
        });
      }
    });

  constructor(
    private api: ReportApiService,
    private cache: ReportCacheService,
    private network: NetworkService
  ) {
    this.cache.seedSampleData();
  }

  fetchReports(filter?: ReportFilter): Observable<Report[]> {
    if (this.network.isOnline) {
      return this.api.getReports(filter).pipe(
        tap((reports) => this.cache.replaceAll(reports)),
        catchError(() => of(this.cache.getReports(filter)))
      );
    }

    return of(this.cache.getReports(filter));
  }

  fetchReport(id: number): Observable<Report> {
    if (this.network.isOnline) {
      return this.api.getReport(id).pipe(
        tap((report) => this.cache.upsert(report)),
        catchError(() => this.resolveReportFromCache(id))
      );
    }

    return this.resolveReportFromCache(id);
  }

  createReport(report: Report): Observable<Report> {
    const normalized = this.normalizeReport(report);

    if (this.network.isOnline) {
      return this.api.createReport(normalized).pipe(
        tap((created) => this.cache.upsert(created)),
        catchError(() => of(this.persistOffline('create', normalized)))
      );
    }

    return of(this.persistOffline('create', normalized));
  }

  updateReport(id: number, updates: Partial<Report>): Observable<Report> {
    const normalized = { ...updates, id } as Report;

    if (this.network.isOnline) {
      return this.api.updateReport(id, updates).pipe(
        tap((updated) => this.cache.upsert(updated)),
        catchError(() => of(this.persistOffline('update', normalized)))
      );
    }

    return of(this.persistOffline('update', normalized));
  }

  deleteReport(id: number): Observable<void> {
    if (this.network.isOnline) {
      return this.api.deleteReport(id).pipe(
        tap(() => this.cache.remove(id)),
        catchError(() => {
          this.persistOffline('delete', { id } as Report);
          return of(void 0);
        })
      );
    }

    this.persistOffline('delete', { id } as Report);
    return of(void 0);
  }

  flushQueue(): Observable<void> {
    const queue = this.cache.getQueue();
    if (queue.length === 0) {
      return of(void 0);
    }

    return from(queue).pipe(concatMap((operation) => this.executeQueuedOperation(operation)));
  }

  ngOnDestroy(): void {
    this.queueSubscription.unsubscribe();
  }

  private executeQueuedOperation(operation: QueuedReportOperation): Observable<void> {
    if (!this.network.isOnline) {
      return of(void 0);
    }

    let request$: Observable<unknown>;

    if (operation.type === 'create') {
      request$ = this.api.createReport(operation.payload as Report);
    } else if (operation.type === 'update') {
      const targetId = operation.targetId ?? (operation.payload.id as number);
      request$ = this.api.updateReport(targetId, operation.payload);
    } else {
      const targetId = operation.targetId ?? (operation.payload.id as number);
      request$ = this.api.deleteReport(targetId);
    }

    return request$.pipe(
      tap((result) => {
        if (operation.type === 'delete') {
          this.cache.remove(operation.targetId ?? (operation.payload.id as number));
        } else if (operation.type === 'create') {
          const toPersist = this.removeOfflineFlags(
            (result as Report) ?? (operation.payload as Report)
          );
          this.cache.upsert(toPersist);
        } else {
          const toPersist = this.removeOfflineFlags(
            ((result as Report) ?? { ...operation.payload, id: operation.targetId }) as Report
          );
          this.cache.upsert(toPersist);
        }
        this.cache.dequeueOperation(operation.id);
      }),
      catchError(() => {
        // keep the operation in the queue for retry
        return throwError(() => new Error('Queue operation failed'));
      }),
      concatMap(() => of(void 0))
    );
  }

  private resolveReportFromCache(id: number): Observable<Report> {
    const cached = this.cache.getReport(id);
    if (!cached) {
      return throwError(() => new Error('Reporte no encontrado en caché local'));
    }
    return of(cached);
  }

  private persistOffline(action: QueuedReportActionType, report: Report): Report {
    if (action === 'delete') {
      const operation: QueuedReportOperation = {
        id: this.generateQueueId(),
        type: 'delete',
        payload: { id: report.id } as Report,
        targetId: report.id,
        createdAt: new Date().toISOString(),
      };

      if (report.id) {
        this.cache.remove(report.id);
      }

      this.cache.enqueueOperation(operation);
      return { ...report, pendingAction: 'delete', isOfflineEntry: true } as Report;
    }

    const flagged: Report = {
      ...report,
      id: report.id ?? undefined,
      isOfflineEntry: true,
      pendingAction: action,
      updatedAt: new Date(),
    };

    const stored = this.cache.upsert(flagged);
    const operation: QueuedReportOperation = {
      id: this.generateQueueId(),
      type: action,
      payload: { ...stored },
      targetId: stored.id,
      createdAt: new Date().toISOString(),
    };

    this.cache.enqueueOperation(operation);
    return stored;
  }

  private normalizeReport(report: Report): Report {
    const timestamp = new Date();
    return {
      ...report,
      createdAt: report.createdAt ?? timestamp,
      updatedAt: timestamp,
      status: report.status,
      userId: report.userId ?? 1,
      userName: report.userName ?? 'Usuario Operativo',
    };
  }

  private generateQueueId(): string {
    const globalCrypto = globalThis?.crypto as Crypto | undefined;
    if (globalCrypto?.randomUUID) {
      return globalCrypto.randomUUID();
    }
    return `queue-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private removeOfflineFlags(report: Report): Report {
    const sanitized = { ...report } as Report;
    delete sanitized.isOfflineEntry;
    delete sanitized.pendingAction;
    return sanitized;
  }
}
