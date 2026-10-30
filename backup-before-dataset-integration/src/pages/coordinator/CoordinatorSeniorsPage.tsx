import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { StatusChip } from '../../components/coordinator/StatusChip';
import { SegmentedTabs } from '../../components/coordinator/SegmentedTabs';
import { CoordinatorSeniorProfilePage } from './CoordinatorSeniorProfilePage';
import { 
  Search, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Phone, 
  Filter,
  UserX
} from 'lucide-react';

export const CoordinatorSeniorsPage: React.FC = () => {
  usePageTitle(
    'Seniors Caseload - Care Coordinator',
    'Directory of all enrolled seniors under active care coordination with baseline triage status.'
  );

  const navigate = useNavigate();
  const { t, seniors, setCurrentSeniorId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'needs_attention' | 'stable'>('all');
  const [selectedSeniorId, setSelectedSeniorId] = useState<string>(seniors[0]?.id || '');

  // Filtered seniors
  const filteredSeniors = useMemo(() => {
    return seniors.filter((s) => {
      // Search filter (name or phone or city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesPhone = Boolean(s.phone && s.phone.includes(q));
        const matchesCity = Boolean(s.city && s.city.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesCity) return false;
      }

      // Status tab filter
      if (filterTab === 'needs_attention') {
        return s.currentUrgency === 'critical' || s.currentUrgency === 'moderate';
      }
      if (filterTab === 'stable') {
        return s.currentUrgency === 'low';
      }
      return true;
    });
  }, [seniors, searchQuery, filterTab]);

  const handleSelectSenior = (seniorId: string) => {
    setSelectedSeniorId(seniorId);
    setCurrentSeniorId(seniorId);

    // On mobile (< 1024px), navigate to full page view
    if (window.innerWidth < 1024) {
      navigate(`/coordinator/senior/${seniorId}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-forest tracking-tight">
            {t.coordSeniors}
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Active caseload directory ({seniors.length} registered senior{seniors.length === 1 ? '' : 's'})
          </p>
        </div>

        {/* Segmented Filter Tabs: All, Needs attention, Stable */}
        <SegmentedTabs
          tabs={[
            { id: 'all', label: 'All', count: seniors.length },
            { 
              id: 'needs_attention', 
              label: 'Needs Attention', 
              count: seniors.filter((s) => s.currentUrgency === 'critical' || s.currentUrgency === 'moderate').length 
            },
            { 
              id: 'stable', 
              label: 'Stable', 
              count: seniors.filter((s) => s.currentUrgency === 'low').length 
            },
          ]}
          activeTab={filterTab}
          onChange={(tab) => setFilterTab(tab as any)}
        />
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (Master List) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="search"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-4 py-2 rounded-lg bg-cream border border-border text-ink text-base sm:text-sm placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-colors"
            />
          </div>

          {/* Senior Cards List */}
          {filteredSeniors.length === 0 ? (
            <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-2">
              <UserX className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-bold text-ink">No seniors yet</h4>
              <p className="text-xs text-ink-muted max-w-xs mx-auto">
                No enrolled seniors match your search or filter criteria. Check your spelling or switch filters.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSeniors.map((senior) => {
                const isSelected = senior.id === selectedSeniorId;
                const isUrgent = senior.currentUrgency === 'critical';
                const isModerate = senior.currentUrgency === 'moderate';
                const statusVariant = isUrgent ? 'critical' : isModerate ? 'warning' : 'success';
                const statusLabel = isUrgent ? 'Critical' : isModerate ? 'Moderate' : 'Stable';

                return (
                  <article
                    key={senior.id}
                    onClick={() => handleSelectSenior(senior.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all select-none ${
                      isSelected
                        ? 'bg-cream border-forest shadow-xs ring-1 ring-forest'
                        : 'bg-cream border-border hover:border-forest/40 hover:bg-mint-deep/30'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <InitialsAvatar name={senior.name} size="md" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-ink truncate hover:text-forest transition-colors">
                            {senior.name}
                          </h4>
                          <StatusChip label={statusLabel} variant={statusVariant} />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-ink-muted mt-1">
                          <MapPin className="w-3 h-3 text-sage shrink-0" strokeWidth={1.5} />
                          <span className="truncate">{senior.city || 'Delhi'}</span>
                          {senior.phone && (
                            <>
                              <span>:</span>
                              <span className="truncate">{senior.phone}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-ink-muted mt-2 pt-2 border-t border-border/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span>Last check-in: Today 08:30 AM</span>
                          </span>
                          <span className="font-semibold text-forest">
                            Score: {senior.currentRiskScore}/100
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 self-center hidden lg:block" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Pane (Detail Pane on Laptop) */}
        <div className="hidden lg:block lg:col-span-7">
          {selectedSeniorId ? (
            <div className="bg-cream/50 border border-border rounded-2xl p-6 shadow-xs">
              <CoordinatorSeniorProfilePage seniorIdProp={selectedSeniorId} isEmbedded={true} />
            </div>
          ) : (
            <div className="bg-cream border border-border rounded-2xl p-12 text-center text-xs text-ink-muted">
              Select a senior from the list to view their full care profile, vitals baseline, and prescriptions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
