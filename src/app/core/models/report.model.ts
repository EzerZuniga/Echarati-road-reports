export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type ReportCategory = 'POTHOLE' | 'LANDSLIDE' | 'FLOOD' | 'ACCIDENT' | 'ROADBLOCK' | 'OTHER';

export interface ReportLocation {
  lat: number;
  lng: number;
  address: string;
  district?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: ReportLocation;
  imageUrl?: string;
  citizenId: string;
  citizenName?: string; // desnormalizado para listados
  assignedTo?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  title: string;
  description: string;
  category: ReportCategory;
  location: ReportLocation;
  imageUrl?: string;
}

export interface UpdateReportStatusRequest {
  status: ReportStatus;
  adminNotes?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  category?: ReportCategory;
  search?: string;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DashboardMetrics {
  totalReports: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  byCategory: Record<ReportCategory, number>;
  recentReports: Report[];
}
