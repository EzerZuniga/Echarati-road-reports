import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { ReportsManagementPageComponent } from './pages/reports-management/reports-management-page.component';

@NgModule({
  declarations: [DashboardPageComponent, ReportsManagementPageComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, AdminRoutingModule],
})
export class AdminModule {}
