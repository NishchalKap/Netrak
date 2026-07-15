import { ArrowUpDown, Plus, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, DataTable, Dialog, EmptyState, ErrorState, Field, PageHeader, Pagination, RiskBadge, SearchField, Skeleton } from '@/components/ui';
import { useCaseActions, useCases } from '@/data/queries';
import { formatDate, inferRisk, titleCase } from '@/lib/format';
import { getErrorMessage } from '@/lib/apiClient';
import type { CaseStatus } from '@/types';

const PAGE_SIZE = 10;
export function CaseQueue() {
  const query = useCases(); const { createCase } = useCaseActions();
  const [search, setSearch] = useState(''); const [status, setStatus] = useState('ALL'); const [sort, setSort] = useState<'updated' | 'risk'>('updated'); const [page, setPage] = useState(1); const [dialog, setDialog] = useState(false); const [formError, setFormError] = useState('');
  const filtered = useMemo(() => (query.data ?? []).filter((item) => status === 'ALL' || item.status === status).filter((item) => `${item.id} ${item.title} ${item.description} ${item.category ?? ''}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'updated' ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() : ({ critical: 4, high: 3, medium: 2, low: 1 }[inferRisk(b)] - { critical: 4, high: 3, medium: 2, low: 1 }[inferRisk(a)])), [query.data, search, sort, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setFormError(''); const data = new FormData(event.currentTarget);
    try { await createCase.mutateAsync({ title: String(data.get('title')), description: String(data.get('description')) }); setDialog(false); }
    catch (error) { setFormError(getErrorMessage(error)); }
  };
  return <><PageHeader eyebrow="Investigations" title="Case queue" description="Triage, prioritize and enter the complete investigation record." actions={<Button onClick={() => setDialog(true)}><Plus size={17} /> New case</Button>} />
    <Card><div className="toolbar"><SearchField value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search case ID, title or category" aria-label="Search cases" /><label className="select-control"><SlidersHorizontal size={16} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by status"><option value="ALL">All statuses</option>{(['OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'] as CaseStatus[]).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}</select></label><Button variant="secondary" onClick={() => setSort((value) => value === 'updated' ? 'risk' : 'updated')}><ArrowUpDown size={16} /> Sort: {sort === 'updated' ? 'Recently updated' : 'Highest risk'}</Button></div>
    {query.isLoading ? <Skeleton rows={7} /> : query.isError ? <ErrorState error={query.error} retry={() => void query.refetch()} /> : visible.length === 0 ? <EmptyState title="No cases match this view" description="Clear the search or status filter, or create a new case from a verified report." /> : <><DataTable headers={['Case', 'Status', 'Risk', 'Evidence', 'Last updated']} >{visible.map((item) => <tr key={item.id}><td><Link className="table-primary" to={`/cases/${item.id}`}><strong>{item.title}</strong><span className="mono">{item.id}</span></Link></td><td><RiskBadge value={item.status} /></td><td><RiskBadge value={inferRisk(item)} /></td><td>{item.evidence?.length ?? 0}</td><td className="mono table-date">{formatDate(item.updatedAt)}</td></tr>)}</DataTable><Pagination page={page} pages={pages} onChange={setPage} /></>}</Card>
    {dialog && <Dialog title="Create investigation" description="Only fields supported by the current case API are collected." onClose={() => setDialog(false)}><form className="dialog-form" onSubmit={submit}><Field label="Case title"><input name="title" required minLength={3} placeholder="Concise incident summary" /></Field><Field label="Initial report"><textarea name="description" required minLength={10} rows={5} placeholder="Record the verified facts available at intake." /></Field>{formError && <div className="form-error">{formError}</div>}<div className="form-actions"><Button type="button" variant="ghost" onClick={() => setDialog(false)}>Cancel</Button><Button type="submit" disabled={createCase.isPending}>{createCase.isPending ? 'Creating…' : 'Create case'}</Button></div></form></Dialog>}
  </>;
}
