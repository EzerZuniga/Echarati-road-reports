import { ReportStatus, ReportCategory } from '../models';

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
  rejected: 'Rechazado',
};

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  road_damage: 'Daño en vía',
  lighting: 'Alumbrado',
  waste: 'Residuos',
  water: 'Agua / Saneamiento',
  security: 'Seguridad',
  other: 'Otro',
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: 'warn',
  in_progress: 'primary',
  resolved: 'accent',
  rejected: '',
};

export function getStatusLabel(status: ReportStatus | string): string {
  return STATUS_LABELS[status as ReportStatus] ?? status;
}

export function getCategoryLabel(category: ReportCategory | string): string {
  return CATEGORY_LABELS[category as ReportCategory] ?? category;
}

export function getStatusColor(status: ReportStatus): string {
  return STATUS_COLORS[status] ?? '';
}

export const STATUS_OPTIONS: { value: ReportStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved', label: 'Resuelto' },
  { value: 'rejected', label: 'Rechazado' },
];

export const CATEGORY_OPTIONS: { value: ReportCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'road_damage', label: 'Daño en vía' },
  { value: 'lighting', label: 'Alumbrado' },
  { value: 'waste', label: 'Residuos' },
  { value: 'water', label: 'Agua / Saneamiento' },
  { value: 'security', label: 'Seguridad' },
  { value: 'other', label: 'Otro' },
];

export const CATEGORY_FORM_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: 'road_damage', label: 'Daño en vía pública' },
  { value: 'lighting', label: 'Alumbrado público' },
  { value: 'waste', label: 'Residuos / Basura' },
  { value: 'water', label: 'Agua y Saneamiento' },
  { value: 'security', label: 'Seguridad ciudadana' },
  { value: 'other', label: 'Otro' },
];
