import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ChevronRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { BrandLogo } from '@/components/BrandLogo';
import { CommandCenterMock } from './CommandCenterMock';

export const Hero = () => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const mockY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return <section ref={containerRef} className="relative min-h-screen bg-[#03050A] overflow-hidden flex flex-col pt-24 pb-16">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at top, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 40%, transparent 70%)' }} />
    <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-[#00E5FF] blur-[160px] rounded-full mix-blend-screen pointer-events-none" />
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[30%] right-[-10%] w-[50%] h-[70%] bg-blue-600 blur-[180px] rounded-full mix-blend-screen pointer-events-none" />

    <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[#03050A]/60 backdrop-blur-2xl border-b border-white/[0.05]">
      <BrandLogo size={24} />
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase">
          <a href="#platform" className="hover:text-white transition-colors">Platform</a>
          <a href="#intelligence" className="hover:text-white transition-colors">Advisories</a>
          <a href="#company" className="hover:text-white transition-colors">About</a>
        </div>
        <Link to={user ? '/dashboard' : '/login'} className="group flex items-center justify-center h-8 px-5 text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 hover:border-[#00E5FF]/50 rounded-full transition-all shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]">{user ? 'Go to workspace' : 'Sign in'}</Link>
      </div>
    </motion.nav>

    <motion.div style={{ opacity, scale }} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 mt-12 md:mt-24 flex-1 flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-8">
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5 text-[#A5F3FC] text-[10px] font-bold tracking-[0.15em] uppercase mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.1)]"><ShieldAlert size={14} className="text-[#00E5FF]" /> Next-Gen Public Safety</motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
          <span className="text-white drop-shadow-lg">A smarter way</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700">to fight cybercrime.</span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="text-lg md:text-xl text-gray-400 max-w-xl mb-12 leading-relaxed font-medium">Netrak unites citizens and agencies in a highly secure, real-time workspace. Report incidents seamlessly and track investigations with unprecedented clarity.</motion.p>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link to={user ? '/dashboard' : '/login'} className="group flex items-center justify-center gap-2 h-14 px-8 text-sm font-bold text-black bg-[#00E5FF] hover:bg-[#4DFFFF] rounded-full transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.5)]">
            Sign in to Operations 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#platform" className="flex items-center justify-center gap-2 h-14 px-8 text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full transition-colors backdrop-blur-md">
            See how it works 
            <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-12 max-w-md text-xs leading-relaxed text-gray-500 text-center lg:text-left">Citizen accounts are created via <span className="text-gray-400">Netrak Mobile</span>. Operations access requires deployment administrator provisioning.</motion.p>
      </div>

      <motion.div style={{ y: mockY }} initial={{ opacity: 0, rotateY: 15, rotateX: 10, x: 100, scale: 0.9 }} animate={{ opacity: 1, rotateY: -12, rotateX: 8, x: 0, scale: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }} className="flex-1 w-full max-w-[800px] perspective-[2500px] hidden lg:block xl:ml-10">
        <div className="w-full transform-style-3d transition-transform duration-1000 ease-out hover:rotate-y-0 hover:rotate-x-0 cursor-default shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-transparent blur-3xl -z-10 rounded-full transform scale-110" />
          <CommandCenterMock />
        </div>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="w-full max-w-2xl lg:hidden relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-transparent blur-2xl -z-10 rounded-full" />
        <CommandCenterMock />
      </motion.div>
    </motion.div>
  </section>;
};
