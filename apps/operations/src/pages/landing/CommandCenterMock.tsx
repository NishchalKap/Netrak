import { ClipboardList, FileText, ShieldCheck } from 'lucide-react';

const panels = [
  { icon: ClipboardList, label: 'Case records', detail: 'Review reports, case status, and timeline entries.' },
  { icon: FileText, label: 'Evidence references', detail: 'Keep links, labels, types, and notes with the case.' },
  { icon: ShieldCheck, label: 'Advisory context', detail: 'View threat advisories configured for this deployment.' },
];

export const CommandCenterMock = () => <div className="w-full rounded-2xl border border-white/[0.08] bg-[#050810]/90 shadow-[0_32px_128px_rgba(0,0,0,0.8),0_0_64px_rgba(0,229,255,0.05)] overflow-hidden relative">
  <div className="h-12 border-b border-white/[0.06] bg-white/[0.01] flex items-center px-5 justify-between"><div className="flex items-center gap-2 text-[11px] font-mono text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> netrak / operations</div><span className="text-[10px] font-mono text-gray-600">WORKSPACE PREVIEW</span></div>
  <div className="grid md:grid-cols-[11rem_1fr] min-h-[380px] bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.08),transparent_50%)]">
    <aside className="hidden md:flex flex-col gap-2 border-r border-white/[0.06] bg-black/25 p-5"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">Workspace</p><div className="rounded-lg border border-[#00E5FF]/20 bg-[#00E5FF]/10 px-3 py-2 text-xs font-semibold text-[#00E5FF]">Case queue</div><div className="px-3 py-2 text-xs text-gray-500">Evidence</div><div className="px-3 py-2 text-xs text-gray-500">Advisories</div></aside>
    <div className="p-6 md:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00E5FF]">Netrak operations</p><h3 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-white">Designed for clear, accountable case work.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">The operations workspace presents records from the connected gateway. It does not claim live monitoring, AI inference, or national-scale coverage.</p><div className="mt-7 grid gap-3 sm:grid-cols-3">{panels.map(({ icon: Icon, label, detail }) => <div key={label} className="rounded-xl border border-white/[0.07] bg-black/30 p-4"><Icon size={16} className="text-[#00E5FF]" /><p className="mt-5 text-sm font-semibold text-white">{label}</p><p className="mt-2 text-[11px] leading-relaxed text-gray-500">{detail}</p></div>)}</div></div>
  </div>
</div>;
