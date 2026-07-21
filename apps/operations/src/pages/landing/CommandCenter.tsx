import { motion } from 'framer-motion';
import { Bell, ClipboardList, FileText, Search } from 'lucide-react';

export const CommandCenter = () => <section className="relative w-full bg-[#03050A] py-32 border-t border-white/[0.02]">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
    <div className="flex flex-col items-center md:items-start mb-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4"><ClipboardList size={14} className="text-[#00E5FF]" />Operations workspace</motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">A practical place to manage case work.<br /><span className="text-gray-500">Not an AI copilot.</span></motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.2 }} className="text-gray-400 font-medium leading-relaxed">Authorised officers and administrators can review cases, evidence references, notifications, and record-derived analytics in one browser workspace.</motion.p>
    </div>
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.2 }} className="rounded-2xl border border-white/[0.06] bg-[#0A0E17]/70 overflow-hidden shadow-2xl">
      <div className="h-14 border-b border-white/[0.05] px-6 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-white"><ClipboardList size={16} className="text-[#00E5FF]" />Case workspace</div><span className="text-[10px] font-mono text-gray-500">STATIC PRODUCT PREVIEW</span></div>
      <div className="grid lg:grid-cols-[13rem_1fr] min-h-[360px]">
        <aside className="hidden lg:flex flex-col gap-1 border-r border-white/[0.05] bg-black/20 p-5"><p className="mb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-gray-600">Available views</p><div className="rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-3 py-2 text-xs font-semibold text-[#00E5FF]">Case queue</div><div className="px-3 py-2 text-xs text-gray-500">Evidence explorer</div><div className="px-3 py-2 text-xs text-gray-500">Notifications</div></aside>
        <div className="p-6 md:p-8 grid gap-4 md:grid-cols-3">{[
          { icon: Search, title: 'Find a case', copy: 'Search, filter, and review records available to your role.' },
          { icon: FileText, title: 'Review references', copy: 'View the labels, types, and notes attached to each case.' },
          { icon: Bell, title: 'Follow updates', copy: 'Read notifications supplied by the connected gateway.' },
        ].map(({ icon: Icon, title, copy }) => <div key={title} className="rounded-xl border border-white/[0.06] bg-black/20 p-5"><Icon size={18} className="text-[#00E5FF]" /><h3 className="mt-8 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-gray-400">{copy}</p></div>)}</div>
      </div>
    </motion.div>
  </div>
</section>;
