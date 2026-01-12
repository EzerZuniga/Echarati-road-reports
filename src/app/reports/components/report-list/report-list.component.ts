import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportCategory, ReportStatus, ReportFilter } from '../../models/report.model';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  loading = true;
  error = '';

  // Filtros
  filter: ReportFilter = {};
  categories = Object.values(ReportCategory);
  statuses = Object.values(ReportStatus);

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Búsqueda
  searchTerm = '';

  private readonly facade = inject(ReportFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly isOnline$ = this.facade.isOnline$;

  ngOnInit(): void {
    this.facade.reports$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((reports) => {
      this.reports = reports;
      this.applySearchFilter();
    });

    this.facade.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.loading = value));

    this.facade.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => (this.error = message));

    this.categories = this.facade.getCategories();
    this.statuses = this.facade.getStatuses();

    this.loadReports();
  }

  loadReports(): void {
    this.facade.loadReports(this.filter);
    this.updatePagination();
  }

  applySearchFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReports = [...this.reports];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredReports = this.reports.filter(
        (report) =>
          report.title.toLowerCase().includes(term) ||
          report.description.toLowerCase().includes(term) ||
          report.location.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReports.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedReports(): Report[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReports.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFilterChange(): void {
    this.loadReports();
  }

  clearFilters(): void {
    this.filter = {};
    this.searchTerm = '';
    this.loadReports();
  }

  deleteReport(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este reporte?')) {
      this.facade.deleteReport(id).subscribe({
        error: (err) => {
          this.error = 'Error al eliminar el reporte';
          console.error(err);
        },
      });
    }
  }

  getStatusBadgeClass(status: ReportStatus): string {
    const classes: Record<ReportStatus, string> = {
      [ReportStatus.PENDING]: 'badge-warning',
      [ReportStatus.IN_PROGRESS]: 'badge-info',
      [ReportStatus.RESOLVED]: 'badge-success',
      [ReportStatus.CLOSED]: 'badge-secondary',
    };
    return classes[status] || 'badge-secondary';
  }

  getCategoryIcon(category: ReportCategory): string {
    const icons: Record<ReportCategory, string> = {
      [ReportCategory.INFRASTRUCTURE]: '🛠️',
      [ReportCategory.SECURITY]: '🚨',
      [ReportCategory.ENVIRONMENT]: '🌿',
      [ReportCategory.TRANSPORT]: '🚧',
      [ReportCategory.OTHER]: '📌',
    };
    return icons[category] || '📌';
  }

  getCategoryLabel(category: ReportCategory): string {
    const labels: Record<ReportCategory, string> = {
      [ReportCategory.INFRASTRUCTURE]: 'Infraestructura vial',
      [ReportCategory.SECURITY]: 'Seguridad vial',
      [ReportCategory.ENVIRONMENT]: 'Evento ambiental',
      [ReportCategory.TRANSPORT]: 'Transporte y tránsito',
      [ReportCategory.OTHER]: 'Otro',
    };
    return labels[category] || 'Otro';
  }

  getPendingActionLabel(action?: string): string {
    const map: Record<string, string> = {
      create: 'Pendiente por enviar',
      update: 'Actualización pendiente',
      delete: 'Eliminación pendiente',
    };
    return action ? (map[action] ?? 'Pendiente') : '';
  }

  isOfflineReport(report: Report): boolean {
    return !!report.isOfflineEntry;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
