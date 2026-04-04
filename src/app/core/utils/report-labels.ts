import { ReportStatus, ReportCategory } from '../models';

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  RESOLVED: 'Resuelto',
  REJECTED: 'Rechazado',
};

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  POTHOLE: 'Bache / Hueco',
  LANDSLIDE: 'Derrumbe',
  FLOOD: 'Inundación',
  ACCIDENT: 'Accidente vial',
  ROADBLOCK: 'Bloqueo de vía',
  OTHER: 'Otro',
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING: 'warn',
  IN_PROGRESS: 'primary',
  RESOLVED: 'accent',
  REJECTED: '',
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
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'RESOLVED', label: 'Resuelto' },
  { value: 'REJECTED', label: 'Rechazado' },
];

export const CATEGORY_OPTIONS: { value: ReportCategory | ''; label: string }[] = [
  { value: '', label: 'Todas las categorías' },
  { value: 'POTHOLE', label: 'Bache / Hueco' },
  { value: 'LANDSLIDE', label: 'Derrumbe' },
  { value: 'FLOOD', label: 'Inundación' },
  { value: 'ACCIDENT', label: 'Accidente vial' },
  { value: 'ROADBLOCK', label: 'Bloqueo de vía' },
  { value: 'OTHER', label: 'Otro' },
];

export const CATEGORY_FORM_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: 'POTHOLE', label: 'Bache / Hueco en la vía' },
  { value: 'LANDSLIDE', label: 'Derrumbe o deslizamiento' },
  { value: 'FLOOD', label: 'Inundación' },
  { value: 'ACCIDENT', label: 'Accidente vial' },
  { value: 'ROADBLOCK', label: 'Bloqueo de vía' },
  { value: 'OTHER', label: 'Otro' },
];
