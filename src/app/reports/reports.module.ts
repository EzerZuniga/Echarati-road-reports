import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';

@NgModule({
  declarations: [
    ReportListComponent,
    ReportFormComponent,
    ReportDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }