import { Bell, FileSearch, Search, ShieldAlert, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, RiskBadge, Skeleton } from '@/components/ui';
import { useCases, useNotifications, useThreats } from '@/data/queries';
import { formatRelative, inferRisk } from '@/lib/format';
import { useModalFocus } from '@/hooks/useModalFocus';

export function GlobalSearch({ onClose }: { onClose: () => void }) {
  const dialogRef = useModalFocus(onClose);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const cases = useCases();
  const threats = useThreats();
  const notifications = useNotifications();
  const needle = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (needle.length < 2) return [];
    return [
      ...(cases.data ?? []).filter((item) => `${item.id} ${item.title} ${item.description} ${item.category ?? ''}`.toLowerCase().includes(needle)).slice(0, 6).map((item) => ({ id: `case-${item.id}`, type: 'Case', title: item.title, detail: item.id, route: `/cases/${item.id}`, severity: inferRisk(item), icon: <FileSearch size={17} /> })),
      ...(threats.data?.items ?? []).filter((item) => `${item.title} ${item.summary} ${item.category} ${item.region}`.toLowerCase().includes(needle)).slice(0, 5).map((item) => ({ id: `threat-${item.id}`, type: 'Threat', title: item.title, detail: `${item.region} · ${formatRelative(item.updatedAt)}`, route: `/intelligence?threat=${item.id}`, severity: item.level, icon: <ShieldAlert size={17} /> })),
      ...(notifications.data ?? []).filter((item) => item.message.toLowerCase().includes(needle)).slice(0, 4).map((item) => ({ id: `notification-${item.id}`, type: 'Notification', title: item.message, detail: formatRelative(item.createdAt), route: '/notifications', severity: undefined, icon: <Bell size={17} /> })),
    ];
  }, [cases.data, needle, notifications.data, threats.data]);
  const loading = cases.isLoading || threats.isLoading || notifications.isLoading;
  const open = (route: string) => { navigate(route); onClose(); };
  return <div className="command-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section ref={dialogRef} tabIndex={-1} className="command" role="dialog" aria-modal="true" aria-label="Global search"><header><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cases, evidence, threats and alerts" aria-label="Search Netrak" /><Button variant="ghost" onClick={onClose} aria-label="Close search"><X size={20} /></Button></header><div className="command__body">{loading && <Skeleton rows={4} />}{!loading && needle.length < 2 && <EmptyState icon={<Search size={22} />} title="Search the operational record" description="Enter at least two characters. Case IDs, titles, threat regions and alert content are indexed." />}{!loading && needle.length >= 2 && results.length === 0 && <EmptyState title="No matching records" description="Try a case ID, category, region, or a broader keyword." />}{results.map((result) => <button key={result.id} className="search-result" onClick={() => open(result.route)}><span className="search-result__icon">{result.icon}</span><span><small>{result.type}</small><strong>{result.title}</strong><em>{result.detail}</em></span>{result.severity && <RiskBadge value={result.severity} />}</button>)}</div><footer><span><kbd>Enter</kbd> open result</span><span><kbd>Esc</kbd> close</span></footer></section></div>;
}
