import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { ReportCategory } from '../../../../core/models';
import { CATEGORY_FORM_OPTIONS } from '../../../../core/utils';

@Component({
  selector: 'app-report-form-page',
  templateUrl: './report-form-page.component.html',
  styleUrls: ['./report-form-page.component.scss'],
})
export class ReportFormPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  reportId?: string;
  private destroy$ = new Subject<void>();

  readonly categories = CATEGORY_FORM_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private api: ReportApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEdit = !!this.reportId && this.route.snapshot.url.some((s) => s.path === 'edit');

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [
        '',
        [Validators.required, Validators.minLength(20), Validators.maxLength(1000)],
      ],
      category: ['', Validators.required],
      address: ['', Validators.required],
      imageUrl: [''],
    });

    if (this.isEdit && this.reportId) {
      this.api
        .getById(this.reportId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((r) => {
          this.form.patchValue({ ...r, address: r.location.address });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }
  get descLen(): number {
    return this.f['description'].value?.length ?? 0;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload = {
      title: this.f['title'].value,
      description: this.f['description'].value,
      category: this.f['category'].value,
      imageUrl: this.f['imageUrl'].value || undefined,
      location: { lat: -12.3, lng: -72.8, address: this.f['address'].value },
    };

    const action$ =
      this.isEdit && this.reportId
        ? this.api.updateStatus(this.reportId, { status: 'pending' })
        : this.api.create(payload);

    action$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.snack.open(this.isEdit ? 'Reporte actualizado' : 'Reporte creado exitosamente', 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/reports', r.id]);
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al guardar el reporte', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
