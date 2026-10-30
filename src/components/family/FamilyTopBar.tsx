import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { InitialsAvatar } from '../coordinator/InitialsAvatar';
import { LanguageSelector } from '../common/LanguageSelector';
import { 
  Bell, 
  Languages, 
  LogOut, 
  ChevronDown, 
  Heart,
  Clock,
  User
} from 'lucide-react';

interface FamilyTopBarProps {
  onOpenNotifications: () => void;
}

export const FamilyTopBar: React.FC<FamilyTopBarProps> = ({
  onOpenNotifications,
}) => {
  const { currentUser, logout } = useAuth();
  const { 
    selectedSenior, 
    language, 
    setLanguage, 
    roleNotifications, 
    unreadNotificationCount,
    t 
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const seniorName = selectedSenior?.name || 'Kamla Devi';

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-xs border-b border-border text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Senior Initials Avatar + Senior Name + Last Check-in */}
        <div className="flex items-center gap-3 min-w-0">
          <InitialsAvatar name={seniorName} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-forest truncate">
                {seniorName}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-mint-deep text-forest border border-border">
                Care Circle
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-0.5 truncate">
              <Clock className="w-3 h-3 text-sage shrink-0" />
              <span>Last check-in: Today 08:30 AM</span>
            </div>
          </div>
        </div>

        {/* Right actions: Bell with unread badge, Language Switch, Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`Notifications, ${unreadNotificationCount} unread`}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-mint-deep transition-colors relative focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-alert-red ring-2 ring-cream" />
            )}
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* Profile Menu Toggle */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Family profile menu"
              aria-expanded={showProfileMenu}
              className="min-h-[40px] px-2 py-1 rounded-lg hover:bg-mint-deep border border-transparent hover:border-border transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <User className="w-4 h-4 text-forest" strokeWidth={1.5} />
              <ChevronDown className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.5} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-cream border border-border rounded-xl shadow-lg p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <div className="text-xs font-bold text-ink">{currentUser?.name || 'Karishma'}</div>
                  <div className="text-[11px] text-ink-muted">Family Member : Daughter</div>
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
    </header>
  );
};
