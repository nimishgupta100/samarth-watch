import React, { useState } from 'react';
import { CoordinatorTopBar } from './CoordinatorTopBar';
import { CoordinatorSidebar } from './CoordinatorSidebar';
import { CoordinatorBottomNav } from './CoordinatorBottomNav';
import { QuickActionsSheet } from './QuickActionsSheet';

interface AppShellProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  onSearch,
  searchQuery,
}) => {
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  return (
    <div className="min-h-dvh flex bg-mint text-ink antialiased">
      {/* Skip to main content link for keyboard / screen reader accessibility */}
      <a
        href="#coordinator-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-forest text-cream px-4 py-2 rounded-lg font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest"
      >
        Skip to main content
      </a>

      {/* Left Sidebar on Laptop (>= 1024px) */}
      <CoordinatorSidebar onOpenQuickActions={() => setQuickActionsOpen(true)} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-dvh overflow-x-hidden">
        {/* Top Bar (Phone, Tablet, and Laptop) */}
        <CoordinatorTopBar onSearch={onSearch} searchQuery={searchQuery} />

        {/* Primary Page Content */}
        <main
          id="coordinator-main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8 focus:outline-none"
        >
          {children}
        </main>

        {/* Bottom Navigation on Mobile / Tablet (< 1024px) */}
        <CoordinatorBottomNav onOpenQuickActions={() => setQuickActionsOpen(true)} />

        {/* Quick Actions Bottom Sheet / Modal */}
        <QuickActionsSheet
          isOpen={quickActionsOpen}
          onClose={() => setQuickActionsOpen(false)}
        />
      </div>
    </div>
  );
};
