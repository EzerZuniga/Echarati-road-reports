import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListPageComponent } from './pages/report-list/report-list-page.component';
import { ReportFormPageComponent } from './pages/report-form/report-form-page.component';
import { ReportDetailPageComponent } from './pages/report-detail/report-detail-page.component';

@NgModule({
  declarations: [ReportListPageComponent, ReportFormPageComponent, ReportDetailPageComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, ReportsRoutingModule],
})
export class ReportsModule {}
