import React, { useState, useMemo } from 'react';
import { Senior } from '../../types';
import { LeafletMapView, MapMarkerItem } from './LeafletMapView';
import { getLastKnownOrHome, getLastKnownReading } from '../../utils/locationService';
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Layers,
  CheckCircle2,
  HelpCircle,
  EyeOff
} from 'lucide-react';

interface SeniorLocationSectionProps {
  senior: Senior;
  isCoordinator?: boolean;
  activeSosEvent?: {
    id: string;
    seniorId: string;
    timestamp: number;
    location?: {
      lat: number;
      lng: number;
      accuracy: number;
      source?: string;
    };
  } | null;
  onCallSenior?: () => void;
}

export const SeniorLocationSection: React.FC<SeniorLocationSectionProps> = ({
  senior,
  isCoordinator = false,
  activeSosEvent,
  onCallSenior,
}) => {
  const [showTrail, setShowTrail] = useState(false);
  const [useSimpleCard, setUseSimpleCard] = useState(false);

  // Sharing Mode
  const sharingMode = senior.locationSharing || 'emergency_only';
  const hasActiveEmergency = Boolean(activeSosEvent && activeSosEvent.seniorId === senior.id);

  // Fallback demo coordinates for Lucknow (26.8467, 80.9462)
  const defaultLoc = getLastKnownOrHome(senior.address || 'Civil Lines, Lucknow');
  const lastReading = getLastKnownReading();

  // Resolved Location Coordinates
  const resolvedLocation = useMemo(() => {
    // 1. If active emergency, prioritize emergency payload
    if (hasActiveEmergency && activeSosEvent?.location) {
      return {
        lat: activeSosEvent.location.lat,
        lng: activeSosEvent.location.lng,
        accuracy: activeSosEvent.location.accuracy || 25,
        source: 'Emergency location',
        measuredAt: activeSosEvent.timestamp,
        isEmergency: true,
      };
    }

    // 2. If live reading exists
    if (lastReading && sharingMode === 'live') {
      return {
        lat: lastReading.lat,
        lng: lastReading.lng,
        accuracy: lastReading.accuracy || 30,
        source: lastReading.source === 'phone' ? 'Phone location' : lastReading.source === 'band' ? 'Band location' : 'Simulated location',
        measuredAt: new Date(lastReading.measuredAt).getTime(),
        isEmergency: false,
      };
    }

    // 3. Fallback
    return {
      lat: defaultLoc.lat,
      lng: defaultLoc.lng,
      accuracy: defaultLoc.accuracy || 100,
      source: defaultLoc.source === 'home_address' ? 'Home address (live location not available)' : 'Cached location',
      measuredAt: Date.now() - 35 * 60 * 1000, // 35 minutes ago
      isEmergency: false,
    };
  }, [hasActiveEmergency, activeSosEvent, lastReading, sharingMode, defaultLoc]);

  // Staleness calculation
  const stalenessMinutes = Math.round((Date.now() - resolvedLocation.measuredAt) / 60000);
  const isStale = stalenessMinutes > 15;

  // Trail Points (simulated path around center for demo in live mode)
  const trailPoints: [number, number][] = useMemo(() => {
    if (!showTrail || sharingMode !== 'live') return [];
    return [
      [resolvedLocation.lat - 0.0025, resolvedLocation.lng - 0.003],
      [resolvedLocation.lat - 0.0018, resolvedLocation.lng - 0.0015],
      [resolvedLocation.lat - 0.0008, resolvedLocation.lng - 0.0005],
      [resolvedLocation.lat, resolvedLocation.lng],
    ];
  }, [showTrail, sharingMode, resolvedLocation]);

  // Map Markers
  const markers: MapMarkerItem[] = useMemo(() => {
    return [
      {
        id: `senior-${senior.id}`,
        lat: resolvedLocation.lat,
        lng: resolvedLocation.lng,
        label: hasActiveEmergency ? 'SOS' : 'K',
        title: senior.name,
        isEmergency: hasActiveEmergency,
        accuracyMetres: resolvedLocation.accuracy,
        subtitle: hasActiveEmergency
          ? 'EMERGENCY LOCATION: Urgent assistance active'
          : `Last updated ${stalenessMinutes <= 1 ? 'just now' : `${stalenessMinutes} minutes ago`}`,
      },
    ];
  }, [senior, resolvedLocation, hasActiveEmergency, stalenessMinutes]);

  // Consent & Sharing Gating
  // If 'do_not_share': Location is blocked completely even in SOS
  if (sharingMode === 'do_not_share') {
    return (
      <div className="bg-cream border-2 border-border rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-alert-amber flex items-center justify-center mx-auto border border-amber-200">
          <EyeOff className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-xl font-bold text-forest">
            {senior.name} chose not to share her location
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {senior.name} has disabled location tracking for privacy. To verify her wellbeing or in case of concern, please contact her directly by phone.
          </p>
        </div>
        <div className="pt-2">
          <a
            href={`tel:${senior.phone || '917452009877'}`}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-forest hover:bg-forest-dark text-cream font-bold text-sm shadow-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call {senior.name}</span>
          </a>
        </div>
      </div>
    );
  }

  // If 'emergency_only' and NO active emergency:
  // Respectful explanation: NO live location shown, zero data remaining in DOM
  if (sharingMode === 'emergency_only' && !hasActiveEmergency) {
    return (
      <div className="bg-cream border border-border rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-mint-deep border border-border flex items-center justify-center text-forest">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-forest">
                Location Protected: Emergency Only
              </h3>
              <p className="text-xs text-ink-muted">
                {senior.name} shares her location only when an SOS or emergency alert triggers
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-mint text-forest border border-border text-xs font-bold self-start sm:self-center">
            Status: Standby
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-border text-xs text-ink-muted leading-relaxed space-y-2">
          <p>
            <strong>Privacy & Autonomy Guarantee:</strong> To prevent continuous surveillance and preserve dignity, {senior.name}'s GPS is only accessed during active emergency signals.
          </p>
          <p>
            If {senior.name} presses the SOS assistance button or an urgent fall is detected, her location will automatically appear here for both the Care Coordinator and linked family members.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-ink-muted font-medium">Home City: {senior.city || 'Lucknow, India'}</span>
          <a
            href={`tel:${senior.phone || '917452009877'}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-white border border-border text-forest font-bold text-xs hover:bg-mint-deep"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {senior.name}</span>
          </a>
        </div>
      </div>
    );
  }

  // Active Emergency or Live Mode:
  // Render responsive layout (Mobile: 45% map on top, info sheet below. Laptop: details on left, map on right)
  return (
    <div className="bg-cream border border-border rounded-2xl overflow-hidden shadow-xs">
      {/* Emergency Active Warning Header */}
      {hasActiveEmergency && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-alert-red flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>ACTIVE EMERGENCY LOCATION — Urgent Assistance Signal</span>
          </div>
          <span className="px-2.5 py-1 bg-red-100 text-alert-red text-xs font-black rounded uppercase">
            SOS Override
          </span>
        </div>
      )}

      {/* Main Grid: Responsive Split */}
      <div className="flex flex-col md:grid md:grid-cols-12 min-h-[460px]">
        {/* On Phone: Map is at the top (~45% height). On Laptop: Map is on the right (cols 7-12) */}
        <div className="order-1 md:order-2 md:col-span-7 h-[42vh] md:h-full min-h-[300px] border-b md:border-b-0 md:border-l border-border relative">
          <LeafletMapView
            center={[resolvedLocation.lat, resolvedLocation.lng]}
            zoom={hasActiveEmergency ? 16 : 15}
            markers={markers}
            accuracyMetres={resolvedLocation.accuracy}
            trailPoints={trailPoints}
            heightClass="h-full w-full"
            ariaLabel={`Map displaying ${senior.name}'s location`}
            useSimpleCard={useSimpleCard}
            onToggleSimpleCard={() => setUseSimpleCard(!useSimpleCard)}
            centerButtonLabel={`Center on ${senior.name.split(' ')[0]}`}
          />
        </div>

        {/* Details & Information Sheet (Phone: below map. Laptop: on the left, cols 1-5) */}
        <div className="order-2 md:order-1 md:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-forest" />
                  <h3 className="text-lg font-bold text-forest">
                    {hasActiveEmergency ? 'Emergency Location' : `${senior.name}'s Location`}
                  </h3>
                </div>
                <div className="text-xs text-ink-muted mt-0.5">
                  Sharing mode: <span className="font-semibold text-ink">{sharingMode === 'live' ? 'Shared while app is open' : 'Emergency only'}</span>
                </div>
              </div>

              {/* Trail Toggle (Live mode only) */}
              {sharingMode === 'live' && (
                <button
                  type="button"
                  onClick={() => setShowTrail(!showTrail)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    showTrail ? 'bg-forest text-cream border-forest' : 'bg-white text-ink border-border hover:bg-mint-deep'
                  }`}
                  aria-pressed={showTrail}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showTrail ? 'Hide Trail' : 'Show Trail'}</span>
                </button>
              )}
            </div>

            {/* Location Card Details */}
            <div className="p-4 rounded-xl bg-white border border-border space-y-3">
              {/* Coordinates & Accuracy */}
              <div>
                <div className="text-xs text-ink-muted font-medium">GPS Coordinates</div>
                <div className="text-base font-mono font-bold text-ink">
                  {resolvedLocation.lat.toFixed(5)}° N, {resolvedLocation.lng.toFixed(5)}° E
                </div>
                <div className="text-[11px] text-ink-muted mt-0.5">
                  Accuracy radius: ±{Math.round(resolvedLocation.accuracy)} metres
                </div>
              </div>

              {/* Source & Updated Time */}
              <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Source</div>
                  <div className="font-bold text-ink truncate">{resolvedLocation.source}</div>
                </div>
                <div>
                  <div className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">Updated</div>
                  <div className="font-bold text-ink flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-ink-muted" />
                    <span>{stalenessMinutes <= 1 ? 'Just now' : `${stalenessMinutes}m ago`}</span>
                  </div>
                </div>
              </div>

              {/* Staleness Note (if older than 15 mins) */}
              {isStale && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Last seen {stalenessMinutes >= 60 ? `${Math.round(stalenessMinutes / 60)} hours ago` : `${stalenessMinutes} minutes ago`}. This may not reflect current position.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons (at least 44px tall) */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${resolvedLocation.lat},${resolvedLocation.lng}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-mint-deep border border-border text-ink font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${resolvedLocation.lat},${resolvedLocation.lng}`}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-mint-deep border border-border text-ink font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>

            <a
              href={`tel:${senior.phone || '917452009877'}`}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-cream font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call {senior.name}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
