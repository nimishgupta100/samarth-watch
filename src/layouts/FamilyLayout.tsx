import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Clean layout wrapper for the family portal.
 * Rendering is managed by the responsive Family portal shell.
 */
export const FamilyLayout: React.FC = () => {
  return (
    <div className="min-h-dvh flex flex-col bg-mint text-ink overflow-x-hidden">
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
