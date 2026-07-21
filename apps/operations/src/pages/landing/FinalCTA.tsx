import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const FinalCTA = () => {
  const { user } = useAuth();
  return <section id="contact" className="relative w-full bg-[#03050A] py-36 border-t border-white/[0.02] overflow-hidden flex flex-col items-center">
    <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[#00E5FF]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
    <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-8 text-[#00E5FF]"><Smartphone size={26} /></motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">Use the Netrak space made for you.</motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.2 }} className="text-lg text-gray-400 max-w-2xl mb-10 font-medium">Citizens create an account in Netrak Mobile to report and follow incidents. Officer and administrator accounts are provisioned by the deployment administrator before they can enter Operations.</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4"><Link to={user ? '/dashboard' : '/login'} className="group flex items-center justify-center gap-2 h-14 px-10 text-base font-bold text-black bg-white rounded-full transition-transform hover:scale-105">{user ? 'Open Operations' : 'Sign in to Operations'}<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link><Link to="/login?mode=register" className="flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-colors">Create a citizen account</Link></motion.div>
    </div>
  </section>;
};
