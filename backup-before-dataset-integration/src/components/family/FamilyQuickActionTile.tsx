import React from 'react';

interface FamilyQuickActionTileProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
}

export const FamilyQuickActionTile: React.FC<FamilyQuickActionTileProps> = ({
  label,
  icon,
  onClick,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3.5 sm:p-4 rounded-xl bg-white border border-border hover:border-forest/40 hover:bg-mint-deep/40 text-center flex flex-col items-center justify-center gap-2 transition-all shadow-xs relative select-none focus:outline-none focus:ring-2 focus:ring-forest min-h-[80px]"
    >
      {badge && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-mint-deep text-forest border border-border">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-mint-deep text-forest flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-xs font-bold text-ink truncate w-full">{label}</span>
    </button>
  );
};
