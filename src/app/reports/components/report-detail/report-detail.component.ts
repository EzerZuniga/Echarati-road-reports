import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportCategory, ReportStatus } from '../../models/report.model';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit {
  report?: Report;
  loading = true;
  error = '';

  statusOptions = Object.values(ReportStatus);

  private readonly facade = inject(ReportFacadeService);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadReport();
    this.facade.reports$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((reports) => {
      if (!this.report?.id) return;
      const updated = reports.find((item) => item.id === this.report?.id);
      if (updated) {
        this.report = updated;
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
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte';
        this.loading = false;
        console.error(err);
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
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado';
        this.loading = false;
        console.error(err);
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

  isOfflineReport(report?: Report): boolean {
    return !!report?.isOfflineEntry;
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
