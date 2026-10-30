import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Inbox, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Plus, 
  Mic, 
  Cpu,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from './InitialsAvatar';

interface CoordinatorSidebarProps {
  onOpenQuickActions: () => void;
}

export const CoordinatorSidebar: React.FC<CoordinatorSidebarProps> = ({
  onOpenQuickActions,
}) => {
  const { currentUser, logout } = useAuth();
  const { t, unreadNotificationCount } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const coordinatorName = currentUser?.name || 'Nimish Gupta';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-forest ${
      isActive
        ? 'bg-forest text-cream shadow-xs'
        : 'text-ink-muted hover:text-ink hover:bg-mint-deep'
    } ${collapsed ? 'justify-center px-2' : ''}`;

  return (
    <aside
      aria-label="Coordinator Sidebar"
      className={`hidden lg:flex flex-col border-r border-border bg-cream transition-all duration-200 shrink-0 sticky top-0 h-screen z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed ? (
          <Link to="/coordinator" className="flex items-center gap-2.5 min-w-0 focus:outline-none focus:ring-2 focus:ring-forest rounded">
            <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-forest tracking-tight">Samarth Watch</div>
              <div className="text-[10px] text-ink-muted font-medium capitalize">Care Coordinator</div>
            </div>
          </Link>
        ) : (
          <Link to="/coordinator" className="mx-auto focus:outline-none focus:ring-2 focus:ring-forest rounded">
            <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </Link>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 rounded-lg border border-border bg-mint-deep/60 hover:bg-mint flex items-center justify-center text-ink-muted hover:text-ink transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <button
          type="button"
          onClick={onOpenQuickActions}
          className={`w-full min-h-[44px] bg-forest hover:bg-forest-dark text-cream font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-1 ${
            collapsed ? 'px-2' : 'px-3'
          }`}
          title="Quick Actions"
        >
          <Plus className="w-4 h-4 shrink-0" strokeWidth={2} />
          {!collapsed && <span>{t.quickActions}</span>}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <NavLink to="/coordinator" end className={linkClass} title={t.coordHome}>
          <Home className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t.coordHome}</span>}
        </NavLink>

        <NavLink to="/coordinator/seniors" className={linkClass} title={t.coordSeniors}>
          <Users className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t.coordSeniors}</span>}
        </NavLink>

        <NavLink to="/coordinator/appointments" className={linkClass} title={t.coordAppointments}>
          <Calendar className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t.coordAppointments}</span>}
        </NavLink>

        <NavLink to="/coordinator/inbox" className={linkClass} title={t.coordInbox}>
          <div className="relative shrink-0">
            <Inbox className="w-5 h-5" strokeWidth={1.5} />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-alert-red" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>{t.coordInbox}</span>
              {unreadNotificationCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-mint-deep text-forest border border-border">
                  {unreadNotificationCount}
                </span>
              )}
            </div>
          )}
        </NavLink>

        <NavLink to="/coordinator/settings" className={linkClass} title={t.coordSettings}>
          <Settings className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t.coordSettings}</span>}
        </NavLink>

        {/* Secondary prototype items */}
        <div className="pt-4 mt-4 border-t border-border">
          {!collapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Tools & Validation
            </div>
          )}

          <NavLink to="/coordinator/voice-checkin" className={linkClass} title="Voice Check-in Demo">
            <Mic className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span>Voice Check-in</span>}
          </NavLink>

          <NavLink to="/coordinator/model-evaluation" className={linkClass} title="Synthetic Model Evaluation">
            <Cpu className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span>Model Evaluation</span>}
          </NavLink>

          <NavLink to="/coordinator/privacy-safety" className={linkClass} title="Privacy & Safety Architecture">
            <Lock className="w-5 h-5 shrink-0" strokeWidth={1.5} />
            {!collapsed && <span>Privacy & Safety</span>}
          </NavLink>
        </div>
      </nav>

      {/* User Bar at Bottom */}
      <div className="p-3 border-t border-border bg-mint-deep/30">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar name={coordinatorName} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{coordinatorName}</div>
                <div className="text-[10px] text-ink-muted truncate">Coordinator</div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => logout()}
            aria-label="Sign out"
            title="Sign out"
            className="w-8 h-8 rounded-lg border border-border bg-cream hover:bg-red-50 hover:text-alert-red flex items-center justify-center text-ink-muted transition-colors focus:outline-none focus:ring-1 focus:ring-alert-red"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
};
