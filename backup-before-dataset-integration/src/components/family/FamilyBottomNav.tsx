import React, { useState } from 'react';
import { 
  Home, 
  Pill, 
  Activity, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type FamilyTab = 
  | 'home' 
  | 'medicines' 
  | 'health' 
  | 'appointments' 
  | 'messages' 
  | 'report' 
  | 'settings';

interface FamilyBottomNavProps {
  activeTab: FamilyTab;
  onSelectTab: (tab: FamilyTab) => void;
}

export const FamilyBottomNav: React.FC<FamilyBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { logout } = useAuth();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  const navItemClass = (isActive: boolean) =>
    `flex flex-col items-center justify-center flex-1 py-1 min-h-[48px] select-none transition-colors focus:outline-none focus:ring-1 focus:ring-forest rounded-lg ${
      isActive
        ? 'text-forest font-bold'
        : 'text-ink-muted hover:text-ink font-medium'
    }`;

  const isMoreActive = ['appointments', 'messages', 'report', 'settings'].includes(activeTab);

  return (
    <>
      <nav
        aria-label="Family Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-border shadow-lg pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex items-center justify-around px-2 h-16 max-w-lg mx-auto">
          {/* Home */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={navItemClass(activeTab === 'home')}
          >
            <Home className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Medicines */}
          <button
            type="button"
            onClick={() => onSelectTab('medicines')}
            className={navItemClass(activeTab === 'medicines')}
          >
            <Pill className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="text-[10px]">Medicines</span>
          </button>

          {/* Health */}
          <button
            type="button"
            onClick={() => onSelectTab('health')}
            className={navItemClass(activeTab === 'health')}
          >
            <Activity className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="text-[10px]">Health</span>
          </button>

          {/* More */}
          <button
            type="button"
            onClick={() => setMoreSheetOpen(true)}
            className={navItemClass(isMoreActive)}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" strokeWidth={1.5} />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Bottom Sheet */}
      {moreSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-xs p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMoreSheetOpen(false);
          }}
        >
          <div className="w-full sm:max-w-md bg-cream border border-border rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-mint-deep">
              <h3 className="text-base font-bold text-ink">More Features</h3>
              <button
                type="button"
                onClick={() => setMoreSheetOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink hover:bg-mint"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSelectTab('appointments');
                  setMoreSheetOpen(false);
                }}
                className="w-full min-h-[52px] p-3 rounded-xl bg-white border border-border hover:bg-mint-deep flex items-center gap-3 text-left"
              >
                <Calendar className="w-5 h-5 text-forest" />
                <div>
                  <div className="text-sm font-bold text-ink">Appointments & Calendar</div>
                  <div className="text-xs text-ink-muted">Google Meet visits and coordinator sessions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab('messages');
                  setMoreSheetOpen(false);
                }}
                className="w-full min-h-[52px] p-3 rounded-xl bg-white border border-border hover:bg-mint-deep flex items-center gap-3 text-left"
              >
                <MessageSquare className="w-5 h-5 text-forest" />
                <div>
                  <div className="text-sm font-bold text-ink">Coordinator Messages</div>
                  <div className="text-xs text-ink-muted">Direct conversation with care coordinator</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab('report');
                  setMoreSheetOpen(false);
                }}
                className="w-full min-h-[52px] p-3 rounded-xl bg-white border border-border hover:bg-mint-deep flex items-center gap-3 text-left"
              >
                <FileText className="w-5 h-5 text-forest" />
                <div>
                  <div className="text-sm font-bold text-ink">Wellbeing Reports</div>
                  <div className="text-xs text-ink-muted">Weekly summaries and printable doctor reports</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectTab('settings');
                  setMoreSheetOpen(false);
                }}
                className="w-full min-h-[52px] p-3 rounded-xl bg-white border border-border hover:bg-mint-deep flex items-center gap-3 text-left"
              >
                <Settings className="w-5 h-5 text-forest" />
                <div>
                  <div className="text-sm font-bold text-ink">Settings & Preferences</div>
                  <div className="text-xs text-ink-muted">Language, alerts and consent status</div>
                </div>
              </button>

              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full min-h-[48px] px-3 rounded-xl bg-red-50 text-alert-red font-bold text-xs flex items-center justify-center gap-2 border border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
