import { Activity, Building2, FileClock, Flag, KeyRound, RadioTower, UsersRound } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { CapabilityNotice, Card, MetricCard, PageHeader, SectionHeader, Skeleton } from '@/components/ui';
import { useHealth } from '@/data/queries';
import { useAuth } from '@/features/auth/AuthContext';
import { titleCase } from '@/lib/format';

const capabilities = [
  { icon: UsersRound, title: 'User management', text: 'List, invite, suspend and inspect platform users.', endpoint: 'No documented users endpoint' },
  { icon: KeyRound, title: 'Roles & permissions', text: 'Configure operational policies and role boundaries.', endpoint: 'No documented permission endpoint' },
  { icon: Building2, title: 'Departments', text: 'Manage agencies, districts and organizational ownership.', endpoint: 'No documented organization endpoint' },
  { icon: FileClock, title: 'Audit logs', text: 'Search immutable access and mutation events.', endpoint: 'No documented audit endpoint' },
  { icon: Flag, title: 'Feature flags', text: 'Stage and safely roll out operational capabilities.', endpoint: 'No documented configuration endpoint' },
];
export function AdminPortal() {
  const { user } = useAuth(); const health = useHealth();
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <><PageHeader eyebrow="Platform control" title="Administration" description="System health and explicit capability boundaries for authorized administrators." /><div className="metric-grid"><MetricCard label="Gateway status" value={health.isLoading ? 'Checking' : health.isError ? 'Unavailable' : titleCase(health.data?.status)} detail="Documented /health service" icon={<RadioTower size={19} />} /><MetricCard label="Authentication" value="Connected" detail="Current session validated" icon={<KeyRound size={19} />} /><MetricCard label="Realtime transport" value="Not configured" detail="No documented stream contract" icon={<Activity size={19} />} /></div>{health.isLoading && <Skeleton rows={3} />}<Card><SectionHeader title="Administrative capabilities" description="Unavailable controls remain non-interactive until their API contracts exist." /><div className="admin-capabilities">{capabilities.map(({ icon: Icon, title, text, endpoint }) => <article key={title}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p><small>{endpoint}</small></div></article>)}</div></Card><CapabilityNotice title="Administration is intentionally non-destructive">The existing Swagger specification exposes profile and health services, but not platform user, role, department, audit, template, or feature-flag APIs. Netrak does not persist unofficial admin state in the browser.</CapabilityNotice></>;
}
