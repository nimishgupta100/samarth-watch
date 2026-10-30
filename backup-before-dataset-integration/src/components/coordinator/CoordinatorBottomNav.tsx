import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Inbox, 
  Plus, 
  Settings 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CoordinatorBottomNavProps {
  onOpenQuickActions: () => void;
}

export const CoordinatorBottomNav: React.FC<CoordinatorBottomNavProps> = ({
  onOpenQuickActions,
}) => {
  const { t, unreadNotificationCount } = useApp();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 min-h-[48px] select-none transition-colors focus:outline-none focus:ring-1 focus:ring-forest rounded-lg ${
      isActive
        ? 'text-forest font-bold'
        : 'text-ink-muted hover:text-ink font-medium'
    }`;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-border shadow-lg pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto relative">
        {/* Item 1: Home */}
        <NavLink to="/coordinator" end className={navItemClass}>
          <Home className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
          <span className="text-[10px] tracking-tight">{t.coordHome}</span>
        </NavLink>

        {/* Item 2: Seniors */}
        <NavLink to="/coordinator/seniors" className={navItemClass}>
          <Users className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
          <span className="text-[10px] tracking-tight">{t.coordSeniors}</span>
        </NavLink>

        {/* Center Raised Square-Rounded Button */}
        <div className="relative -top-4 flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenQuickActions}
            aria-label="Open Quick Actions"
            className="w-13 h-13 rounded-2xl bg-forest hover:bg-forest-dark text-cream flex items-center justify-center shadow-md border-2 border-cream transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
          >
            <Plus className="w-7 h-7" strokeWidth={2} />
          </button>
        </div>

        {/* Item 3: Appointments */}
        <NavLink to="/coordinator/appointments" className={navItemClass}>
          <Calendar className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
          <span className="text-[10px] tracking-tight">{t.coordAppointments}</span>
        </NavLink>

        {/* Item 4: Inbox */}
        <NavLink to="/coordinator/inbox" className={navItemClass}>
          <div className="relative">
            <Inbox className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-alert-red ring-1 ring-cream" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">{t.coordInbox}</span>
        </NavLink>
      </div>
    </nav>
  );
};
