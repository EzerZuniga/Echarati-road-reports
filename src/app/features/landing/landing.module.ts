import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingPageComponent } from './landing-page.component';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [CommonModule, RouterModule, MaterialModule, LandingRoutingModule],
})
export class LandingModule {}
