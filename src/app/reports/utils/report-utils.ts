import { ReportCategory, ReportStatus } from '../models/report.model';

/**
 * Utilidades compartidas para reportes.
 * Centraliza lógica de iconos, etiquetas y clases CSS
 * para evitar duplicación entre componentes.
 */

/** Mapa de iconos por categoría (Bootstrap Icons classes) */
const CATEGORY_ICONS: Record<ReportCategory, string> = {
    [ReportCategory.INFRASTRUCTURE]: 'bi bi-cone-striped', // Infraestructura
    [ReportCategory.SECURITY]: 'bi bi-shield-lock-fill',    // Seguridad
    [ReportCategory.ENVIRONMENT]: 'bi bi-tree-fill',        // Medio Ambiente
    [ReportCategory.TRANSPORT]: 'bi bi-car-front-fill',     // Transporte
    [ReportCategory.OTHER]: 'bi bi-clipboard-data-fill'     // Otro
};

/** Mapa de etiquetas en español por categoría */
const CATEGORY_LABELS: Record<ReportCategory, string> = {
    [ReportCategory.INFRASTRUCTURE]: 'Infraestructura',
    [ReportCategory.SECURITY]: 'Seguridad',
    [ReportCategory.ENVIRONMENT]: 'Medio Ambiente',
    [ReportCategory.TRANSPORT]: 'Transporte',
    [ReportCategory.OTHER]: 'Otro'
};

/** Mapa de clases CSS de badge por estado (Bootstrap 5) */
const STATUS_BADGE_CLASSES: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'bg-warning text-dark',
    [ReportStatus.IN_PROGRESS]: 'bg-info text-white',
    [ReportStatus.RESOLVED]: 'bg-success text-white',
    [ReportStatus.CLOSED]: 'bg-secondary text-white'
};

/** Mapa de etiquetas en español por estado */
const STATUS_LABELS: Record<ReportStatus, string> = {
    [ReportStatus.PENDING]: 'Pendiente',
    [ReportStatus.IN_PROGRESS]: 'En Progreso',
    [ReportStatus.RESOLVED]: 'Resuelto',
    [ReportStatus.CLOSED]: 'Cerrado'
};

/**
 * Devuelve la clase del icono de Bootstrap para la categoría dada.
 * Ejemplo: 'bi bi-house-door'
 */
export function getCategoryIconClass(category: ReportCategory | string): string {
    return CATEGORY_ICONS[category as ReportCategory] ?? 'bi bi-question-circle';
}

export function getCategoryLabel(category: ReportCategory | string): string {
    return CATEGORY_LABELS[category as ReportCategory] ?? String(category);
}

export function getStatusBadgeClass(status: ReportStatus | string): string {
    return STATUS_BADGE_CLASSES[status as ReportStatus] ?? 'bg-secondary text-white';
}

export function getStatusLabel(status: ReportStatus | string): string {
    return STATUS_LABELS[status as ReportStatus] ?? String(status);
}

/**
 * Formatea una fecha al formato localizado de Perú.
 */
export function formatDate(date?: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
