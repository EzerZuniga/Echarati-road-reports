import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportCategory, ReportStatus, ReportFilter } from '../../models/report.model';
import {
  getStatusBadgeClass,
  getCategoryIcon,
  getCategoryLabel,
  getPendingActionLabel,
  isOfflineReport,
} from '../../utils/report-ui.helpers';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportListComponent implements OnInit {
  private readonly facade = inject(ReportFacadeService);

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

  // Delegate UI helpers to shared utilities
  readonly getStatusBadgeClass = getStatusBadgeClass;
  readonly getCategoryIcon = getCategoryIcon;
  readonly getCategoryLabel = getCategoryLabel;
  readonly getPendingActionLabel = getPendingActionLabel;
  readonly isOfflineReport = isOfflineReport;

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const filter: ReportFilter = {
      category: this.categoryFilter(),
      status: this.statusFilter(),
    };
    this.facade.loadReports(filter);
    this.currentPage.set(1);
  }

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
          console.error(err);
        },
      });
    }
  }
}

