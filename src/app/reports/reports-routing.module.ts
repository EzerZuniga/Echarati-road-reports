import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ReportFormComponent } from './components/report-form/report-form.component';
import { ReportDetailComponent } from './components/report-detail/report-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent
  },
  {
    path: 'new',
    component: ReportFormComponent
  },
  {
    path: ':id',
    component: ReportDetailComponent
  },
  {
    path: ':id/edit',
    component: ReportFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }