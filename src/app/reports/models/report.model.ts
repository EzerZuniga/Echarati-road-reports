export enum ReportStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum ReportCategory {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SECURITY = 'SECURITY',
  ENVIRONMENT = 'ENVIRONMENT',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER'
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
}

export interface ReportFilter {
  category?: ReportCategory;
  status?: ReportStatus;
  startDate?: Date;
  endDate?: Date;
  location?: string;
}