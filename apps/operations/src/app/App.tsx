import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { Callback } from '@/features/auth/Callback';
import { AppShell } from './AppShell';
import { NetrakLoader } from '@/components/NetrakLoader';
import { ROUTES } from './routes';
import { validateRoutes } from './routeValidator';

const OfficerDashboard = lazy(() => import('@/pages/OfficerDashboard').then((module) => ({ default: module.OfficerDashboard })));
const CaseQueue = lazy(() => import('@/pages/CaseQueue').then((module) => ({ default: module.CaseQueue })));
const InvestigationWorkspace = lazy(() => import('@/pages/InvestigationWorkspace').then((module) => ({ default: module.InvestigationWorkspace })));
const CommandCenter = lazy(() => import('@/pages/CommandCenter').then((module) => ({ default: module.CommandCenter })));
const ThreatIntelligence = lazy(() => import('@/pages/ThreatIntelligence').then((module) => ({ default: module.ThreatIntelligence })));
const EvidenceExplorer = lazy(() => import('@/pages/EvidenceExplorer').then((module) => ({ default: module.EvidenceExplorer })));
const TimelineExplorer = lazy(() => import('@/pages/TimelineExplorer').then((module) => ({ default: module.TimelineExplorer })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const HeatMapPage = lazy(() => import('@/pages/HeatMapPage').then((module) => ({ default: module.HeatMapPage })));
const AdminPortal = lazy(() => import('@/pages/AdminPortal').then((module) => ({ default: module.AdminPortal })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then((module) => ({ default: module.NotificationsPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));
const LandingPage = lazy(() => import('@/pages/landing/LandingPage').then((module) => ({ default: module.LandingPage })));

class OperationalErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('Operational view failed', error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="access-boundary" role="alert">
          <h1>This view could not be opened.</h1>
          <p>Your session is safe. Reload the application to reconnect to Netrak operations.</p>
          <button className="button button--primary" onClick={() => window.location.reload()}>
            Reload application
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

function ProtectedShell() {
  const { user, initializing } = useAuth();
  if (initializing) return <NetrakLoader message="Authenticating credentials..." />;
  if (!user) return <Navigate to={ROUTES.auth.login} replace />;
  if (user.role === 'CITIZEN') {
    return (
      <main className="access-boundary">
        <h1>Operational access required.</h1>
        <p>Your account belongs to the citizen service. Open the Netrak citizen application to continue.</p>
      </main>
    );
  }
  return <AppShell />;
}

export function App() {
  useEffect(() => {
    validateRoutes();
  }, []);

  return (
    <OperationalErrorBoundary>
      <Suspense fallback={<NetrakLoader message="Loading module..." />}>
        <Routes>
          <Route path={ROUTES.root} element={<LandingPage />} />
          <Route path={ROUTES.auth.login} element={<LoginPage />} />
          <Route path={ROUTES.auth.callback} element={<Callback />} />
          <Route path={ROUTES.dashboard.root} element={<ProtectedShell />}>
            <Route index element={<OfficerDashboard />} />
            <Route path="cases" element={<CaseQueue />} />
            <Route path={ROUTES.dashboard.casePattern} element={<InvestigationWorkspace />} />
            <Route path="command" element={<CommandCenter />} />
            <Route path="intelligence" element={<ThreatIntelligence />} />
            <Route path="evidence" element={<EvidenceExplorer />} />
            <Route path="timeline" element={<TimelineExplorer />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="maps" element={<HeatMapPage />} />
            <Route path="admin" element={<AdminPortal />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </OperationalErrorBoundary>
  );
}
