import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/material.module';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

@NgModule({
  declarations: [MainLayoutComponent, AdminLayoutComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [MainLayoutComponent, AdminLayoutComponent],
})
export class LayoutsModule {}
