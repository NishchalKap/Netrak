import { Bell, CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, EmptyState, ErrorState, PageHeader, SearchField, Skeleton } from '@/components/ui';
import { useNotifications } from '@/data/queries';
import { formatDate } from '@/lib/format';

export function NotificationsPage() {
  const query = useNotifications(); const [search, setSearch] = useState(''); const [filter, setFilter] = useState('ALL');
  const items = useMemo(() => (query.data ?? []).filter((item) => filter === 'ALL' || (filter === 'UNREAD' ? !item.read : item.read)).filter((item) => item.message.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [filter, query.data, search]);
  return <><PageHeader eyebrow="Operational inbox" title="Notifications" description="Alerts delivered by the Netrak notification service." /><Card><div className="toolbar"><SearchField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notifications" /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter notifications"><option value="ALL">All notifications</option><option value="UNREAD">Unread</option><option value="READ">Read</option></select></div>{query.isLoading ? <Skeleton rows={7} /> : query.isError ? <ErrorState error={query.error} retry={() => void query.refetch()} /> : items.length === 0 ? <EmptyState icon={<CheckCheck size={22} />} title="Nothing requires attention" description="No notifications match the selected view." /> : <div className="notification-feed">{items.map((item) => <article className={item.read ? '' : 'unread'} key={item.id}><span><Bell size={18} /></span><div><p>{item.message}</p><time className="mono">{formatDate(item.createdAt)}</time></div>{!item.read && <i aria-label="Unread" />}</article>)}</div>}</Card><p className="page-footnote">Notification read state is displayed exactly as returned by the backend. No read mutation endpoint is currently documented.</p></>;
}
