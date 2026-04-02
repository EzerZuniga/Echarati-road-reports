import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { Report, ReportFilters, ReportStatus } from '../../../../core/models';
import {
  getStatusLabel,
  getStatusColor,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from '../../../../core/utils';

@Component({
  selector: 'app-report-list-page',
  templateUrl: './report-list-page.component.html',
  styleUrls: ['./report-list-page.component.scss'],
})
export class ReportListPageComponent implements OnInit, OnDestroy {
  reports: Report[] = [];
  total = 0;
  loading = false;

  filters: ReportFilters = { page: 1, pageSize: 10 };

  readonly statusOptions = STATUS_OPTIONS;
  readonly categoryOptions = CATEGORY_OPTIONS;

  private destroy$ = new Subject<void>();

  constructor(
    private api: ReportApiService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.loading = true;
    this.api
      .getMine(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.reports = res.data;
          this.total = res.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snack.open('Error al cargar reportes', 'Cerrar', { duration: 3000 });
        },
      });
  }

  onFilterChange(key: keyof ReportFilters, value: string): void {
    (this.filters as unknown as Record<string, unknown>)[key] = value || undefined;
    this.filters.page = 1;
    this.loadReports();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.pageSize = event.pageSize;
    this.loadReports();
  }

  getStatusColor(status: ReportStatus): string {
    return getStatusColor(status);
  }

  getStatusLabel(status: ReportStatus): string {
    return getStatusLabel(status);
  }
}
