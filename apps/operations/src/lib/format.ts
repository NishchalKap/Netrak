import type { CaseRecord, GeoJsonFeatureCollection, RiskLevel, TimelineItem, ThreatRecord, NotificationRecord } from '@/types';

export function formatDate(value?: string) {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatRelative(value?: string) {
  if (!value) return 'Unknown';
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour');
  return formatter.format(Math.round(hours / 24), 'day');
}

export function titleCase(value?: string) {
  if (!value) return 'Unclassified';
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function inferRisk(item: CaseRecord): RiskLevel {
  if (item.riskLevel) return item.riskLevel;
  const value = `${item.title} ${item.description}`.toLowerCase();
  if (value.includes('emergency') || value.includes('arrest') || value.includes('threat')) return 'critical';
  if (value.includes('upi') || value.includes('transfer') || value.includes('account')) return 'high';
  return item.status === 'ESCALATED' ? 'high' : 'medium';
}

export function buildTimeline(cases: CaseRecord[], threats: ThreatRecord[], notifications: NotificationRecord[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const caseItem of cases) {
    items.push({ id: `case-${caseItem.id}`, type: 'case', title: 'Case created', detail: caseItem.title, timestamp: caseItem.createdAt, caseId: caseItem.id, severity: inferRisk(caseItem) });
    for (const event of caseItem.timeline ?? []) items.push({ id: `event-${event.id}`, type: 'status', title: event.title, detail: event.detail, timestamp: event.createdAt, caseId: caseItem.id });
    for (const evidence of caseItem.evidence ?? []) items.push({ id: `evidence-${evidence.id}`, type: 'evidence', title: 'Evidence added', detail: evidence.label, timestamp: evidence.createdAt, caseId: caseItem.id });
  }
  for (const threat of threats) items.push({ id: `threat-${threat.id}`, type: 'threat', title: threat.title, detail: threat.summary, timestamp: threat.updatedAt, severity: threat.level });
  for (const notification of notifications) items.push({ id: `notification-${notification.id}`, type: 'notification', title: 'Notification', detail: notification.message, timestamp: notification.createdAt });
  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function toGeoJson(cases: CaseRecord[]): GeoJsonFeatureCollection {
  const features = cases.flatMap((caseItem) => {
    const candidate = caseItem as CaseRecord & { coordinates?: [number, number] };
    if (!candidate.coordinates || candidate.coordinates.length !== 2) return [];
    return [{
      type: 'Feature' as const,
      id: caseItem.id,
      geometry: { type: 'Point' as const, coordinates: candidate.coordinates },
      properties: { label: caseItem.title, category: caseItem.category ?? 'other', severity: inferRisk(caseItem), timestamp: caseItem.updatedAt },
    }];
  });
  return { type: 'FeatureCollection', features };
}

export function safeReference(reference: string) {
  try {
    const url = new URL(reference);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
