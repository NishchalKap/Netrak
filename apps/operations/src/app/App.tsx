import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Skeleton } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { AppShell } from './AppShell';

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
      return <main className="access-boundary" role="alert"><h1>This view could not be opened.</h1><p>Your session is safe. Reload the application to reconnect to Netrak operations.</p><button className="button button--primary" onClick={() => window.location.reload()}>Reload application</button></main>;
    }
    return this.props.children;
  }
}

function ProtectedShell() {
  const { user, initializing } = useAuth();
  if (initializing) return <main className="route-loading"><Skeleton rows={6} /></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'CITIZEN') return <main className="access-boundary"><h1>Operational access required.</h1><p>Your account belongs to the citizen service. Open the Netrak citizen application to continue.</p></main>;
  return <AppShell />;
}

export function App() {
  return <OperationalErrorBoundary><Suspense fallback={<main className="route-loading" aria-busy="true"><Skeleton rows={6} /></main>}><Routes><Route path="/login" element={<LoginPage />} /><Route element={<ProtectedShell />}><Route index element={<OfficerDashboard />} /><Route path="cases" element={<CaseQueue />} /><Route path="cases/:id" element={<InvestigationWorkspace />} /><Route path="command" element={<CommandCenter />} /><Route path="intelligence" element={<ThreatIntelligence />} /><Route path="evidence" element={<EvidenceExplorer />} /><Route path="timeline" element={<TimelineExplorer />} /><Route path="analytics" element={<AnalyticsPage />} /><Route path="maps" element={<HeatMapPage />} /><Route path="admin" element={<AdminPortal />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes></Suspense></OperationalErrorBoundary>;
}
