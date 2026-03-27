/**
 * Re-exporta desde la fuente única de verdad.
 * Este archivo se mantiene por compatibilidad con los pipes
 * que ya lo importan; toda la lógica vive en report-utils.ts.
 */
export {
  getCategoryIcon,
  getCategoryLabel,
  getStatusBadgeClass,
  getStatusLabel,
  getPendingActionLabel,
  isOfflineReport,
} from './report-utils';
