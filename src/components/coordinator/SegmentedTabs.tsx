import React from 'react';

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface SegmentedTabsProps<T extends string = string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Sections',
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full p-1.5 bg-mint-deep/80 border border-border rounded-xl ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`min-h-[44px] sm:min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-forest shrink-0 select-none active:scale-95 ${
              isActive
                ? 'bg-forest text-cream shadow-xs'
                : 'text-ink-muted hover:text-ink bg-white/70 hover:bg-cream border border-border/50'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  isActive
                    ? 'bg-forest-dark text-cream'
                    : 'bg-cream text-ink-muted border border-border'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
