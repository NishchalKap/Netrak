import { ArrowLeft, Compass, Info } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { REGISTERED_DASHBOARD_ROUTES } from '@/app/routeValidator';

function findClosestRoute(path: string, routes: readonly string[]): string | null {
  const normalized = path.toLowerCase();
  let bestMatch: string | null = null;
  let highestSimilarity = 0;

  for (const route of routes) {
    const routeLower = route.toLowerCase();
    if (normalized.includes(routeLower) || routeLower.includes(normalized)) {
      return route;
    }
    // Calculate simple segment match score
    const pathSegments = normalized.split('/').filter(Boolean);
    const routeSegments = routeLower.split('/').filter(Boolean);
    const matchingSegments = pathSegments.filter((seg) => routeSegments.includes(seg)).length;
    if (matchingSegments > highestSimilarity) {
      highestSimilarity = matchingSegments;
      bestMatch = route;
    }
  }

  return bestMatch;
}

export function NotFoundPage() {
  const location = useLocation();
  const isDev = import.meta.env.DEV;
  const closestRoute = findClosestRoute(location.pathname, REGISTERED_DASHBOARD_ROUTES);

  return (
    <div className="not-found" style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-accent, #ef4444)' }}>404</span>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Route Not Found</h1>
          <p style={{ margin: 0, color: 'var(--color-muted, #9ca3af)', fontSize: '0.9rem' }}>
            The operational view you requested could not be resolved.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link className="button button--primary" to={ROUTES.dashboard.overview}>
          <ArrowLeft size={17} /> Return to Dashboard
        </Link>
      </div>

      {isDev && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '0.75rem', fontWeight: 600 }}>
            <Info size={18} />
            <span>Developer Route Diagnostics</span>
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
            <strong>Attempted URL:</strong> <code style={{ color: '#60a5fa' }}>{location.pathname}</code>
          </p>

          {closestRoute && (
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
              <strong>Closest Matching Registered Route:</strong>{' '}
              <Link to={closestRoute} style={{ color: '#34d399', textDecoration: 'underline' }}>
                {closestRoute}
              </Link>
            </p>
          )}

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>
              <Compass size={15} /> Registered Operational Routes:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.6 }}>
              {REGISTERED_DASHBOARD_ROUTES.map((route) => (
                <li key={route}>
                  <Link to={route} style={{ color: '#93c5fd' }}>
                    {route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
