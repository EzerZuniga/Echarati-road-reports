import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import {
  HeroArrowRightSolid,
  HeroBadgeCheckSolid,
  HeroDocumentSearchSolid,
  HeroExclamationSolid,
  HeroLockClosedSolid,
  HeroLocationMarkerSolid,
  HeroShieldCheckSolid,
  HeroUserSolid,
} from '@ng-icons/heroicons/solid';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    NgIconsModule.withIcons({
      HeroArrowRightSolid,
      HeroBadgeCheckSolid,
      HeroDocumentSearchSolid,
      HeroExclamationSolid,
      HeroLockClosedSolid,
      HeroLocationMarkerSolid,
      HeroShieldCheckSolid,
      HeroUserSolid,
    }),
  ],
})
export class AuthModule {}
