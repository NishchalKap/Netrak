export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  district?: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'CLOSED';

export type EvidenceType = 'audio' | 'image' | 'video' | 'document' | 'chat' | 'link' | 'note';

export interface Evidence {
  id: string;
  type: EvidenceType;
  label: string;
  reference: string;
  notes?: string;
  caseId: string;
  createdAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  title: string;
  detail: string;
  caseId: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  category?: string;
  riskLevel?: string;
  location?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  evidence?: Evidence[];
  timeline?: CaseTimelineEvent[];
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface Threat {
  id: string;
  title: string;
  category: string;
  level: string;
  region: string;
  summary: string;
  indicators: string[];
  updatedAt: string;
  createdAt: string;
}

export interface HealthStatus {
  status: 'UP' | string;
  timestamp?: string;
}

export interface ApiResponse<T = unknown> {
  status: 'success';
  message: string;
  data: T;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: ApiErrorDetail[];
}

export interface ValidationError extends ApiError {
  errors: ApiErrorDetail[];
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RefreshRequest {
  token: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  district?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface CaseCreateRequest {
  title: string;
  description: string;
  category?: string;
  riskLevel?: string;
  location?: string;
}

export interface CaseUpdateRequest {
  title?: string;
  description?: string;
  status?: CaseStatus;
}

export interface EvidenceCreateRequest {
  type: EvidenceType;
  label: string;
  reference: string;
  notes?: string;
}

export interface NotificationCreateRequest {
  message: string;
  userId: string;
}

export interface AuthTokenData {
  token: string;
  user: User;
}

export interface RefreshTokenData {
  token: string;
}

export interface ForgotPasswordData {
  queued: boolean;
}

export type LoginResponse = ApiResponse<AuthTokenData>;

export type RegisterResponse = ApiResponse<AuthTokenData>;

export type RefreshResponse = ApiResponse<RefreshTokenData>;

export type GetProfileResponse = ApiResponse<User>;

export type ProfileUpdateResponse = ApiResponse<User>;

export type ForgotPasswordResponse = ApiResponse<ForgotPasswordData>;

export type GetCasesResponse = ApiResponse<Case[]>;

export type CaseCreateResponse = ApiResponse<Case>;

export type GetCaseByIdResponse = ApiResponse<Case>;

export type CaseUpdateResponse = ApiResponse<Case>;

export type EvidenceCreateResponse = ApiResponse<Evidence>;

export type GetNotificationsResponse = ApiResponse<Notification[]>;

export type NotificationCreateResponse = ApiResponse<Notification>;

export type GetThreatsResponse = ApiResponse<Threat[]>;

export type GetThreatByIdResponse = ApiResponse<Threat>;

export type HealthResponse = ApiResponse<HealthStatus>;
