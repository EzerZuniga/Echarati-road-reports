import os

# ── admin-layout.component.html ────────────────────────────────────────────────
layout_html = """\
<mat-sidenav-container class="admin-container">

  <!-- ===== SIDENAV ===== -->
  <mat-sidenav #sidenav mode="side" opened class="admin-sidenav">

    <!-- Profile block at top -->
    <div class="sidenav-profile">
      <div class="sidenav-profile-avatar">
        {{ auth.currentUser?.firstName?.[0] }}{{ auth.currentUser?.lastName?.[0] }}
      </div>
      <div class="sidenav-profile-info">
        <span class="sidenav-profile-name">{{ userName }}</span>
        <span class="sidenav-profile-role">Administrador</span>
      </div>
    </div>

    <!-- Grouped navigation -->
    <nav class="sidenav-nav" aria-label="Navegacion principal">
      @for (group of navGroups; track group.label) {
        <div class="nav-group">
          <span class="nav-group-label">{{ group.label }}</span>
          @for (item of group.items; track item.route) {
            <a
              class="nav-item"
              [routerLink]="item.route"
              routerLinkActive="active"
              (click)="isMobile && sidenav.close()"
              [attr.aria-label]="item.label"
            >
              <mat-icon class="nav-item-icon" aria-hidden="true">{{ item.icon }}</mat-icon>
              <span class="nav-item-label">{{ item.label }}</span>
            </a>
          }
        </div>
      }
    </nav>

    <!-- Logout at bottom -->
    <div class="sidenav-footer">
      <mat-divider></mat-divider>
      <button mat-button class="sidenav-logout-btn" (click)="logout()" aria-label="Cerrar sesion">
        <mat-icon aria-hidden="true">logout</mat-icon>
        <span>Cerrar sesion</span>
      </button>
    </div>

  </mat-sidenav>

  <!-- ===== CONTENIDO ===== -->
  <mat-sidenav-content class="admin-content">

    <div class="admin-toolbar">
      @if (isMobile) {
        <button mat-icon-button (click)="sidenav.toggle()" aria-label="Abrir menu">
          <mat-icon>menu</mat-icon>
        </button>
      }
      <span class="toolbar-app-name">Echarati Road Reports</span>
      <span class="toolbar-spacer"></span>

      <button mat-button [matMenuTriggerFor]="adminMenu" class="toolbar-user-btn" aria-label="Menu de usuario">
        <div class="toolbar-avatar">
          {{ auth.currentUser?.firstName?.[0] }}{{ auth.currentUser?.lastName?.[0] }}
        </div>
        <span class="toolbar-user-name">{{ userName }}</span>
        <mat-icon>arrow_drop_down</mat-icon>
      </button>

      <mat-menu #adminMenu="matMenu">
        <div class="admin-menu-header" (click)="$event.stopPropagation()">
          <span class="admin-menu-name">{{ userName }}</span>
          <span class="admin-menu-role">Administrador</span>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar sesion
        </button>
      </mat-menu>
    </div>

    <div class="page-content">
      <router-outlet></router-outlet>
    </div>

  </mat-sidenav-content>
</mat-sidenav-container>
"""

path_html = r"c:\Users\jose\Desktop\PROYECTOS GIT\Echarati-road-reports\src\app\layouts\admin-layout\admin-layout.component.html"
with open(path_html, "w", encoding="utf-8") as f:
    f.write(layout_html)
print("admin-layout HTML OK")

# ── admin-layout.component.scss ────────────────────────────────────────────────
layout_scss = """\
// ==========================================
// ADMIN LAYOUT
// ==========================================

.admin-container {
  height: 100vh;
}

// ==========================================
// SIDENAV
// ==========================================
.admin-sidenav {
  width: 220px;
  background: linear-gradient(180deg, #0d2a1e 0%, #1a3d2b 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: none !important;
}

// --- Profile block ---
.sidenav-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.sidenav-profile-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gov-primary);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.sidenav-profile-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidenav-profile-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidenav-profile-role {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// --- Navigation ---
.sidenav-nav {
  flex: 1;
  padding: 12px 10px 0;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 10px 8px 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 9px;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
  position: relative;
  margin-bottom: 2px;

  &.active {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
    font-weight: 700;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px;
      bottom: 7px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: #fff;
    }

    .nav-item-icon {
      color: #fff;
    }
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.95);

    .nav-item-icon {
      color: rgba(255, 255, 255, 0.85);
    }
  }
}

.nav-item-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.15s;
  flex-shrink: 0;
}

.nav-item-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// --- Footer ---
.sidenav-footer {
  flex-shrink: 0;
  padding: 0 10px 12px;

  mat-divider {
    border-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;
  }
}

.sidenav-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6) !important;
  border-radius: 9px !important;
  font-size: 0.84rem !important;
  padding: 0 12px !important;
  height: 40px !important;
  justify-content: flex-start;

  mat-icon {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07) !important;
    color: rgba(255, 255, 255, 0.88) !important;
  }
}

// ==========================================
// TOOLBAR (white bar)
// ==========================================
.admin-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-bottom: 1px solid #e8edf2;
  padding: 0 20px;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.toolbar-app-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--gov-primary-dark);
  font-family: 'Raleway', sans-serif;
  white-space: nowrap;
}

.toolbar-spacer {
  flex: 1;
}

.toolbar-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gov-text) !important;
  border-radius: 24px !important;
  padding: 0 10px 0 4px !important;
  height: 40px !important;

  &:hover {
    background: var(--gov-bg) !important;
  }
}

.toolbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gov-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.toolbar-user-name {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gov-text);
}

// Dropdown menu
.admin-menu-header {
  display: flex;
  flex-direction: column;
  padding: 14px 18px;
  cursor: default;
  min-width: 180px;
}

.admin-menu-name {
  font-weight: 600;
  color: var(--gov-text);
  font-size: 0.9rem;
}

.admin-menu-role {
  font-size: 0.75rem;
  color: var(--gov-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-top: 2px;
}

// ==========================================
// CONTENT AREA
// ==========================================
.admin-content {
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 28px 24px;
  background: var(--gov-bg);
  min-height: calc(100vh - 60px);
}

// ==========================================
// RESPONSIVE
// ==========================================
@media (max-width: 768px) {
  .page-content {
    padding: 16px 12px;
  }

  .toolbar-user-name {
    display: none;
  }
}
"""

path_scss = r"c:\Users\jose\Desktop\PROYECTOS GIT\Echarati-road-reports\src\app\layouts\admin-layout\admin-layout.component.scss"
with open(path_scss, "w", encoding="utf-8") as f:
    f.write(layout_scss)
print("admin-layout SCSS OK")
