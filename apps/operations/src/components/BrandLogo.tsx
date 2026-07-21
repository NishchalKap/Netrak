import { motion } from 'framer-motion';

export const BrandLogo = ({ size = 32, className = '' }: { size?: number; className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Core Shield / Eye Hybrid - precise geometric design */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <motion.path 
            d="M50 5 L90 25 L90 60 C90 85 60 95 50 95 C40 95 10 85 10 60 L10 25 L50 5 Z" 
            stroke="url(#gradient-outer)" 
            strokeWidth="4" 
            fill="rgba(0, 229, 255, 0.05)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path 
            d="M30 45 L50 25 L70 45 L50 80 Z" 
            fill="url(#gradient-inner)" 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
          />
          <circle cx="50" cy="45" r="6" fill="#03050A" />
          <defs>
            <linearGradient id="gradient-outer" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="1" stopColor="#0077FF" />
            </linearGradient>
            <linearGradient id="gradient-inner" x1="30" y1="25" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="1" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-extrabold tracking-tight text-white"
        style={{ fontSize: size * 0.65, lineHeight: 1 }}
      >
        Netrak
      </motion.span>
    </div>
  );
};
