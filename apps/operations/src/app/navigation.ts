import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CircleUserRound,
  Command,
  Database,
  FileClock,
  LayoutDashboard,
  Map,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  requiresAdmin?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { to: ROUTES.dashboard.overview, label: 'Overview', icon: LayoutDashboard, end: true },
  { to: ROUTES.dashboard.cases, label: 'Case queue', icon: BriefcaseBusiness },
  { to: ROUTES.dashboard.command, label: 'Command center', icon: Command },
  { to: ROUTES.dashboard.intelligence, label: 'Threat intelligence', icon: Activity },
  { to: ROUTES.dashboard.evidence, label: 'Evidence', icon: Database },
  { to: ROUTES.dashboard.timeline, label: 'Timeline', icon: FileClock },
  { to: ROUTES.dashboard.analytics, label: 'Analytics', icon: BarChart3 },
  { to: ROUTES.dashboard.maps, label: 'Geospatial', icon: Map },
];

export const SECONDARY_NAV: NavItem[] = [
  { to: ROUTES.dashboard.notifications, label: 'Notifications', icon: Bell },
  { to: ROUTES.dashboard.profile, label: 'Profile', icon: CircleUserRound },
  { to: ROUTES.dashboard.admin, label: 'Administration', icon: Settings, requiresAdmin: true },
];

export const ALL_NAV_ITEMS = [...PRIMARY_NAV, ...SECONDARY_NAV];
