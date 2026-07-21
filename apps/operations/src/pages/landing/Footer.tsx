import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/BrandLogo';

export const Footer = () => <footer id="company" className="relative py-16 px-6 bg-[#010204] border-t border-white/5 overflow-hidden">
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-[#00E5FF]/5 blur-[120px] pointer-events-none rounded-t-full" />
  <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
    <div className="flex flex-col gap-5 max-w-md"><BrandLogo size={32} /><p className="text-sm text-gray-500 leading-relaxed">Netrak is a digital public-safety platform. This release supports citizen reporting, case workflows, evidence references, and deployment-configured advisories.</p><p className="text-xs text-gray-600 leading-relaxed">It does not claim live monitoring, AI inference, file custody, or emergency dispatch.</p></div>
    <div className="grid grid-cols-2 gap-x-12 gap-y-8 text-sm">
      <div className="flex flex-col gap-3"><h4 className="text-white font-bold text-xs tracking-widest uppercase">Explore</h4><a href="#platform" className="text-gray-500 hover:text-white transition-colors">How it works</a><a href="#intelligence" className="text-gray-500 hover:text-white transition-colors">Release boundaries</a><Link to="/login" className="text-gray-500 hover:text-white transition-colors">Operations sign in</Link></div>
      <div className="flex flex-col gap-3"><h4 className="text-white font-bold text-xs tracking-widest uppercase">Access</h4><Link to="/login?mode=register" className="text-gray-500 hover:text-white transition-colors">Create citizen account</Link><span className="text-gray-600">Staff access is provisioned</span></div>
    </div>
  </div>
  <div className="max-w-7xl mx-auto relative z-10 mt-16 pt-8 border-t border-white/5"><p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Netrak. All rights reserved.</p></div>
</footer>;
