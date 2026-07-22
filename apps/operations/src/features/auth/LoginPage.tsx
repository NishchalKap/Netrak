import { ArrowRight, ChevronLeft, LockKeyhole, Smartphone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '@/lib/apiClient';
import { authRepository } from '@/data/repositories';
import { useAuth } from './AuthContext';
import { BrandLogo } from '@/components/BrandLogo';
import { motion } from 'framer-motion';
import { ROUTES } from '@/app/routes';

type Mode = 'sign-in' | 'register';

export function LoginPage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'register' ? 'register' : 'sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={ROUTES.dashboard.overview} replace />;

  const chooseMode = (nextMode: Mode) => {
    setMode(nextMode);
    setSearchParams(nextMode === 'register' ? { mode: 'register' } : {});
    setError('');
    setSuccess('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const normalizedEmail = email.trim();
    if (mode === 'register' && password.length < 12) return setError('Use a password with at least 12 characters.');
    if (mode === 'register' && password !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      if (mode === 'register') {
        const account = await authRepository.registerCitizen(normalizedEmail, password);
        setSuccess(account.token ? 'Your citizen account has been created. Continue in Netrak Mobile to report an incident or manage your account.' : 'Your account was created. Confirm your email, then continue in Netrak Mobile.');
        setPassword('');
        setConfirmPassword('');
      } else {
        const signedIn = await login(normalizedEmail, password);
        if (signedIn.role === 'CITIZEN') {
          logout();
          setError('Citizen accounts use Netrak Mobile. This workspace is for provisioned officer and administrator accounts.');
        } else {
          navigate(ROUTES.dashboard.overview, { replace: true });
        }
      }
    } catch (reason) {
      setError(getErrorMessage(reason, mode === 'register' ? 'Account creation failed.' : 'Sign in failed.'));
    } finally {
      setLoading(false);
    }
  };

  const isRegistering = mode === 'register';
  return <main className="min-h-screen bg-[#03050A] text-white flex flex-col md:flex-row font-sans selection:bg-[#00E5FF] selection:text-[#001A1F]">
    <section className="relative flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 overflow-hidden bg-[#0A0E17]/50">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '3rem 3rem' }} />
      <div className="relative z-10 flex flex-col items-start gap-12"><Link to={ROUTES.root} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"><ChevronLeft size={16} />Back to main site</Link><BrandLogo size={42} /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 max-w-xl mt-20 md:mt-0">
        <span className="inline-block mb-6 text-[#00E5FF] text-xs font-bold tracking-widest uppercase bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/30">Netrak access</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">One service.<br /><span className="text-gray-400">Different workspaces.</span></h1>
        <p className="text-lg text-gray-400 leading-relaxed">Citizens create an account in Netrak Mobile to report and follow incidents. The Operations workspace is reserved for officer and administrator accounts provisioned by a deployment administrator.</p>
      </motion.div>
      <p className="relative z-10 mt-12 md:mt-0 text-xs font-mono text-gray-500">ACCESS IS ROLE-BASED</p>
    </section>

    <section className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-[#03050A]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00E5FF]/10 blur-[100px] rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-md relative z-10">
        <div className="glass-panel-heavy p-8 md:p-10 rounded-2xl">
          <div className="flex gap-2 p-1 rounded-lg bg-black/30 border border-white/[0.06] mb-8">
            <button type="button" onClick={() => chooseMode('sign-in')} className={`flex-1 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${!isRegistering ? 'bg-[#00E5FF] text-[#001A1F]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Sign In</button>
            <button type="button" onClick={() => chooseMode('register')} className={`flex-1 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${isRegistering ? 'bg-[#00E5FF] text-[#001A1F]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Sign Up</button>
          </div>
          <div className="w-14 h-14 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-7 shadow-[0_0_15px_rgba(0,229,255,0.15)]">{isRegistering ? <Smartphone size={24} /> : <LockKeyhole size={24} />}</div>
          <h2 className="text-2xl font-bold mb-2">{isRegistering ? 'Create a citizen account' : 'Sign in to Operations'}</h2>
          <p className="text-gray-400 text-sm mb-8">{isRegistering ? 'This account is for Netrak Mobile. Officer and administrator access cannot be self-created here.' : 'Use the officer or administrator credentials issued by your deployment administrator.'}</p>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2"><label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label><input id="email" autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full bg-[#03050A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/50 transition-all" /></div>
            <div className="flex flex-col gap-2"><label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label><input id="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} type="password" required minLength={isRegistering ? 12 : 1} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 12 characters" className="w-full bg-[#03050A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/50 transition-all" /></div>
            {isRegistering && <div className="flex flex-col gap-2"><label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">Confirm password</label><input id="confirm-password" autoComplete="new-password" type="password" required minLength={12} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" className="w-full bg-[#03050A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/50 transition-all" /></div>}
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm" role="alert">{error}</div>}
            {success && <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#A5F3FC] px-4 py-3 rounded-lg text-sm" role="status">{success}</div>}
            <button type="submit" disabled={loading} className="mt-2 w-full h-12 bg-[#00E5FF] text-[#001A1F] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#4DFFFF] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">{loading ? (isRegistering ? 'Creating account...' : 'Signing in...') : (isRegistering ? 'Create citizen account' : 'Sign in to Operations')}{!loading && <ArrowRight size={18} />}</button>
          </form>
        </div>
      </motion.div>
    </section>
  </main>;
}
