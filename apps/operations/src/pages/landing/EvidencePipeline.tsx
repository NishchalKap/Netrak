import { motion } from 'framer-motion';
import { ClipboardList, FileText, Network, ShieldCheck } from 'lucide-react';

const steps = [
  { icon: ClipboardList, label: 'Case report', title: 'Start with the details that matter.', copy: 'Reports capture the incident description, category, location text, and the risk level provided by the reporter.' },
  { icon: Network, label: 'Case timeline', title: 'Keep the investigation legible.', copy: 'Case updates and evidence timestamps form a clear record for the people managing the workflow.' },
  { icon: FileText, label: 'Evidence references', title: 'Link to approved systems.', copy: 'Netrak stores evidence metadata and references. It does not transfer or claim custody of files in this release.' },
];

export const EvidencePipeline = () => <section id="platform" className="relative w-full bg-[#03050A] py-32 border-t border-white/[0.02]">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
    <div className="flex flex-col items-center md:items-start mb-16 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4"><Network size={14} className="text-[#00E5FF]" />Case workflow</motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6">From report to case context.<br /><span className="text-gray-500">Without inventing the story.</span></motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.2 }} className="text-gray-400 font-medium leading-relaxed">Netrak v1.0 records reports, case activity, and evidence references so teams can work from the information a deployment actually has.</motion.p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map(({ icon: Icon, label, title, copy }, index) => <motion.article key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: index * 0.12 }} className="rounded-2xl border border-white/[0.06] bg-[#0A0E17]/70 p-7 shadow-2xl">
        <div className="w-11 h-11 rounded-xl border border-[#00E5FF]/20 bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]"><Icon size={19} /></div>
        <p className="mt-8 text-[10px] font-bold tracking-[0.16em] uppercase text-gray-500">{label}</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{copy}</p>
        {index === 2 && <div className="mt-6 flex items-center gap-2 text-xs text-[#00E5FF]"><ShieldCheck size={14} />Metadata and references only</div>}
      </motion.article>)}
    </div>
  </div>
</section>;
