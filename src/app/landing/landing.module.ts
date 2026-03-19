import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroBoltSolid,
  heroChartBarSquareSolid,
  heroMegaphoneSolid,
  heroShieldCheckSolid,
  heroSparklesSolid,
  heroUserGroupSolid,
} from '@ng-icons/heroicons/solid';
import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    RouterModule,
    LandingRoutingModule,
    NgIconsModule.withIcons({
      heroBoltSolid,
      heroChartBarSquareSolid,
      heroMegaphoneSolid,
      heroShieldCheckSolid,
      heroSparklesSolid,
      heroUserGroupSolid,
    }),
  ],
})
export class LandingModule {}
