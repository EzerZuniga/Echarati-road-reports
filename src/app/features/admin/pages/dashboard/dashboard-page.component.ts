import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { DashboardMetrics } from '../../../../core/models';
import { getStatusLabel, getCategoryLabel } from '../../../../core/utils';

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
    { key: 'pending' as const, label: 'Pendientes', icon: 'pending_actions', color: '#9a4f00' },
    { key: 'inProgress' as const, label: 'En Progreso', icon: 'autorenew', color: '#0b4f8a' },
    { key: 'resolved' as const, label: 'Resueltos', icon: 'check_circle', color: '#1f7a3a' },
    { key: 'rejected' as const, label: 'Rechazados', icon: 'cancel', color: '#b42318' },
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
    return getStatusLabel(status);
  }

  getCategoryLabel(cat: string): string {
    return getCategoryLabel(cat);
  }
}
