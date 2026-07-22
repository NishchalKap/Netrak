import { Bell, ChevronLeft, ChevronRight, FileSearch, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Badge, Button } from '@/components/ui';
import { useNotifications } from '@/data/queries';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/features/auth/AuthContext';
import { BrandLogo } from '@/components/BrandLogo';
import { GlobalSearch } from '@/features/search/GlobalSearch';
import { PRIMARY_NAV, SECONDARY_NAV } from './navigation';
import { ROUTES } from './routes';

export function AppShell() {
  const { user, logout } = useAuth();
  const { theme, preference, toggleTheme } = useTheme();
  const online = useNetworkStatus();
  const notifications = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const unread = useMemo(() => (notifications.data ?? []).filter((item) => !item.read).length, [notifications.data]);
  const nextTheme = preference === 'dark' ? 'light' : preference === 'light' ? 'system' : 'dark';

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      {!online && (
        <div className="offline-banner">
          Offline. Cached threat intelligence remains available; changes will require a connection.
        </div>
      )}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <header>
          <NavLink to={ROUTES.dashboard.overview} style={{ textDecoration: 'none' }}>
            <BrandLogo />
          </NavLink>
          <Button
            variant="ghost"
            className="mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </Button>
        </header>
        <button className="sidebar-search" onClick={() => setSearchOpen(true)}>
          <Search size={17} />
          <span>Search operations</span>
          <kbd>Ctrl K</kbd>
        </button>
        <nav aria-label="Primary navigation">
          {PRIMARY_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <nav className="sidebar__secondary" aria-label="Account navigation">
          {SECONDARY_NAV.map(({ to, label, icon: Icon, requiresAdmin }) => {
            if (requiresAdmin && user?.role !== 'ADMIN') return null;
            return (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}>
                <Icon size={18} />
                <span>{label}</span>
                {to === ROUTES.dashboard.notifications && unread > 0 && <Badge tone="accent">{unread}</Badge>}
              </NavLink>
            );
          })}
        </nav>
        <footer>
          <div className="operator">
            <span>{(user?.name || user?.email || 'Operator').slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user?.name || 'Authorized operator'}</strong>
              <small>{user?.role}</small>
            </div>
          </div>
          <button onClick={logout}>Sign out</button>
        </footer>
        <Button
          variant="ghost"
          className="collapse-control desktop-only"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </aside>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <div className="app-main">
        <header className="topbar">
          <Button
            variant="ghost"
            className="mobile-only"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </Button>
          <div className="topbar-context">
            <span className={`presence ${online ? '' : 'presence--offline'}`} />{' '}
            <span>{online ? 'Network available' : 'Offline mode'}</span>
          </div>
          <div>
            <Button variant="ghost" onClick={() => setSearchOpen(true)} aria-label="Open search">
              <FileSearch size={19} />
            </Button>
            <Button
              variant="ghost"
              onClick={toggleTheme}
              aria-label={`Use ${nextTheme} theme`}
              title={`Theme preference: ${preference}`}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </Button>
            <NavLink
              className="icon-link"
              to={ROUTES.dashboard.notifications}
              aria-label={`${unread} unread notifications`}
            >
              <Bell size={19} />
              {unread > 0 && <i />}
            </NavLink>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
