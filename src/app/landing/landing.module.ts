import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import {
  HeroLightningBoltSolid,
  HeroChartSquareBarSolid,
  HeroSpeakerphoneSolid,
  HeroShieldCheckSolid,
  HeroSparklesSolid,
  HeroUserGroupSolid,
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
      HeroLightningBoltSolid,
      HeroChartSquareBarSolid,
      HeroSpeakerphoneSolid,
      HeroShieldCheckSolid,
      HeroSparklesSolid,
      HeroUserGroupSolid,
    }),
  ],
})
export class LandingModule {}
