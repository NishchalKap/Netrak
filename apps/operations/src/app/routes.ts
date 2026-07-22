export const ROUTES = {
  root: '/',

  auth: {
    login: '/login',
    callback: '/auth/callback',
  },

  dashboard: {
    root: '/dashboard',
    overview: '/dashboard',
    cases: '/dashboard/cases',
    case: (id: string) => `/dashboard/cases/${encodeURIComponent(id)}`,
    casePattern: 'cases/:id',
    command: '/dashboard/command',
    intelligence: '/dashboard/intelligence',
    evidence: '/dashboard/evidence',
    timeline: '/dashboard/timeline',
    analytics: '/dashboard/analytics',
    maps: '/dashboard/maps',
    notifications: '/dashboard/notifications',
    profile: '/dashboard/profile',
    admin: '/dashboard/admin',
  },
} as const;

export type RoutesManifest = typeof ROUTES;
