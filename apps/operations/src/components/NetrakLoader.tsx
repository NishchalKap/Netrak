import { motion } from 'framer-motion';
import { BrandLogo } from './BrandLogo';

export const NetrakLoader = ({ message = "Establishing secure connection..." }: { message?: string }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#010204] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <div className="relative">
          {/* Pulsing rings */}
          <motion.div 
            animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#00E5FF]/30"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1.5], opacity: [0.8, 0, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-[#00E5FF]/20"
          />
          
          <BrandLogo size={64} />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[#00E5FF] font-mono text-xs uppercase tracking-[0.2em] font-bold">
              Netrak OS
            </span>
          </div>
          <p className="text-gray-500 text-sm font-mono tracking-wide">
            {message}
          </p>
        </div>

        {/* Cinematic loading bar */}
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent"
          />
        </div>
      </motion.div>
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};
