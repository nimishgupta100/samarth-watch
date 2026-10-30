import React from 'react';
import { Sun, CloudSun, Sunset } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SlotPickerProps {
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  selectedSlot,
  onSelectSlot,
}) => {
  const { t } = useApp();

  const slotGroups = [
    {
      group: t.morningSlots,
      icon: <Sun className="w-4 h-4 text-amber-600" strokeWidth={1.5} />,
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM'],
    },
    {
      group: t.afternoonSlots,
      icon: <CloudSun className="w-4 h-4 text-amber-700" strokeWidth={1.5} />,
      slots: ['02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM'],
    },
    {
      group: t.eveningSlots,
      icon: <Sunset className="w-4 h-4 text-forest" strokeWidth={1.5} />,
      slots: ['05:30 PM', '06:30 PM', '07:30 PM', '08:00 PM'],
    },
  ];

  return (
    <div className="space-y-4 py-2">
      <div className="text-xs font-bold text-ink uppercase tracking-wider">
        Choose Time Slot (IST)
      </div>

      {slotGroups.map((group) => (
        <div key={group.group} className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            {group.icon}
            <span>{group.group}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {group.slots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-bold transition-colors border flex items-center justify-center select-none focus:outline-none focus:ring-2 focus:ring-forest ${
                    isSelected
                      ? 'bg-forest text-cream border-forest shadow-xs'
                      : 'bg-cream text-ink border-border hover:bg-mint-deep'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
