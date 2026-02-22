import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportStatus } from '../../models/report.model';
import {
  getStatusBadgeClass,
  getCategoryIcon,
  getCategoryLabel,
  isOfflineReport,
} from '../../utils/report-ui.helpers';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDetailComponent implements OnInit {
  report?: Report;
  loading = true;
  error = '';

  statusOptions = Object.values(ReportStatus);

  private readonly facade = inject(ReportFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  // Delegate UI helpers to shared utilities
  readonly getStatusBadgeClass = getStatusBadgeClass;
  readonly getCategoryIcon = getCategoryIcon;
  readonly getCategoryLabel = getCategoryLabel;
  readonly isOfflineReport = isOfflineReport;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReport();
    this.facade.reports$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((reports) => {
      if (!this.report?.id) return;
      const updated = reports.find((item) => item.id === this.report?.id);
      if (updated) {
        this.report = updated;
        this.cdr.markForCheck();
      }
    });
  }

  loadReport(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'ID de reporte no válido';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.facade.getReport(+id).subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte';
        this.loading = false;
        console.error(err);
        this.cdr.markForCheck();
      },
    });
  }

  updateStatus(newStatus: ReportStatus): void {
    if (!this.report || !this.report.id) return;

    this.loading = true;
    this.facade.updateReport(this.report.id, { status: newStatus }).subscribe({
      next: (updatedReport) => {
        this.report = updatedReport;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado';
        this.loading = false;
        console.error(err);
        this.cdr.markForCheck();
      },
    });
  }

  deleteReport(): void {
    if (!this.report || !this.report.id) return;

    if (
      confirm('¿Está seguro de que desea eliminar este reporte? Esta acción no se puede deshacer.')
    ) {
      this.facade.deleteReport(this.report.id).subscribe({
        next: () => {
          this.router.navigate(['/reports']);
        },
        error: (err) => {
          this.error = 'Error al eliminar el reporte';
          console.error(err);
        },
      });
    }
  }

  getFormattedDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
