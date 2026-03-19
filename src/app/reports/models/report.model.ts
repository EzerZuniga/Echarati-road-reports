export enum ReportStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ReportCategory {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SECURITY = 'SECURITY',
  ENVIRONMENT = 'ENVIRONMENT',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
}

export interface Report {
  id?: number;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  latitude?: number;
  longitude?: number;
  status: ReportStatus;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  userName?: string;
  photos?: string[];
  isOfflineEntry?: boolean;
  pendingAction?: QueuedReportActionType;
}

export interface ReportFilter {
  category?: ReportCategory;
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
  location?: string;
}

export type QueuedReportActionType = 'create' | 'update' | 'delete';

export interface QueuedReportOperation {
  id: string;
  type: QueuedReportActionType;
  payload: Partial<Report>;
  targetId?: number;
  createdAt: string;
}
