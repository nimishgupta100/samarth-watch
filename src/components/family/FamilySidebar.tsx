import React, { useState } from 'react';
import { 
  Home, 
  Pill, 
  Activity, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  MapPin 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FamilyTab } from './FamilyBottomNav';
import { InitialsAvatar } from '../coordinator/InitialsAvatar';

interface FamilySidebarProps {
  activeTab: FamilyTab;
  onSelectTab: (tab: FamilyTab) => void;
}

export const FamilySidebar: React.FC<FamilySidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const userName = currentUser?.name || 'Karishma';

  const linkClass = (tab: FamilyTab) =>
    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-forest text-left ${
      activeTab === tab
        ? 'bg-forest text-cream shadow-xs'
        : 'text-ink-muted hover:text-ink hover:bg-mint-deep'
    } ${collapsed ? 'justify-center px-2' : ''}`;

  return (
    <aside
      aria-label="Family Sidebar"
      className={`hidden lg:flex flex-col border-r border-border bg-cream transition-all duration-200 shrink-0 sticky top-0 h-screen z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-forest tracking-tight">Samarth Watch</div>
              <div className="text-[10px] text-ink-muted font-medium">Family Companion</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-forest text-cream flex items-center justify-center">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 rounded-lg border border-border bg-mint-deep/60 hover:bg-mint flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        <button type="button" onClick={() => onSelectTab('home')} className={linkClass('home')} title="Home">
          <Home className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Home</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('medicines')} className={linkClass('medicines')} title="Medicines">
          <Pill className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Medicines</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('health')} className={linkClass('health')} title="Health">
          <Activity className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Health & Vitals</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('location')} className={linkClass('location')} title="Location">
          <MapPin className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Location</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('appointments')} className={linkClass('appointments')} title="Appointments">
          <Calendar className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Appointments</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('messages')} className={linkClass('messages')} title="Messages">
          <MessageSquare className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Coordinator Chat</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('report')} className={linkClass('report')} title="Reports">
          <FileText className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Wellbeing Reports</span>}
        </button>

        <button type="button" onClick={() => onSelectTab('settings')} className={linkClass('settings')} title="Settings">
          <Settings className="w-5 h-5 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-border bg-mint-deep/30">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} gap-2`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar name={userName} size="sm" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{userName}</div>
                <div className="text-[10px] text-ink-muted truncate">Family Member</div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => logout()}
            aria-label="Sign out"
            title="Sign out"
            className="w-8 h-8 rounded-lg border border-border bg-cream hover:bg-red-50 hover:text-alert-red flex items-center justify-center text-ink-muted transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  );
};
