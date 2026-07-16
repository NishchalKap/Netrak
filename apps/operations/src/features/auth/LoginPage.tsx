import { ArrowRight, LockKeyhole, Moon, ShieldCheck, Sun } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTheme } from '@/app/ThemeProvider';
import { Button, Field } from '@/components/ui';
import { getErrorMessage } from '@/lib/apiClient';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const { user, login, logout } = useAuth();
  const { theme, preference, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';

  if (user) return <Navigate to="/" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const signedIn = await login(email.trim(), password);
      if (signedIn.role === 'CITIZEN') {
        logout();
        setError('This workspace is reserved for authorized officers and administrators. Use the Netrak citizen application for citizen services.');
      } else {
        navigate('/', { replace: true });
      }
    } catch (reason) {
      setError(getErrorMessage(reason, 'Sign in failed.'));
    } finally {
      setLoading(false);
    }
  };

  return <main className="login-page">
    <Button className="login-theme" variant="ghost" onClick={toggleTheme} aria-label={`Use ${nextTheme} theme`} title={`Theme preference: ${preference}`}>
      {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
    </Button>
    <section className="login-story">
      <div className="brand-lockup"><span className="brand-mark"><ShieldCheck /></span><strong>NETRAK</strong></div>
      <div><span className="eyebrow">Operational intelligence</span><h1>Decisions begin with a clear signal.</h1><p>A calm, accountable workspace for public-safety operations and active investigations.</p></div>
      <small>Authorized access only - activity may be audited</small>
    </section>
    <section className="login-panel">
      <form onSubmit={submit}>
        <div className="login-icon"><LockKeyhole size={22} /></div>
        <span className="eyebrow">Officer access</span>
        <h2>Sign in to operations.</h2>
        <p>Use your Netrak-issued credentials.</p>
        <Field label="Work email"><input autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="officer@agency.gov.in" /></Field>
        <Field label="Password"><input autoComplete="current-password" type="password" required maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your secure password" /></Field>
        {error && <div className="form-error" role="alert">{error}</div>}
        <Button type="submit" disabled={loading}>{loading ? 'Verifying access...' : 'Continue'} <ArrowRight size={17} /></Button>
      </form>
    </section>
  </main>;
}
