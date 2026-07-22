import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { tokenStorage } from '@/lib/apiClient';
import { useAuth } from './AuthContext';
import { NetrakLoader } from '@/components/NetrakLoader';
import { ROUTES } from '@/app/routes';

export function Callback() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hash) {
      navigate(ROUTES.auth.login, { replace: true });
      return;
    }

    const params = new URLSearchParams(hash.replace('#', '?'));
    const accessToken = params.get('access_token');
    const errorDescription = params.get('error_description');

    if (errorDescription) {
      setError(errorDescription.replace(/\+/g, ' '));
      return;
    }

    if (accessToken) {
      tokenStorage.set(accessToken);
      refreshProfile().then(() => {
        navigate(ROUTES.dashboard.overview, { replace: true });
      }).catch(() => {
        navigate(ROUTES.auth.login, { replace: true });
      });
    } else {
      navigate(ROUTES.auth.login, { replace: true });
    }
  }, [hash, navigate, refreshProfile]);

  if (error) {
    return (
      <main className="access-boundary">
        <h1>Authentication Error</h1>
        <p>{error}</p>
        <button className="button button--primary" onClick={() => navigate(ROUTES.auth.login)}>Return to Sign In</button>
      </main>
    );
  }

  return <NetrakLoader message="Verifying credentials..." />;
}
