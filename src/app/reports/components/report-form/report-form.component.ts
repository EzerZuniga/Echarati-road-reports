import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { Report, ReportCategory, ReportStatus } from '../../models/report.model';
import { getCategoryIconClass, getCategoryLabel, getStatusLabel } from '../../utils/report-utils';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit, OnDestroy {
  reportForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  error = '';
  reportId?: number;

  categories = Object.values(ReportCategory);
  statuses = Object.values(ReportStatus);

  // Utilidades compartidas
  getCategoryIconClass = getCategoryIconClass;
  getCategoryLabel = getCategoryLabel;
  getStatusLabel = getStatusLabel;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.reportForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: [ReportCategory.OTHER, Validators.required],
      location: ['', [Validators.required, Validators.minLength(5)]],
      latitude: [null],
      longitude: [null],
      status: [ReportStatus.PENDING, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.reportId = +params['id'];
        this.loadReport();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReport(): void {
    if (!this.reportId) return;

    this.loading = true;
    this.reportService.getReport(this.reportId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (report) => {
        this.reportForm.patchValue(report);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el reporte.';
        this.loading = false;
      }
    });
  }

  get f() { return this.reportForm.controls; }

  get descriptionLength(): number {
    return this.f['description'].value?.length || 0;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.reportForm.invalid) return;

    this.loading = true;
    const reportData: Report = this.reportForm.value;

    const operation$ = this.isEditMode && this.reportId
      ? this.reportService.updateReport(this.reportId, reportData)
      : this.reportService.createReport(reportData);

    operation$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        const targetId = this.isEditMode ? this.reportId : result.id;
        this.router.navigate(['/reports', targetId]);
      },
      error: () => {
        this.error = this.isEditMode
          ? 'Error al actualizar el reporte.'
          : 'Error al crear el reporte.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.reportId) {
      this.router.navigate(['/reports', this.reportId]);
    } else {
      this.router.navigate(['/reports']);
    }
  }
}