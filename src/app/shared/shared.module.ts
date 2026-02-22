import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { ConnectivityBannerComponent } from './components/connectivity-banner/connectivity-banner.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoginModalComponent,
    ConnectivityBannerComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent,
    ConnectivityBannerComponent,
  ],
})
export class SharedModule {}
