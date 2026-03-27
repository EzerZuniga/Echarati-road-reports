import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListPageComponent } from './pages/report-list/report-list-page.component';
import { ReportFormPageComponent } from './pages/report-form/report-form-page.component';
import { ReportDetailPageComponent } from './pages/report-detail/report-detail-page.component';

const routes: Routes = [
  { path: '', component: ReportListPageComponent },
  { path: 'new', component: ReportFormPageComponent },
  { path: ':id', component: ReportDetailPageComponent },
  { path: ':id/edit', component: ReportFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
