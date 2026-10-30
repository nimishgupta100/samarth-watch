import React, { useState, useMemo } from 'react';
import { Senior } from '../../types';
import { LeafletMapView, MapMarkerItem } from '../common/LeafletMapView';
import { StatusChip } from './StatusChip';
import { InitialsAvatar } from './InitialsAvatar';
import { MapPin, Users, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoordinatorOverviewMapProps {
  seniors: Senior[];
  activeSosEvents?: any[];
  onSelectSenior?: (seniorId: string) => void;
}

export const CoordinatorOverviewMap: React.FC<CoordinatorOverviewMapProps> = ({
  seniors,
  activeSosEvents = [],
  onSelectSenior,
}) => {
  const navigate = useNavigate();

  // Coordinator oversees assigned seniors only (e.g. Kamla)
  const assignedSeniors = useMemo(() => {
    return seniors.filter((s) => s.id === 'senior-kamla-001' || s.assignedCoordinatorId.includes('nimish'));
  }, [seniors]);

  const [selectedSeniorId, setSelectedSeniorId] = useState<string>(
    assignedSeniors[0]?.id || 'senior-kamla-001'
  );

  const activeSenior = assignedSeniors.find((s) => s.id === selectedSeniorId) || assignedSeniors[0];

  // Map markers for all assigned seniors
  const markers: MapMarkerItem[] = useMemo(() => {
    return assignedSeniors.map((s) => {
      const isSos = activeSosEvents.some((e) => e.seniorId === s.id && e.status !== 'Resolved');
      return {
        id: s.id,
        lat: 26.8467,
        lng: 80.9462,
        label: isSos ? 'SOS' : s.name[0] || 'K',
        title: s.name,
        isEmergency: isSos,
        accuracyMetres: 45,
        subtitle: `Status: ${s.alertStatus} • ${s.city || 'Lucknow'}`,
      };
    });
  }, [assignedSeniors, activeSosEvents]);

  const center: [number, number] = [26.8467, 80.9462];

  const handleSeniorClick = (id: string) => {
    setSelectedSeniorId(id);
    if (onSelectSenior) {
      onSelectSenior(id);
    } else {
      navigate(`/coordinator/senior/${id}`);
    }
  };

  return (
    <div className="bg-cream border border-border rounded-2xl overflow-hidden shadow-xs space-y-4 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-forest" />
            <h2 className="text-lg sm:text-xl font-bold text-forest">
              Assigned Seniors Location Map
            </h2>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Real-time emergency & last known locations of your caseload ({assignedSeniors.length} assigned senior)
          </p>
        </div>

        <div className="text-xs font-semibold text-ink-muted">
          Location data protected under DPDP Act 2023
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map View on Left (cols 1-8) */}
        <div className="lg:col-span-8 h-[380px] sm:h-[460px] rounded-xl overflow-hidden border border-border">
          <LeafletMapView
            center={center}
            zoom={14}
            markers={markers}
            heightClass="h-full w-full"
            ariaLabel="Coordinator Overview Caseload Map"
            centerButtonLabel="Center Caseload"
          />
        </div>

        {/* Assigned Seniors List Beside / Below (cols 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>Assigned Caseload</span>
              <span>{assignedSeniors.length} Enrolled</span>
            </div>

            <div className="space-y-2">
              {assignedSeniors.map((s) => {
                const isSelected = s.id === selectedSeniorId;
                const isSos = activeSosEvents.some((e) => e.seniorId === s.id && e.status !== 'Resolved');

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSeniorClick(s.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-mint-deep/60 border-forest'
                        : 'bg-white border-border hover:bg-mint-deep/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <InitialsAvatar name={s.name} size="sm" />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-ink truncate flex items-center gap-2">
                          <span>{s.name}</span>
                          {isSos && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-alert-red font-black text-[10px] rounded">
                              SOS
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-ink-muted" />
                          <span>Last seen 35m ago</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {activeSenior && (
            <div className="p-4 rounded-xl bg-white border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
                <span>Selected: {activeSenior.name}</span>
                <span className="text-forest font-bold">{activeSenior.city || 'Lucknow'}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/coordinator/senior/${activeSenior.id}`)}
                className="w-full min-h-[44px] py-2 px-3 rounded-lg bg-forest text-cream font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>View Full Senior Profile & Vitals →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
