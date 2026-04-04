import os

# ── dashboard-page.component.html ─────────────────────────────────────────────
dashboard_html = """\
<div class="page-container">

  <!-- ===== WELCOME HERO ===== -->
  <header class="welcome-hero">
    <div class="welcome-hero-left">
      <div class="welcome-avatar">{{ initials }}</div>
      <div>
        <p class="greeting-text">{{ greeting }}, <strong>{{ userName }}</strong></p>
        <h1 class="page-title">Panel de Administracion</h1>
        <p class="page-date">
          <mat-icon class="date-icon" aria-hidden="true">today</mat-icon>
          {{ today | date: "EEEE d 'de' MMMM, y" }}
        </p>
      </div>
    </div>
    <a mat-flat-button color="primary" routerLink="/admin/reports" class="manage-btn">
      <mat-icon>table_chart</mat-icon>
      Gestionar reportes
    </a>
  </header>

  <!-- ===== SKELETON ===== -->
  @if (loading) {
    <div class="skeleton-section" aria-label="Cargando..." aria-busy="true">
      <div class="overview-card skeleton-card">
        <div class="sk-rings-row">
          @for (i of skeletonItems; track i) {
            <div class="sk-ring skeleton"></div>
          }
        </div>
        <div class="sk-chart skeleton"></div>
      </div>
      <div class="skeleton sk-table"></div>
    </div>
  } @else if (error) {
    <div class="error-state" role="alert">
      <div class="error-icon-wrap"><mat-icon>cloud_off</mat-icon></div>
      <h3>No se pudo cargar el dashboard</h3>
      <p>Verifica tu conexion o que el servidor este disponible.</p>
      <button mat-flat-button color="primary" (click)="load()">
        <mat-icon>refresh</mat-icon> Reintentar
      </button>
    </div>
  } @else if (metrics) {

    <!-- ===== OVERVIEW CARD (rings + mini chart) ===== -->
    <div class="overview-card">

      <div class="overview-body">

        <!-- Ring KPIs (left) -->
        <div class="rings-area" role="list" aria-label="Metricas de reportes">
          @for (card of statCards; track card.key) {
            <div class="ring-wrap" role="listitem">
              <div
                class="ring"
                [style.--fill]="getPercent(getMetricValue(card.key)) + '%'"
                [style.--clr]="card.color"
                role="img"
                [attr.aria-label]="card.label + ': ' + getMetricValue(card.key)"
              >
                <div class="ring-inner">
                  <span class="ring-num">{{ getMetricValue(card.key) }}</span>
                </div>
              </div>
              <span class="ring-label">{{ card.label | uppercase }}</span>
            </div>
          }
        </div>

        <!-- Vertical divider -->
        <div class="overview-vdivider" aria-hidden="true"></div>

        <!-- Mini bar chart (right) — categories -->
        <div class="mini-chart" aria-label="Reportes por categoria">
          <div class="mini-chart-bars">
            @for (entry of categoryEntries; track entry.key) {
              <div class="mini-bar-col">
                <span class="mini-bar-value">{{ entry.count }}</span>
                <div class="mini-bar-track">
                  <div
                    class="mini-bar"
                    [style.height.%]="(entry.count / maxCategoryCount) * 100"
                    [style.background]="entry.color"
                    [matTooltip]="entry.label + ': ' + entry.count"
                    role="img"
                    [attr.aria-label]="entry.label + ': ' + entry.count"
                  ></div>
                </div>
                <span class="mini-bar-lbl">{{ entry.key | slice:0:3 }}</span>
              </div>
            }
          </div>
          <div class="mini-chart-footer">CATEGORIAS / REPORTES</div>
        </div>

      </div>

      <!-- Footer with total -->
      <mat-divider></mat-divider>
      <div class="overview-footer">
        <mat-icon aria-hidden="true">info_outline</mat-icon>
        <span class="overview-total-text">
          TOTAL &nbsp;&bull;&nbsp; <strong>{{ metrics.totalReports }}</strong> reportes ciudadanos registrados
        </span>
        <span class="footer-spacer"></span>
        <a mat-stroked-button routerLink="/admin/reports" class="overview-cta">
          Ver todos <mat-icon iconPositionEnd>arrow_forward</mat-icon>
        </a>
      </div>

    </div>

    <!-- ===== CONTENT GRID ===== -->
    <div class="content-grid">

      <!-- Category breakdown panel -->
      <mat-card class="panel-card">
        <mat-card-header>
          <mat-card-title class="panel-title">
            <mat-icon aria-hidden="true">donut_small</mat-icon>
            Por Categoria
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (categoryEntries.length === 0) {
            <div class="empty-panel">
              <mat-icon>bar_chart</mat-icon>
              <p>Sin datos de categorias</p>
            </div>
          } @else {
            <ul class="cat-list" aria-label="Reportes por categoria">
              @for (entry of categoryEntries; track entry.key) {
                <li class="cat-row">
                  <div class="cat-icon-wrap" [style.background]="entry.color + '26'">
                    <mat-icon [style.color]="entry.color" aria-hidden="true">{{ entry.icon }}</mat-icon>
                  </div>
                  <div class="cat-info">
                    <div class="cat-meta">
                      <span class="cat-name">{{ entry.label }}</span>
                      <span class="cat-count">
                        <strong>{{ entry.count }}</strong>
                        <span class="cat-pct">{{ entry.percent }}%</span>
                      </span>
                    </div>
                    <div class="cat-bar-track" role="progressbar"
                         [attr.aria-valuenow]="entry.percent" aria-valuemin="0" aria-valuemax="100">
                      <div class="cat-bar-fill"
                           [style.width.%]="entry.percent"
                           [style.background]="entry.color"></div>
                    </div>
                  </div>
                </li>
              }
            </ul>
          }
        </mat-card-content>
      </mat-card>

      <!-- Recent reports table -->
      <mat-card class="panel-card">
        <mat-card-header>
          <mat-card-title class="panel-title">
            <mat-icon aria-hidden="true">receipt_long</mat-icon>
            Reportes Recientes
          </mat-card-title>
          <a mat-stroked-button routerLink="/admin/reports" class="panel-link-btn">
            Ver todos <mat-icon iconPositionEnd>arrow_forward</mat-icon>
          </a>
        </mat-card-header>
        <mat-card-content>
          @if (metrics.recentReports.length === 0) {
            <div class="empty-panel">
              <mat-icon>inbox</mat-icon>
              <p>No hay reportes recientes</p>
            </div>
          } @else {
            <div class="table-scroll">
              <table mat-table [dataSource]="metrics.recentReports" class="reports-table">

                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Reporte</th>
                  <td mat-cell *matCellDef="let r">
                    <div class="report-title-cell">
                      <span class="report-title">{{ r.title }}</span>
                      <span class="report-citizen">
                        <mat-icon aria-hidden="true">person</mat-icon>
                        {{ r.citizenName ?? 'Ciudadano' }}
                      </span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categoria</th>
                  <td mat-cell *matCellDef="let r" class="category-cell">
                    {{ getCategoryLabel(r.category) }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let r">
                    <span class="status-chip" [attr.data-status]="r.status">
                      {{ getStatusLabel(r.status) }}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef>Fecha</th>
                  <td mat-cell *matCellDef="let r" class="date-cell">
                    {{ r.createdAt | date: 'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns"
                    [routerLink]="['/admin/reports']"
                    class="clickable-row"
                    tabindex="0" role="link"
                    [attr.aria-label]="'Ver ' + row.title">
                </tr>
              </table>
            </div>
          }
        </mat-card-content>
      </mat-card>

    </div>
  }

</div>
"""

path_html = r"c:\Users\jose\Desktop\PROYECTOS GIT\Echarati-road-reports\src\app\features\admin\pages\dashboard\dashboard-page.component.html"
with open(path_html, "w", encoding="utf-8") as f:
    f.write(dashboard_html)
print("dashboard HTML OK")
