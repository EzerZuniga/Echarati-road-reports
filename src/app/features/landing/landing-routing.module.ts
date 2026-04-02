import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { LegalPageComponent } from './legal/legal-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'politica-de-privacidad',
    component: LegalPageComponent,
    data: { legalPageType: 'privacy' },
  },
  {
    path: 'terminos-de-uso',
    component: LegalPageComponent,
    data: { legalPageType: 'terms' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {}
