import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { Report, ReportStatus, ReportCategory, ReportFilters } from '../../../../core/models';
import {
  getStatusLabel,
  getCategoryLabel,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from '../../../../core/utils';

@Component({
  selector: 'app-reports-management-page',
  templateUrl: './reports-management-page.component.html',
  styleUrls: ['./reports-management-page.component.scss'],
})
export class ReportsManagementPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Report>([]);
  total = 0;
  loading = false;

  displayedColumns = [
    'title',
    'category',
    'status',
    'citizenName',
    'location',
    'createdAt',
    'actions',
  ];

  searchCtrl = new FormControl('');
  statusCtrl = new FormControl<ReportStatus | ''>('');
  categoryCtrl = new FormControl<ReportCategory | ''>('');

  private filters: ReportFilters = { page: 1, limit: 10 };
  private destroy$ = new Subject<void>();

  readonly statusOptions = STATUS_OPTIONS;

  readonly categoryOptions = CATEGORY_OPTIONS;

  readonly statusTransitions: Record<ReportStatus, { value: ReportStatus; label: string }[]> = {
    PENDING: [
      { value: 'IN_PROGRESS', label: 'Iniciar' },
      { value: 'REJECTED', label: 'Rechazar' },
    ],
    IN_PROGRESS: [
      { value: 'RESOLVED', label: 'Resolver' },
      { value: 'REJECTED', label: 'Rechazar' },
    ],
    RESOLVED: [],
    REJECTED: [{ value: 'PENDING', label: 'Reabrir' }],
  };

  constructor(
    private api: ReportApiService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReports();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((v) => {
        this.filters.search = v ?? undefined;
        this.filters.page = 1;
        this.loadReports();
      });

    this.statusCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => {
      this.filters.status = v || undefined;
      this.filters.page = 1;
      this.loadReports();
    });

    this.categoryCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((v) => {
      this.filters.category = v || undefined;
      this.filters.page = 1;
      this.loadReports();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.loading = true;
    this.api
      .getAll(this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.data;
          this.total = res.meta.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.limit = event.pageSize;
    this.loadReports();
  }

  updateStatus(report: Report, newStatus: ReportStatus): void {
    this.api
      .updateStatus(report.id, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          const idx = this.dataSource.data.findIndex((r) => r.id === report.id);
          if (idx >= 0) {
            const data = [...this.dataSource.data];
            data[idx] = updated;
            this.dataSource.data = data;
          }
          this.snack.open('Estado actualizado', 'OK', { duration: 2500 });
        },
        error: () => this.snack.open('Error al actualizar estado', 'Cerrar', { duration: 3000 }),
      });
  }

  deleteReport(id: string): void {
    if (!confirm('¿Eliminar este reporte permanentemente?')) return;
    this.api
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((r) => r.id !== id);
          this.total--;
          this.snack.open('Reporte eliminado', 'OK', { duration: 2500 });
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar', { duration: 3000 }),
      });
  }

  getStatusLabel(status: ReportStatus): string {
    return getStatusLabel(status);
  }

  getCategoryLabel(cat: string): string {
    return getCategoryLabel(cat);
  }

  getTransitions(status: ReportStatus): { value: ReportStatus; label: string }[] {
    return this.statusTransitions[status] ?? [];
  }
}
