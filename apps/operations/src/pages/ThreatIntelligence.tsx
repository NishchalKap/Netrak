import { DatabaseBackup, LocateFixed, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, Card, EmptyState, ErrorState, PageHeader, RiskBadge, SearchField, SectionHeader, Skeleton } from '@/components/ui';
import { useThreats } from '@/data/queries';
import { formatDate, formatRelative, titleCase } from '@/lib/format';

export function ThreatIntelligence() {
  const query = useThreats();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('ALL');
  const items = useMemo(
    () => (query.data?.items ?? [])
      .filter((item) => level === 'ALL' || item.level === level)
      .filter((item) => `${item.title} ${item.summary} ${item.category} ${item.region} ${item.indicators.join(' ')}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [level, query.data, search]
  );
  const selected = items.find((item) => item.id === params.get('threat')) ?? items[0];

  return <>
    <PageHeader
      eyebrow="Intelligence"
      title="Threat advisories"
      description="Review advisory records supplied by the configured gateway. Validate provenance and date before operational action."
      actions={query.data && <Badge tone={query.data.source === 'online' ? 'success' : 'warning'}>{query.data.source === 'online' ? 'Gateway feed' : 'Cached copy'}</Badge>}
    />
    <div className="intelligence-layout">
      <Card className="intelligence-list">
        <div className="toolbar toolbar--stack">
          <SearchField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search advisories and indicators" />
          <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter threat level">
            <option value="ALL">All levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="elevated">Elevated</option>
            <option value="advisory">Advisory</option>
          </select>
        </div>
        {query.isLoading ? <Skeleton rows={7} /> : query.isError ? (
          <ErrorState error={query.error} retry={() => void query.refetch()} />
        ) : items.length === 0 ? (
          <EmptyState title="No configured advisories" description="No advisory records match this view. Production feeds must be provisioned by the deployment owner." />
        ) : (
          <div className="threat-list">
            {items.map((item) => (
              <button key={item.id} className={selected?.id === item.id ? 'active' : ''} onClick={() => setParams({ threat: item.id })}>
                <div><span>{item.category}</span><strong>{item.title}</strong><p>{item.summary}</p></div>
                <div><RiskBadge value={item.level} /><small>{formatRelative(item.updatedAt)}</small></div>
              </button>
            ))}
          </div>
        )}
      </Card>
      <Card className="intelligence-detail">
        {!selected ? (
          <EmptyState icon={<ShieldAlert size={22} />} title="No advisory selected" description="Choose a configured advisory to inspect its indicators." />
        ) : <>
          <div className="detail-hero">
            <span className="eyebrow">{selected.category}</span>
            <h2>{selected.title}</h2>
            <p>{selected.summary}</p>
            <div><RiskBadge value={selected.level} /><Badge><LocateFixed size={13} /> {selected.region}</Badge></div>
          </div>
          <dl className="fact-list fact-list--horizontal">
            <div><dt>Advisory ID</dt><dd className="mono">{selected.id}</dd></div>
            <div><dt>Last updated</dt><dd className="mono">{formatDate(selected.updatedAt)}</dd></div>
            <div><dt>Classification</dt><dd>{titleCase(selected.level)}</dd></div>
          </dl>
          <SectionHeader title="Supplied indicators" description="Signals returned by the threat API. They are guidance, not proof or an AI determination." />
          {selected.indicators.length === 0 ? (
            <EmptyState title="No indicators supplied" description="This advisory does not contain structured indicators." />
          ) : <div className="indicator-list">{selected.indicators.map((indicator) => <span className="mono" key={indicator}>{indicator}</span>)}</div>}
          <div className="source-note">
            <DatabaseBackup size={18} />
            <div>
              <strong>{query.data?.source === 'cached' ? 'Offline advisory copy' : 'Configured gateway feed'}</strong>
              <p>{query.data?.source === 'cached' ? `Last synchronized ${formatDate(query.data.syncedAt)}.` : 'Data is read from the documented threat endpoints; provenance is owned by the deployment.'}</p>
            </div>
          </div>
        </>}
      </Card>
    </div>
  </>;
}
