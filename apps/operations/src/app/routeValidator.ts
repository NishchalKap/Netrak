import { ALL_NAV_ITEMS } from './navigation';
import { ROUTES } from './routes';

export const REGISTERED_DASHBOARD_ROUTES = [
  ROUTES.dashboard.overview,
  ROUTES.dashboard.cases,
  ROUTES.dashboard.command,
  ROUTES.dashboard.intelligence,
  ROUTES.dashboard.evidence,
  ROUTES.dashboard.timeline,
  ROUTES.dashboard.analytics,
  ROUTES.dashboard.maps,
  ROUTES.dashboard.notifications,
  ROUTES.dashboard.profile,
  ROUTES.dashboard.admin,
] as const;

export function validateRoutes(): void {
  if (!import.meta.env.DEV) return;

  const registeredSet = new Set<string>(REGISTERED_DASHBOARD_ROUTES);
  const navSet = new Set<string>();

  // 1. Check for duplicate nav items
  for (const item of ALL_NAV_ITEMS) {
    if (navSet.has(item.to)) {
      throw new Error(`[Route Validation Error] Duplicate navigation item target registered: "${item.to}"`);
    }
    navSet.add(item.to);
  }

  // 2. Check for missing route (sidebar item without registered route)
  for (const item of ALL_NAV_ITEMS) {
    if (!registeredSet.has(item.to)) {
      throw new Error(
        `[Route Validation Error] Sidebar item "${item.label}" targets unregistered route: "${item.to}"`
      );
    }
  }

  // 3. Check for orphan registered routes (routes without sidebar navigation)
  for (const route of REGISTERED_DASHBOARD_ROUTES) {
    if (!navSet.has(route)) {
      console.warn(`[Route Validation Warning] Registered dashboard route has no sidebar navigation link: "${route}"`);
    }
  }

  console.info(`[Route Validator] Successfully validated ${ALL_NAV_ITEMS.length} navigation items against registered routes.`);
}
