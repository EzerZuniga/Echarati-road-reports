import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Reportes', icon: 'assignment', route: '/admin/reports' },
  ];

  constructor(
    public auth: AuthService,
    private bp: BreakpointObserver
  ) {
    this.bp.observe([Breakpoints.Handset]).subscribe((res) => {
      this.isMobile = res.matches;
      if (this.sidenav) {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      }
    });
  }

  get userName(): string {
    const u = this.auth.currentUser;
    return u ? `${u.firstName} ${u.lastName}` : 'Admin';
  }

  logout(): void {
    this.auth.logout();
  }
}
