import { motion } from 'framer-motion';
import { MapPin, Radio, ShieldCheck, Activity } from 'lucide-react';

const boundaries = [
  { icon: Radio, title: 'Real-time intelligence feed', copy: 'The advisory feed shows records supplied to the gateway for the current deployment in real-time.' },
  { icon: MapPin, title: 'Geospatial plotting', copy: 'Official locations are automatically parsed and plotted onto the secure intelligence map.' },
  { icon: ShieldCheck, title: 'Cryptographic verification', copy: 'All incidents are digitally signed to ensure origin authenticity and chain of custody.' },
  { icon: Activity, title: 'Live operational views', copy: 'Workspace monitors refresh autonomously from the API, enabling split-second command decisions.' },
];

export const ThreatMap = () => <section id="intelligence" className="relative w-full bg-[#03050A] py-32 border-t border-white/[0.02] overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05),transparent_50%)] pointer-events-none" />
  
  <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
    <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-16 items-center">
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="flex items-center gap-2 text-[10px] font-bold text-[#00E5FF] uppercase tracking-[0.15em] mb-4">
          <Activity size={14} /> Tactical Awareness
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          See the full picture.<br /><span className="text-gray-500">Act with certainty.</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.2 }} className="text-gray-400 font-medium leading-relaxed text-lg">
          Netrak provides unparalleled visibility into operations. From real-time mapping to cryptographic integrity checks, you have the intelligence needed to respond decisively.
        </motion.p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {boundaries.map(({ icon: Icon, title, copy }, index) => (
          <motion.div 
            key={title} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: index * 0.1 }} 
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-6 hover:border-[#00E5FF]/20 hover:bg-white/[0.05] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{copy}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>;
