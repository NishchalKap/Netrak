import { ArrowRight, BellRing, BriefcaseBusiness, CircleAlert, RadioTower, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, EmptyState, ErrorState, MetricCard, PageHeader, RiskBadge, SectionHeader, Skeleton } from '@/components/ui';
import { useCases, useHealth, useNotifications, useThreats } from '@/data/queries';
import { formatRelative, inferRisk, titleCase } from '@/lib/format';
import { ROUTES } from '@/app/routes';

export function OfficerDashboard() {
  const cases = useCases();
  const threats = useThreats();
  const notifications = useNotifications();
  const health = useHealth();
  if (cases.isLoading && threats.isLoading) return <><PageHeader eyebrow="Operational overview" title="Today’s signal" /><Skeleton rows={8} /></>;
  if (cases.isError && threats.isError) return <ErrorState error={cases.error} retry={() => { void cases.refetch(); void threats.refetch(); }} />;

  const caseItems = cases.data ?? [];
  const threatItems = threats.data?.items ?? [];
  const active = caseItems.filter((item) => item.status !== 'CLOSED');
  const riskRank = { critical: 4, high: 3, medium: 2, low: 1 };
  const priority = [...active].sort((a, b) => riskRank[inferRisk(b)] - riskRank[inferRisk(a)] || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const criticalThreats = threatItems.filter((item) => item.level === 'critical' || item.level === 'high');
  const unread = (notifications.data ?? []).filter((item) => !item.read);
  const updatedAt = Math.max(cases.dataUpdatedAt, threats.dataUpdatedAt, notifications.dataUpdatedAt);
  const syncLabel = updatedAt ? formatRelative(new Date(updatedAt).toISOString()) : 'pending';

  return <>
    <PageHeader eyebrow="Operational overview" title="Today’s signal" description="Current records returned by Netrak services, ordered for rapid review." actions={<span className="sync-label"><i /> Updated {syncLabel}</span>} />
    <div className="metric-grid">
      <MetricCard label="Active cases" value={active.length} detail={`${caseItems.filter((item) => item.status === 'ESCALATED').length} escalated`} icon={<BriefcaseBusiness size={19} />} />
      <MetricCard label="Priority advisories" value={criticalThreats.length} detail={`${threatItems.length} advisories returned`} icon={<CircleAlert size={19} />} />
      <MetricCard label="Unread alerts" value={unread.length} detail={`${notifications.data?.length ?? 0} total notifications`} icon={<BellRing size={19} />} />
      <MetricCard label="API service" value={health.data?.status ? titleCase(health.data.status) : health.isError ? 'Unavailable' : 'Checking'} detail="Gateway health endpoint" icon={<RadioTower size={19} />} />
    </div>
    <div className="dashboard-grid">
      <Card className="span-8">
        <SectionHeader title="Priority case queue" description="Open investigations ranked by reported risk, with a deterministic metadata fallback when risk is absent." action={<Link to={ROUTES.dashboard.cases} className="text-link">Open queue <ArrowRight size={16} /></Link>} />
        {priority.length === 0 ? <EmptyState title="No active cases" description="New reports will appear here when they enter the case service." /> : (
          <div className="record-list">{priority.map((item) => (
            <Link to={ROUTES.dashboard.case(item.id)} className="record-row" key={item.id}>
              <div className="record-row__marker"><ShieldCheck size={17} /></div>
              <div><small className="mono">{item.id}</small><strong>{item.title}</strong><p>{item.description}</p></div>
              <div><RiskBadge value={inferRisk(item)} /><span>{formatRelative(item.updatedAt)}</span></div>
            </Link>
          ))}</div>
        )}
      </Card>
      <Card className="span-4">
        <SectionHeader title="Advisory posture" description={threats.data?.source === 'cached' ? `Cached copy · synced ${formatRelative(threats.data.syncedAt)}` : 'Configured gateway advisory feed'} />
        {criticalThreats.length === 0 ? <EmptyState title="No elevated advisories" description="No high or critical advisory is present in the selected feed." /> : (
          <div className="compact-list">{criticalThreats.slice(0, 5).map((item) => <Link to={`${ROUTES.dashboard.intelligence}?threat=${item.id}`} key={item.id}><div><strong>{item.title}</strong><span>{item.region}</span></div><RiskBadge value={item.level} /></Link>)}</div>
        )}
        <Link to={ROUTES.dashboard.intelligence} className="button button--secondary button--block">Review advisories</Link>
      </Card>
      <Card className="span-12">
        <SectionHeader title="Recent operational notifications" description="Records returned by the existing notification service." action={<Link to={ROUTES.dashboard.notifications} className="text-link">View all <ArrowRight size={16} /></Link>} />
        {unread.length === 0 ? <EmptyState title="You are up to date" description="No unread operational notification is present." /> : (
          <div className="alert-strip">{unread.slice(0, 4).map((item) => <article key={item.id}><BellRing size={18} /><div><strong>{item.message}</strong><span>{formatRelative(item.createdAt)}</span></div></article>)}</div>
        )}
      </Card>
    </div>
  </>;
}
