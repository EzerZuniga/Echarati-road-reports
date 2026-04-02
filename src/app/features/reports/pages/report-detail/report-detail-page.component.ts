import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportApiService } from '../../../../core/services/report-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Report, ReportStatus } from '../../../../core/models';
import { getStatusLabel, getCategoryLabel } from '../../../../core/utils';

@Component({
  selector: 'app-report-detail-page',
  templateUrl: './report-detail-page.component.html',
  styleUrls: ['./report-detail-page.component.scss'],
})
export class ReportDetailPageComponent implements OnInit, OnDestroy {
  report?: Report;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ReportApiService,
    public auth: AuthService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.report = r;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/reports']);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusLabel(status: ReportStatus): string {
    return getStatusLabel(status);
  }

  getCategoryLabel(cat: string): string {
    return getCategoryLabel(cat);
  }
}
