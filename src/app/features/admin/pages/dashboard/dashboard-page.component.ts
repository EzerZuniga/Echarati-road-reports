import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { DashboardMetrics } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  metrics?: DashboardMetrics;
  loading = true;
  private destroy$ = new Subject<void>();

  readonly statCards = [
    { key: 'pending' as const, label: 'Pendientes', icon: 'pending_actions', color: '#e65100' },
    { key: 'inProgress' as const, label: 'En Progreso', icon: 'autorenew', color: '#1565c0' },
    { key: 'resolved' as const, label: 'Resueltos', icon: 'check_circle', color: '#2e7d32' },
    { key: 'rejected' as const, label: 'Rechazados', icon: 'cancel', color: '#c62828' },
  ];

  displayedColumns = ['title', 'category', 'status', 'citizenName', 'createdAt'];

  constructor(private api: ReportApiService) {}

  ngOnInit(): void {
    this.api
      .getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (m) => {
          this.metrics = m;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMetricValue(key: 'pending' | 'inProgress' | 'resolved' | 'rejected'): number {
    if (!this.metrics) return 0;
    return this.metrics[key];
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      resolved: 'Resuelto',
      rejected: 'Rechazado',
    };
    return map[status] ?? status;
  }
}
