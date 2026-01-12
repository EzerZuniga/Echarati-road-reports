import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportFacadeService } from '../../services/report-facade.service';
import { Report, ReportCategory, ReportStatus } from '../../models/report.model';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  error = '';
  reportId?: number;

  categories = Object.values(ReportCategory);
  statuses = Object.values(ReportStatus);

  private readonly facade = inject(ReportFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly isOnline$ = this.facade.isOnline$;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: [ReportCategory.OTHER, Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      latitude: [''],
      longitude: [''],
      status: [ReportStatus.PENDING, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.reportId = +params['id'];
        this.loadReport();
      }
    });
  }

  loadReport(): void {
    if (!this.reportId) return;

    this.loading = true;
    this.facade.getReport(this.reportId).subscribe({
      next: (report) => {
        this.reportForm.patchValue(report);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte';
        this.loading = false;
        console.error(err);
      },
    });
  }

  get f() {
    return this.reportForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.reportForm.invalid) {
      return;
    }

    this.loading = true;
    const reportData: Report = this.reportForm.value;

    if (this.isEditMode && this.reportId) {
      this.facade.updateReport(this.reportId, reportData).subscribe({
        next: () => {
          this.router.navigate(['/reports', this.reportId]);
        },
        error: (err) => {
          this.error = 'Error al actualizar el reporte';
          this.loading = false;
          console.error(err);
        },
      });
    } else {
      this.facade.createReport(reportData).subscribe({
        next: (report) => {
          if (report.id) {
            this.router.navigate(['/reports', report.id]);
          } else {
            this.router.navigate(['/reports']);
          }
        },
        error: (err) => {
          this.error = 'Error al crear el reporte';
          this.loading = false;
          console.error(err);
        },
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.reportId) {
      this.router.navigate(['/reports', this.reportId]);
    } else {
      this.router.navigate(['/reports']);
    }
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
}
