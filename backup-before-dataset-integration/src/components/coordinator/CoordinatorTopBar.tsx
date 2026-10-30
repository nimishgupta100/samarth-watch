import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Languages, 
  LogOut, 
  X, 
  Check, 
  ChevronDown, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from './InitialsAvatar';

interface CoordinatorTopBarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const CoordinatorTopBar: React.FC<CoordinatorTopBarProps> = ({
  onSearch,
  searchQuery = '',
}) => {
  const { currentUser, logout } = useAuth();
  const { 
    t, 
    language, 
    setLanguage, 
    roleNotifications, 
    unreadNotificationCount, 
    markNotificationRead,
    clearNotificationsForRole
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const coordinatorName = currentUser?.name || 'Nimish Gupta';

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-xs border-b border-border text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <InitialsAvatar name={coordinatorName} size="md" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider leading-none">
              Welcome back
            </div>
            <h1 className="text-sm sm:text-base font-bold text-forest truncate mt-0.5">
              {coordinatorName}
            </h1>
          </div>
        </div>

        {/* Center / Search bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search seniors by name, phone or city..."
              value={searchQuery}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full min-h-[40px] pl-9 pr-4 py-2 rounded-lg bg-mint-deep/60 border border-border text-ink text-sm placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right action icons: Mobile search toggle, Notifications, Language, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Toggle search input"
            className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-mint-deep transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Notification Bell Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications, ${unreadNotificationCount} unread`}
              aria-expanded={showNotifications}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-mint-deep transition-colors relative focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-alert-red ring-2 ring-cream" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-cream border border-border rounded-xl shadow-lg p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <div className="text-xs font-bold text-forest uppercase tracking-wider">
                    Notifications ({roleNotifications.length})
                  </div>
                  {roleNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearNotificationsForRole()}
                      className="text-[11px] text-ink-muted hover:text-forest underline focus:outline-none"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {roleNotifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-ink-muted">
                      No notifications right now
                    </div>
                  ) : (
                    roleNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-cream/40 border-border/60 text-ink-muted'
                            : 'bg-white border-border text-ink font-medium shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-forest">{n.title}</span>
                          <span className="text-[10px] text-ink-muted">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector Button */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            aria-label="Switch language between English and Hindi"
            className="min-h-[40px] px-2.5 py-1.5 rounded-lg border border-border bg-mint-deep hover:bg-mint text-forest text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <Languages className="w-4 h-4" strokeWidth={1.5} />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Profile Menu Toggle */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Coordinator profile menu"
              aria-expanded={showProfileMenu}
              className="min-h-[40px] px-2 py-1 rounded-lg hover:bg-mint-deep border border-transparent hover:border-border transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <User className="w-4 h-4 text-forest" strokeWidth={1.5} />
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.5} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-cream border border-border rounded-xl shadow-lg p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <div className="text-xs font-bold text-ink">{coordinatorName}</div>
                  <div className="text-[11px] text-ink-muted capitalize">{t.roleCoordinator}</div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(language === 'en' ? 'hi' : 'en');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-ink hover:bg-mint-deep flex items-center justify-between"
                  >
                    <span>Language: {language === 'en' ? 'English' : 'हिन्दी'}</span>
                    <Languages className="w-3.5 h-3.5 text-sage" />
                  </button>
                </div>

                <div className="pt-1 border-t border-border mt-1">
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-alert-red hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.signOut}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search expandable row */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-border bg-mint-deep/40">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search seniors..."
              value={searchQuery}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-9 py-2 rounded-lg bg-white border border-border text-ink text-base placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-forest"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearch && onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
