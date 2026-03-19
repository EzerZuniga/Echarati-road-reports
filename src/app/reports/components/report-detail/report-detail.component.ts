import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { Report, ReportStatus } from '../../models/report.model';
import { getCategoryIconClass, getCategoryLabel, getStatusBadgeClass, getStatusLabel, formatDate } from '../../utils/report-utils';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit, OnDestroy {
  report?: Report;
  loading = true;
  error = '';

  statusOptions = Object.values(ReportStatus);

  // Utilidades compartidas
  getCategoryIconClass = getCategoryIconClass;
  getCategoryLabel = getCategoryLabel;
  getStatusBadgeClass = getStatusBadgeClass;
  getStatusLabel = getStatusLabel;
  formatDate = formatDate;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReport(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'ID de reporte no válido.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.reportService.getReport(+id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el reporte. Verifique que existe.';
        this.loading = false;
      }
    });
  }

  updateStatus(newStatus: ReportStatus): void {
    if (!this.report?.id || newStatus === this.report.status) return;

    this.loading = true;
    this.reportService.updateReport(this.report.id, { status: newStatus }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedReport) => {
        this.report = updatedReport;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al actualizar el estado.';
        this.loading = false;
      }
    });
  }

  deleteReport(): void {
    if (!this.report?.id) return;

    if (confirm('¿Está seguro de que desea eliminar este reporte? Esta acción no se puede deshacer.')) {
      this.reportService.deleteReport(this.report.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => this.router.navigate(['/reports']),
        error: () => {
          this.error = 'Error al eliminar el reporte.';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }
}