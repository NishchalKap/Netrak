import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Search, X } from 'lucide-react';
import { memo, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { getErrorMessage } from '@/lib/apiClient';
import { titleCase } from '@/lib/format';
import { useModalFocus } from '@/hooks/useModalFocus';

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`button button--${variant} ${className}`} {...props} />;
}
export function Card({ children, className = '', interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return <section className={`card ${interactive ? 'card--interactive' : ''} ${className}`}>{children}</section>;
}
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
export const RiskBadge = memo(function RiskBadge({ value }: { value?: string }) {
  const normalized = value?.toLowerCase() ?? 'unclassified';
  const tone = normalized === 'critical' || normalized === 'high' || normalized === 'escalated' ? 'danger' : normalized === 'medium' || normalized === 'elevated' || normalized === 'in progress' ? 'warning' : normalized === 'low' || normalized === 'closed' ? 'success' : 'neutral';
  return <Badge tone={tone}>{titleCase(value)}</Badge>;
});
export const MetricCard = memo(function MetricCard({ label, value, detail, icon }: { label: string; value: ReactNode; detail?: string; icon?: ReactNode }) {
  return <Card className="metric"><div className="metric__top"><span>{label}</span>{icon}</div><strong>{value}</strong>{detail && <small>{detail}</small>}</Card>;
});
export function EmptyState({ title, description, action, icon = <Inbox size={22} /> }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return <div className="empty-state"><div className="empty-state__icon">{icon}</div><h3>{title}</h3><p>{description}</p>{action}</div>;
}
export function ErrorState({ error, retry }: { error: unknown; retry?: () => void }) {
  return <div className="error-state" role="alert"><AlertTriangle size={20} /><div><strong>We could not load this view.</strong><p>{getErrorMessage(error)}</p>{retry && <Button variant="secondary" onClick={retry}>Retry</Button>}</div></div>;
}
export function Skeleton({ rows = 4 }: { rows?: number }) {
  return <div className="skeleton" role="status" aria-label="Loading content" aria-live="polite">{Array.from({ length: rows }, (_, index) => <span key={index} />)}</div>;
}
export function SearchField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <label className="search-field"><Search size={17} /><input type="search" {...props} /></label>;
}
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function SectionHeader({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return <div className="section-header"><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{icon}<div><h2>{title}</h2>{description && <p>{description}</p>}</div></div>{action}</div>;
}
export function CapabilityNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="capability-notice"><AlertTriangle size={18} /><div><strong>{title}</strong><p>{children}</p></div></div>;
}
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return <nav className="pagination" aria-label="Pagination"><Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={18} /></Button><span>Page {page} of {pages}</span><Button variant="ghost" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={18} /></Button></nav>;
}
export function Dialog({ title, description, children, onClose }: { title: string; description?: string; children: ReactNode; onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useModalFocus(onClose);
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section ref={dialogRef} tabIndex={-1} className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}><header><div><h2 id={titleId}>{title}</h2>{description && <p>{description}</p>}</div><Button variant="ghost" onClick={onClose} aria-label="Close dialog"><X size={20} /></Button></header>{children}</section></div>;
}
export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
