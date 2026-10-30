import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { LogOut, BarChart3 } from 'lucide-react';

const UserBar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useApp();
  const [params] = useSearchParams();

  return (
    <>
      {params.get('redirect') === 'blocked' && (
        <div role="alert" aria-live="polite" className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-alert-amber text-center font-medium">
          That page is restricted to a different role. You have been redirected to your dashboard.
        </div>
      )}
      <div className="bg-forest text-cream text-xs px-4 py-2 flex items-center justify-between gap-2 border-b border-forest-dark">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-sage-light" aria-hidden="true" />
          <span className="font-semibold text-cream">{currentUser?.name}</span>
          <span className="text-sage-light capitalize">- {t.roleOperations}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-cream/80 hover:text-cream transition-colors focus:outline-none focus:ring-1 focus:ring-sage rounded px-2 py-0.5"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );
};

export const OpsLayout: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-mint text-ink overflow-x-hidden">
      <UserBar />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
