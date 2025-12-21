import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { Report, ReportStatus } from '../../models/report.model';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  report?: Report;
  loading = true;
  error = '';
  
  statusOptions = Object.values(ReportStatus);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.error = 'ID de reporte no válido';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.reportService.getReport(+id).subscribe({
      next: (report) => {
        this.report = report;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateStatus(newStatus: ReportStatus): void {
    if (!this.report || !this.report.id) return;
    
    this.loading = true;
    this.reportService.updateReport(this.report.id, { status: newStatus }).subscribe({
      next: (updatedReport) => {
        this.report = updatedReport;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteReport(): void {
    if (!this.report || !this.report.id) return;
    
    if (confirm('¿Está seguro de que desea eliminar este reporte? Esta acción no se puede deshacer.')) {
      this.reportService.deleteReport(this.report.id).subscribe({
        next: () => {
          this.router.navigate(['/reports']);
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

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'INFRASTRUCTURE': '🏗️',
      'SECURITY': '👮',
      'ENVIRONMENT': '🌿',
      'TRANSPORT': '🚗',
      'OTHER': '📋'
    };
    return icons[category] || '📋';
  }

  getFormattedDate(date?: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}