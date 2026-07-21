export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';
export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'CLOSED';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type EvidenceType = 'audio' | 'image' | 'video' | 'document' | 'chat' | 'link' | 'note';
export type ThreatLevel = 'advisory' | 'elevated' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  district?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  label: string;
  reference: string;
  notes?: string;
  caseId?: string;
  createdAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
}

export interface Transcription {
  id: string;
  referenceId: string;
  caseId?: string;
  language?: string;
  text: string;
  confidence?: number;
  createdAt: string;
}

export interface Entity {
  id: string;
  type: string;
  value: string;
  context?: string;
  sourceId?: string;
  caseId?: string;
  createdAt: string;
}

export interface AIResult {
  id: string;
  provider: string;
  serviceType: string;
  inputRef?: string;
  caseId?: string;
  output: any;
  createdAt: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  userId?: string;
  category?: string;
  riskLevel?: RiskLevel;
  location?: string;
  evidence?: Evidence[];
  timeline?: CaseTimelineEvent[];
  transcriptions?: Transcription[];
  entities?: Entity[];
  aiResults?: AIResult[];
  createdAt: string;
  updatedAt: string;
}

export interface ThreatRecord {
  id: string;
  title: string;
  category: string;
  level: ThreatLevel;
  region: string;
  summary: string;
  indicators: string[];
  createdAt?: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  message: string;
  read: boolean;
  userId?: string;
  createdAt: string;
}

export interface ApiEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface HealthStatus {
  status: string;
}

export interface TimelineItem {
  id: string;
  type: 'case' | 'evidence' | 'status' | 'notification' | 'threat';
  title: string;
  detail: string;
  timestamp: string;
  caseId?: string;
  severity?: RiskLevel | ThreatLevel;
}

export interface GeoJsonPoint {
  type: 'Feature';
  id: string;
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: { label: string; category: string; severity: string; timestamp: string };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonPoint[];
}
