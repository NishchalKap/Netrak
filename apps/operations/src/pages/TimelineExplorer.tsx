import { Clock3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, EmptyState, ErrorState, PageHeader, Pagination, RiskBadge, SearchField, Skeleton } from '@/components/ui';
import { useCases, useNotifications, useThreats } from '@/data/queries';
import { buildTimeline, formatDate, titleCase } from '@/lib/format';

const PAGE_SIZE = 20;
export function TimelineExplorer() {
  const cases = useCases(); const threats = useThreats(); const notifications = useNotifications(); const [search, setSearch] = useState(''); const [type, setType] = useState('ALL'); const [page, setPage] = useState(1);
  const items = useMemo(() => buildTimeline(cases.data ?? [], threats.data?.items ?? [], notifications.data ?? []).filter((item) => type === 'ALL' || item.type === type).filter((item) => `${item.title} ${item.detail} ${item.caseId ?? ''}`.toLowerCase().includes(search.toLowerCase())), [cases.data, notifications.data, search, threats.data, type]);
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE)); const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <><PageHeader eyebrow="Chronology" title="Operational timeline" description="A unified, timestamped view of case, evidence, threat and notification activity." /><Card><div className="toolbar"><SearchField value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search timeline entries" /><select value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} aria-label="Filter event type"><option value="ALL">All activity</option>{['case', 'evidence', 'status', 'threat', 'notification'].map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select></div>{cases.isLoading || threats.isLoading ? <Skeleton rows={9} /> : cases.isError ? <ErrorState error={cases.error} retry={() => void cases.refetch()} /> : visible.length === 0 ? <EmptyState icon={<Clock3 size={22} />} title="No timeline activity" description="Activity from documented Netrak records will appear here in chronological order." /> : <ol className="timeline timeline--explorer">{visible.map((item) => <li key={item.id}><i className={`timeline-type timeline-type--${item.type}`} /><div><span className="mono">{formatDate(item.timestamp)}</span><div><strong>{item.title}</strong>{item.severity && <RiskBadge value={item.severity} />}</div><p>{item.detail}</p>{item.caseId && <Link to={`/cases/${item.caseId}`}>Open case <span className="mono">{item.caseId}</span></Link>}</div></li>)}</ol>}<Pagination page={page} pages={pages} onChange={setPage} /></Card></>;
}
