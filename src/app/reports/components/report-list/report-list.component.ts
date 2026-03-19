import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { Report, ReportCategory, ReportStatus, ReportFilter } from '../../models/report.model';
import { getCategoryIconClass, getCategoryLabel, getStatusBadgeClass, getStatusLabel } from '../../utils/report-utils';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit, OnDestroy {
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

  // Estadísticas
  stats = { total: 0, pending: 0, inProgress: 0, resolved: 0, closed: 0 };

  // Utilidades compartidas (re-expuestas al template)
  getCategoryIconClass = getCategoryIconClass;
  getCategoryLabel = getCategoryLabel;
  getStatusBadgeClass = getStatusBadgeClass;
  getStatusLabel = getStatusLabel;

  private destroy$ = new Subject<void>();

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.loadReports();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReports(): void {
    this.loading = true;
    this.error = '';

    this.reportService.getReports(this.filter).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (reports) => {
        this.reports = reports;
        this.stats = this.reportService.getStats();
        this.applySearchFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los reportes. Intente nuevamente.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applySearchFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredReports = [...this.reports];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredReports = this.reports.filter(report =>
        report.title.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term) ||
        report.location.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredReports.length / this.itemsPerPage));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedReports(): Report[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReports.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
      this.reportService.deleteReport(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => this.loadReports(),
        error: (err) => {
          this.error = 'Error al eliminar el reporte.';
          console.error(err);
        }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}