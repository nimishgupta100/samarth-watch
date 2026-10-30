import React from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

/**
 * Minimal layout for senior users.
 * Self-contained elder-friendly interface with mint background.
 */
export const SeniorLayout: React.FC = () => {
  const [params] = useSearchParams();

  return (
    <div className="min-h-dvh flex flex-col bg-mint text-ink overflow-x-hidden pb-safe">
      {params.get('redirect') === 'blocked' && (
        <div role="alert" aria-live="polite" className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-sm text-alert-amber text-center font-bold">
          You can only open your own screen. Returning home.
        </div>
      )}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
