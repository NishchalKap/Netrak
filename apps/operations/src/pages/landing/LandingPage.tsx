import { useEffect } from 'react';
import { Hero } from './Hero';
import { EvidencePipeline } from './EvidencePipeline';
import { ThreatMap } from './ThreatMap';
import { CommandCenter } from './CommandCenter';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

export const LandingPage = () => {
  // Global scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Ensure scroll is at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#03050A] min-h-screen text-white overflow-x-hidden font-sans selection:bg-[#00E5FF] selection:text-[#03050A]">
      {/* Top progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-[#00E5FF] z-[100]"
        style={{ scaleX }}
      />
      
      <Hero />
      <EvidencePipeline />
      <ThreatMap />
      <CommandCenter />
      <FinalCTA />
      <Footer />
    </main>
  );
};
