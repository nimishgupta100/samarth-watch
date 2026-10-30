import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  daysCount?: number;
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  daysCount = 14,
}) => {
  // Generate days starting from today in IST
  const days = React.useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ iso, weekday, dayNum, monthShort, isToday: i === 0 });
    }
    return list;
  }, [daysCount]);

  const stripRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (stripRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      stripRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-2">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-ink uppercase tracking-wider">
          Select Date
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll dates left"
            className="w-8 h-8 rounded-lg bg-mint-deep border border-border flex items-center justify-center text-ink hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll dates right"
            className="w-8 h-8 rounded-lg bg-mint-deep border border-border flex items-center justify-center text-ink hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={stripRef}
        role="group"
        aria-label="Available dates"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth focus:outline-none"
        tabIndex={0}
      >
        {days.map((item) => {
          const isSelected = item.iso === selectedDate;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => onSelectDate(item.iso)}
              aria-pressed={isSelected}
              className={`min-w-[64px] min-h-[72px] p-2 rounded-lg flex flex-col items-center justify-center transition-colors border select-none shrink-0 focus:outline-none focus:ring-2 focus:ring-forest ${
                isSelected
                  ? 'bg-forest text-cream border-forest shadow-xs'
                  : 'bg-cream text-ink border-border hover:bg-mint-deep'
              }`}
            >
              <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-cream/90' : 'text-ink-muted'}`}>
                {item.weekday}
              </span>
              <span className="text-lg font-bold my-0.5 leading-none">
                {item.dayNum}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-cream/80' : 'text-ink-muted'}`}>
                {item.isToday ? 'Today' : item.monthShort}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
