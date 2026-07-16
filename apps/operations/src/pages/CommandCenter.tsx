import { Activity, Building2, CircleAlert, RadioTower, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CapabilityNotice, Card, EmptyState, ErrorState, MetricCard, PageHeader, RiskBadge, SectionHeader, Skeleton } from '@/components/ui';
import { useCases, useHealth, useNotifications, useThreats } from '@/data/queries';
import { formatRelative, inferRisk, titleCase } from '@/lib/format';

export function CommandCenter() {
  const cases = useCases();
  const threats = useThreats();
  const notifications = useNotifications();
  const health = useHealth();
  if (cases.isLoading || threats.isLoading) return <Skeleton rows={10} />;
  if (cases.isError) return <ErrorState error={cases.error} retry={() => void cases.refetch()} />;

  const active = (cases.data ?? []).filter((item) => item.status !== 'CLOSED');
  const severe = active.filter((item) => ['critical', 'high'].includes(inferRisk(item)));
  const contexts = Object.entries(
    (threats.data?.items ?? []).reduce<Record<string, number>>(
      (map, threat) => ({ ...map, [threat.region]: (map[threat.region] ?? 0) + 1 }),
      {}
    )
  ).sort((a, b) => b[1] - a[1]);

  return <>
    <PageHeader eyebrow="Operational coordination" title="Command center" description="A high-level picture assembled only from current case, advisory, notification, and service-health records." actions={<span className="sync-label"><i /> Polling every 60 seconds</span>} />
    <div className="metric-grid">
      <MetricCard label="Open investigations" value={active.length} detail={`${severe.length} high-priority signals`} icon={<Activity size={19} />} />
      <MetricCard label="Escalated" value={active.filter((item) => item.status === 'ESCALATED').length} detail="Workflow state from case service" icon={<CircleAlert size={19} />} />
      <MetricCard label="Advisory contexts" value={contexts.length} detail="Location labels supplied by advisories" icon={<Building2 size={19} />} />
      <MetricCard label="Gateway" value={health.data?.status ? titleCase(health.data.status) : 'Unavailable'} detail={health.isError ? 'Health check failed' : 'Health endpoint responding'} icon={<RadioTower size={19} />} />
    </div>
    <div className="dashboard-grid">
      <Card className="span-8">
        <SectionHeader title="Cases requiring command attention" description="Active records with high or critical reported or deterministic fallback risk." />
        {severe.length === 0 ? <EmptyState title="No high-priority cases" description="The current case set contains no active high or critical risk signals." /> : (
          <div className="record-list">{severe.slice(0, 8).map((item) => (
            <Link className="record-row" to={`/cases/${item.id}`} key={item.id}>
              <div className="record-row__marker"><ShieldCheck size={17} /></div>
              <div><small className="mono">{item.id}</small><strong>{item.title}</strong><p>{item.location || 'Location not supplied'}</p></div>
              <div><RiskBadge value={inferRisk(item)} /><span>{formatRelative(item.updatedAt)}</span></div>
            </Link>
          ))}</div>
        )}
      </Card>
      <Card className="span-4">
        <SectionHeader title="Advisory distribution" description="Context labels represented in the configured gateway feed." />
        {contexts.length === 0 ? <EmptyState title="No advisory contexts" description="The gateway has not returned advisory context labels." /> : (
          <div className="distribution-list">{contexts.slice(0, 8).map(([context, count]) => (
            <div key={context}><span>{context}</span><div><i style={{ width: `${Math.max(12, count / contexts[0][1] * 100)}%` }} /></div><strong>{count}</strong></div>
          ))}</div>
        )}
      </Card>
      <Card className="span-12">
        <SectionHeader title="Operational notifications" description="Most recent records returned by the notification service." />
        {(notifications.data ?? []).length === 0 ? <EmptyState title="No notifications" description="The notification service returned no records." /> : (
          <div className="alert-strip">{(notifications.data ?? []).slice(0, 4).map((item) => (
            <article key={item.id}><Activity size={18} /><div><strong>{item.message}</strong><span>{formatRelative(item.createdAt)}</span></div></article>
          ))}</div>
        )}
      </Card>
    </div>
    <CapabilityNotice title="Realtime command channels are not configured">The backend exposes request-response APIs but no WebSocket or server-sent event contract. This view uses transparent 60-second polling and never presents simulated live activity.</CapabilityNotice>
  </>;
}
