import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardMetrics, ReportCategory } from '../../../../core/models';
import { getStatusLabel, getCategoryLabel } from '../../../../core/utils';

export interface CategoryEntry {
  key: ReportCategory;
  label: string;
  icon: string;
  color: string;
  count: number;
  percent: number;
}

const CATEGORY_META: Record<ReportCategory, { icon: string; color: string }> = {
  POTHOLE: { icon: 'report_problem', color: '#c0392b' },
  LANDSLIDE: { icon: 'landslide', color: '#7f4f24' },
  FLOOD: { icon: 'water', color: '#1a6fa8' },
  ACCIDENT: { icon: 'car_crash', color: '#e67e22' },
  ROADBLOCK: { icon: 'block', color: '#8e44ad' },
  OTHER: { icon: 'more_horiz', color: '#546e7a' },
};

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  metrics?: DashboardMetrics;
  loading = true;
  error = false;
  categoryEntries: CategoryEntry[] = [];
  readonly today = new Date();
  readonly skeletonItems = [1, 2, 3, 4];

  private destroy$ = new Subject<void>();

  readonly statCards = [
    {
      key: 'pending' as const,
      label: 'Pendientes',
      icon: 'pending_actions',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      key: 'inProgress' as const,
      label: 'En Progreso',
      icon: 'autorenew',
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      key: 'resolved' as const,
      label: 'Resueltos',
      icon: 'check_circle',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      key: 'rejected' as const,
      label: 'Rechazados',
      icon: 'cancel',
      color: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  readonly displayedColumns = ['title', 'category', 'status', 'createdAt'];

  constructor(
    private api: ReportApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.api
      .getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (m) => {
          this.metrics = m;
          this.categoryEntries = this.buildCategoryEntries(m);
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        },
      });
  }

  getMetricValue(key: 'pending' | 'inProgress' | 'resolved' | 'rejected'): number {
    return this.metrics?.[key] ?? 0;
  }

  getPercent(value: number): number {
    if (!this.metrics?.totalReports) return 0;
    return Math.round((value / this.metrics.totalReports) * 100);
  }

  getStatusLabel(s: string): string {
    return getStatusLabel(s);
  }
  getCategoryLabel(c: string): string {
    return getCategoryLabel(c);
  }

  get greeting(): string {
    const h = this.today.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  get userName(): string {
    return this.auth.currentUser?.firstName ?? 'Admin';
  }

  get initials(): string {
    const u = this.auth.currentUser;
    return u ? `${u.firstName[0]}${u.lastName[0]}`.toUpperCase() : 'A';
  }

  get maxCategoryCount(): number {
    return this.categoryEntries.reduce((max, e) => Math.max(max, e.count), 0) || 1;
  }

  private buildCategoryEntries(m: DashboardMetrics): CategoryEntry[] {
    return (Object.entries(m.byCategory ?? {}) as [ReportCategory, number][])
      .map(([key, count]) => ({
        key,
        label: getCategoryLabel(key),
        icon: CATEGORY_META[key]?.icon ?? 'label',
        color: CATEGORY_META[key]?.color ?? '#64748b',
        count,
        percent: m.totalReports > 0 ? Math.round((count / m.totalReports) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }
}
