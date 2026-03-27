import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { Report, ReportFilters, ReportStatus, ReportCategory } from '../../../../core/models';

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

  readonly statusOptions: { value: ReportStatus | ''; label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  readonly categoryOptions: { value: ReportCategory | ''; label: string }[] = [
    { value: '', label: 'Todas las categorías' },
    { value: 'road_damage', label: 'Daño en vía' },
    { value: 'lighting', label: 'Alumbrado' },
    { value: 'waste', label: 'Residuos' },
    { value: 'water', label: 'Agua / Saneamiento' },
    { value: 'security', label: 'Seguridad' },
    { value: 'other', label: 'Otro' },
  ];

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
    const map: Record<ReportStatus, string> = {
      pending: 'warn',
      in_progress: 'primary',
      resolved: 'accent',
      rejected: '',
    };
    return map[status];
  }

  getStatusLabel(status: ReportStatus): string {
    const map: Record<ReportStatus, string> = {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      resolved: 'Resuelto',
      rejected: 'Rechazado',
    };
    return map[status];
  }
}
