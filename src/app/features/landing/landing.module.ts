import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { LegalPageComponent } from './legal/legal-page.component';

@NgModule({
  declarations: [LandingPageComponent, LegalPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    LandingRoutingModule,
  ],
})
export class LandingModule {}
