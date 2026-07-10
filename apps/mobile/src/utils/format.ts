import { CaseStatus, IncidentCategory, RiskLevel, ThreatLevel } from '@/types';

const titleCase = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getStatusLabel(status: CaseStatus) {
  return titleCase(status.toLowerCase());
}

export function getIncidentCategoryLabel(category?: IncidentCategory) {
  return category ? titleCase(category) : 'General Fraud';
}

export function getRiskLabel(level?: RiskLevel) {
  return level ? titleCase(level) : 'Medium';
}

export function getThreatLabel(level: ThreatLevel) {
  return titleCase(level);
}

export function makeLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
