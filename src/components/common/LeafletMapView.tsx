import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, AlertTriangle, MapPin, EyeOff } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  label: string; // e.g. "K" or "SOS"
  title: string;
  isEmergency?: boolean;
  accuracyMetres?: number;
  subtitle?: string;
}

export interface LeafletMapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarkerItem[];
  accuracyMetres?: number;
  trailPoints?: [number, number][];
  onCenterClick?: () => void;
  heightClass?: string;
  ariaLabel?: string;
  useSimpleCard?: boolean;
  onToggleSimpleCard?: () => void;
  centerButtonLabel?: string;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  center,
  zoom = 15,
  markers = [],
  accuracyMetres,
  trailPoints = [],
  onCenterClick,
  heightClass = 'h-[360px] sm:h-[420px]',
  ariaLabel = 'Interactive location map',
  useSimpleCard = false,
  onToggleSimpleCard,
  centerButtonLabel = 'Center on Kamla',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [tileError, setTileError] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (useSimpleCard) return;
    if (!containerRef.current) return;

    // Destroy any existing instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false, // Custom or positioned
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Standard Tiles with required attribution
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      tileLayer.on('tileerror', () => {
        setTileError(true);
      });

      tileLayer.addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size after rendering to avoid gray tiles
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 200);

      return () => {
        clearTimeout(timer);
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (e) {
      setTileError(true);
    }
  }, [useSimpleCard]);

  // Update Markers, Trail, and Circles
  useEffect(() => {
    if (useSimpleCard || !mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const group = markersLayerRef.current;
    group.clearLayers();

    // 1. Accuracy circle around primary center
    if (accuracyMetres && accuracyMetres > 0) {
      L.circle(center, {
        radius: accuracyMetres,
        color: '#1C3F32',
        fillColor: '#2E6B56',
        fillOpacity: 0.12,
        weight: 1.5,
      }).addTo(group);
    }

    // 2. Trail line (if present in live mode)
    if (trailPoints.length > 1) {
      L.polyline(trailPoints, {
        color: '#2E6B56',
        weight: 3.5,
        opacity: 0.75,
        dashArray: '6, 8',
      }).addTo(group);
    }

    // 3. Markers
    markers.forEach((m) => {
      const isSos = Boolean(m.isEmergency);
      const bg = isSos ? '#C93B2B' : '#1C3F32';
      const border = isSos ? '#852317' : '#0B1713';
      const labelText = m.label || (isSos ? 'SOS' : 'K');

      const customIcon = L.divIcon({
        className: 'leaflet-clean-marker',
        html: `
          <div style="
            background: ${bg};
            border: 2px solid ${border};
            color: #ffffff;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 14px;
            font-family: inherit;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            letter-spacing: -0.02em;
          ">
            ${labelText}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon });

      if (m.title || m.subtitle) {
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <div style="font-weight: 700; font-size: 13px; color: #111827;">${m.title}</div>
            ${m.subtitle ? `<div style="font-size: 11px; color: #4B5563; margin-top: 2px;">${m.subtitle}</div>` : ''}
            <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">${m.lat.toFixed(4)}°, ${m.lng.toFixed(4)}°</div>
          </div>
        `);
      }

      marker.addTo(group);
    });

    map.panTo(center, { animate: true });
  }, [center, zoom, markers, accuracyMetres, trailPoints, useSimpleCard]);

  // Center button click handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
    onCenterClick?.();
  };

  // Fallback to simple card if tile error or user setting chosen
  if (useSimpleCard || tileError) {
    return (
      <div
        className={`w-full ${heightClass} bg-[#F4F8F5] border-2 border-[#CBDCD2] rounded-2xl p-6 flex flex-col justify-between`}
        role="region"
        aria-label="Simple location view"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1C3F32] font-bold text-base">
              <MapPin className="w-5 h-5 text-[#1C3F32]" />
              <span>Location Coordinates (Simple View)</span>
            </div>
            {onToggleSimpleCard && (
              <button
                type="button"
                onClick={onToggleSimpleCard}
                className="text-xs font-bold text-[#1C3F32] underline min-h-[44px] px-3 py-2"
              >
                Switch to Map
              </button>
            )}
          </div>

          {tileError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Map tiles could not be loaded. Displaying precise coordinates instead.</span>
            </div>
          )}

          <div className="p-4 bg-white rounded-xl border border-[#CBDCD2] space-y-1.5 font-mono text-sm">
            <div className="text-ink font-bold">Latitude: {center[0].toFixed(5)}° N</div>
            <div className="text-ink font-bold">Longitude: {center[1].toFixed(5)}° E</div>
            {accuracyMetres && (
              <div className="text-ink-muted text-xs font-sans">
                Accuracy radius: ±{Math.round(accuracyMetres)} metres
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-xs text-ink-muted border-t border-[#CBDCD2]">
          <span>Public OpenStreetMap tile service fallback</span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${center[0]},${center[1]}`}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#1C3F32] underline min-h-[44px] flex items-center"
          >
            Open in External Maps →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-[#CBDCD2] shadow-xs group`}>
      {/* Actual Leaflet Map Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full z-10"
        aria-label={ariaLabel}
        role="application"
        tabIndex={0}
      />

      {/* Floating "Center on Kamla" Button (At least 44px tall) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-[#1C3F32] border border-[#CBDCD2] font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#1C3F32]"
          aria-label={centerButtonLabel}
        >
          <Crosshair className="w-4 h-4 text-[#1C3F32]" />
          <span>{centerButtonLabel}</span>
        </button>

        {onToggleSimpleCard && (
          <button
            type="button"
            onClick={onToggleSimpleCard}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-ink-muted hover:text-ink border border-[#CBDCD2] font-semibold text-xs shadow-md flex items-center gap-1.5 transition-colors"
            title="Use simple card instead of map"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simple Card</span>
          </button>
        )}
      </div>

      {/* Map Privacy & Light Use Attribution Banner */}
      <div className="absolute bottom-1 left-2 z-20 text-[10px] text-slate-700 bg-white/85 px-2 py-0.5 rounded backdrop-blur-xs border border-slate-200 pointer-events-none">
        OpenStreetMap light use
      </div>
    </div>
  );
};
