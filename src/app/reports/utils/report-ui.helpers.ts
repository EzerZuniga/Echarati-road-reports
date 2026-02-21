import { Report, ReportCategory, ReportStatus } from '../models/report.model';

/** Maps a ReportStatus to a CSS badge class. */
export function getStatusBadgeClass(status: ReportStatus): string {
  const classes: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'badge-warning',
    [ReportStatus.IN_PROGRESS]: 'badge-info',
    [ReportStatus.RESOLVED]: 'badge-success',
    [ReportStatus.CLOSED]: 'badge-secondary',
  };
  return classes[status] ?? 'badge-secondary';
}

/** Returns an emoji icon for a ReportCategory. */
export function getCategoryIcon(category: ReportCategory): string {
  const icons: Record<ReportCategory, string> = {
    [ReportCategory.INFRASTRUCTURE]: '🛠️',
    [ReportCategory.SECURITY]: '🚨',
    [ReportCategory.ENVIRONMENT]: '🌿',
    [ReportCategory.TRANSPORT]: '🚧',
    [ReportCategory.OTHER]: '📌',
  };
  return icons[category] ?? '📌';
}

/** Returns a human-readable Spanish label for a ReportCategory. */
export function getCategoryLabel(category: ReportCategory): string {
  const labels: Record<ReportCategory, string> = {
    [ReportCategory.INFRASTRUCTURE]: 'Infraestructura vial',
    [ReportCategory.SECURITY]: 'Seguridad vial',
    [ReportCategory.ENVIRONMENT]: 'Evento ambiental',
    [ReportCategory.TRANSPORT]: 'Transporte y tránsito',
    [ReportCategory.OTHER]: 'Otro',
  };
  return labels[category] ?? 'Otro';
}

/** Returns a human-readable Spanish label for a ReportStatus. */
export function getStatusLabel(status: ReportStatus): string {
  const labels: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'Pendiente',
    [ReportStatus.IN_PROGRESS]: 'En Progreso',
    [ReportStatus.RESOLVED]: 'Resuelto',
    [ReportStatus.CLOSED]: 'Cerrado',
  };
  return labels[status] ?? status;
}

/** Returns a human-readable label for a queued offline action. */
export function getPendingActionLabel(action?: string): string {
  const map: Record<string, string> = {
    create: 'Pendiente por enviar',
    update: 'Actualización pendiente',
    delete: 'Eliminación pendiente',
  };
  return action ? (map[action] ?? 'Pendiente') : '';
}

/** Returns true if the report was created offline and hasn't been synced yet. */
export function isOfflineReport(report: Report): boolean {
  return !!report.isOfflineEntry;
}
