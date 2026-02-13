import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportCategory, ReportStatus, ReportFilter } from '../../models/report.model';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportListComponent implements OnInit {
  private readonly facade = inject(ReportFacadeService);
  private readonly destroyRef = inject(DestroyRef);

  // Facade Signals
  readonly reports = toSignal(this.facade.reports$, { initialValue: [] as Report[] });
  readonly loading = toSignal(this.facade.loading$, { initialValue: true });
  readonly error = toSignal(this.facade.error$, { initialValue: '' });
  readonly isOnline = toSignal(this.facade.isOnline$, { initialValue: true });

  // Local State Signals
  readonly searchTerm = signal('');
  readonly categoryFilter = signal<ReportCategory | undefined>(undefined);
  readonly statusFilter = signal<ReportStatus | undefined>(undefined);
  readonly currentPage = signal(1);
  readonly itemsPerPage = 10;

  // Computed State
  readonly filteredReports = computed(() => {
    const reports = this.reports();
    const term = this.searchTerm().toLowerCase();

    // Server-side filtered by category/status via loadReports,
    // but client-side filtered by search term
    if (!term) return reports;

    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term) ||
        report.location.toLowerCase().includes(term)
    );
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredReports().length / this.itemsPerPage)
  );

  readonly paginatedReports = computed(() => {
    const reports = this.filteredReports();
    const page = this.currentPage();
    const start = (page - 1) * this.itemsPerPage;
    return reports.slice(start, start + this.itemsPerPage);
  });

  // Reference data
  readonly categories = this.facade.getCategories();
  readonly statuses = this.facade.getStatuses();

  ngOnInit(): void {
    // Initial load
    this.loadReports();
  }

  loadReports(): void {
    // Construct filter object from signals for the facade
    const filter: ReportFilter = {
      category: this.categoryFilter(),
      status: this.statusFilter(),
    };
    this.facade.loadReports(filter);
    this.currentPage.set(1); // Reset to first page on reload/re-filter
  }

  // Event Handlers
  onFilterChange(): void {
    this.loadReports();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.categoryFilter.set(undefined);
    this.statusFilter.set(undefined);
    this.searchTerm.set('');
    this.loadReports();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  deleteReport(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este reporte?')) {
      this.facade.deleteReport(id).subscribe({
        error: (err) => {
          // Ideally handle error via a toast service or facade error subject
          console.error(err);
        },
      });
    }
  }

  // Helpers for UI
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
}
