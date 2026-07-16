export * from './navigation';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

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

export interface ApiEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'CLOSED';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type IncidentCategory =
  | 'digital_arrest'
  | 'upi_fraud'
  | 'investment_scam'
  | 'counterfeit_currency'
  | 'loan_app'
  | 'sim_swap'
  | 'other';

export type EvidenceType = 'audio' | 'image' | 'video' | 'document' | 'chat' | 'link' | 'note';

export interface Evidence {
  id: string;
  type: EvidenceType;
  label: string;
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface CaseTimelineEvent {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  userId?: string;
  category?: IncidentCategory;
  riskLevel?: RiskLevel;
  location?: string;
  evidence?: Evidence[];
  timeline?: CaseTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseInput {
  title: string;
  description: string;
  category?: IncidentCategory;
  location?: string;
  riskLevel?: RiskLevel;
}

export type ThreatLevel = 'advisory' | 'elevated' | 'high' | 'critical';

export interface ThreatItem {
  id: string;
  title: string;
  category: IncidentCategory;
  level: ThreatLevel;
  region: string;
  summary: string;
  indicators: string[];
  updatedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  userId?: string;
  category?: 'case' | 'threat' | 'sos' | 'system';
  createdAt: string;
}

export interface AppSettings {
  emergencyContact: string;
  reduceMotion: boolean;
}
