import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report, ReportCategory, ReportStatus, ReportFilter } from '../../models/report.model';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = '';
    
    this.reportService.getReports(this.filter).subscribe({
      next: (reports) => {
        this.reports = reports;
        this.applySearchFilter();
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los reportes';
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
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.loadReports();
        },
        error: (err) => {
          this.error = 'Error al eliminar el reporte';
          console.error(err);
        }
      });
    }
  }

  getStatusBadgeClass(status: ReportStatus): string {
    const classes: Record<ReportStatus, string> = {
      [ReportStatus.PENDING]: 'badge-warning',
      [ReportStatus.IN_PROGRESS]: 'badge-info',
      [ReportStatus.RESOLVED]: 'badge-success',
      [ReportStatus.CLOSED]: 'badge-secondary'
    };
    return classes[status] || 'badge-secondary';
  }

  getCategoryIcon(category: ReportCategory): string {
    const icons: Record<ReportCategory, string> = {
      [ReportCategory.INFRASTRUCTURE]: '🏗️',
      [ReportCategory.SECURITY]: '👮',
      [ReportCategory.ENVIRONMENT]: '🌿',
      [ReportCategory.TRANSPORT]: '🚗',
      [ReportCategory.OTHER]: '📋'
    };
    return icons[category] || '📋';
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