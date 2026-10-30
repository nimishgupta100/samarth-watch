import React from 'react';
import { ShieldAlert, Phone, MapPin, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyStripProps {
  seniorId: string;
  seniorName: string;
  reason: string;
  time: string;
  phone?: string;
  city?: string;
  address?: string;
  onOpenSenior: (seniorId: string) => void;
  onResolve?: () => void;
}

/**
 * Emergency strip displayed at the top ONLY when there is an active SOS
 * or an unconfirmed medicine escalation. Solid red border and accent.
 */
export const EmergencyStrip: React.FC<EmergencyStripProps> = ({
  seniorId,
  seniorName,
  reason,
  time,
  phone,
  city,
  address,
  onOpenSenior,
  onResolve,
}) => {
  const { t } = useApp();

  const mapQuery = address && address !== 'Not added yet' 
    ? address 
    : (city && city !== 'Not added yet' ? `${city}, India` : 'New Delhi, India');

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const hasPhone = Boolean(phone && phone !== 'Not added yet' && phone.trim().length >= 10);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-50 border-2 border-alert-red rounded-xl p-4 sm:p-5 shadow-sm mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: icon, badge, details */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-alert-red text-cream flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-alert-red text-cream text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {t.openSosAlert}
              </span>
              <span className="text-xs font-semibold text-alert-red">{time}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-ink mt-1">
              {seniorName} : <span className="text-alert-red font-semibold">{reason}</span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-ink-muted mt-1 flex-wrap">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-alert-red hover:underline focus:outline-none focus:ring-2 focus:ring-alert-red rounded"
              >
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{t.openInMaps}</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
              </a>
              {city && city !== 'Not added yet' && (
                <span>({city})</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap pt-2 md:pt-0">
          {hasPhone ? (
            <a
              href={`tel:${phone}`}
              className="min-h-[44px] px-4 py-2 bg-alert-red hover:bg-red-700 text-cream text-xs font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-alert-red focus:ring-offset-1"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              <span>{t.callSenior}</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Phone number not added yet"
              className="min-h-[44px] px-4 py-2 bg-cream text-ink-muted border border-border text-xs font-bold rounded-lg inline-flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              <span>{t.notAddedYet}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenSenior(seniorId)}
            className="min-h-[44px] px-4 py-2 bg-forest hover:bg-forest-dark text-cream text-xs font-bold rounded-lg inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-1"
          >
            <span>Open Profile</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </button>

          {onResolve && (
            <button
              type="button"
              onClick={onResolve}
              className="min-h-[44px] px-3 py-2 bg-cream hover:bg-mint border border-border text-xs font-bold text-ink rounded-lg inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <CheckCircle2 className="w-4 h-4 text-alert-green" strokeWidth={1.5} aria-hidden="true" />
              <span>Resolve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
