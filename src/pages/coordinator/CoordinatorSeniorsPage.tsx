import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InitialsAvatar } from '../../components/coordinator/InitialsAvatar';
import { StatusChip } from '../../components/coordinator/StatusChip';
import { SegmentedTabs } from '../../components/coordinator/SegmentedTabs';
import { CoordinatorSeniorProfilePage } from './CoordinatorSeniorProfilePage';
import { CoordinatorOverviewMap } from '../../components/coordinator/CoordinatorOverviewMap';
import { 
  Search, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Filter,
  UserX,
  Database,
  ShieldAlert,
  Info,
  Calendar,
  HeartPulse,
  Map
} from 'lucide-react';

export const CoordinatorSeniorsPage: React.FC = () => {
  usePageTitle(
    'Seniors Caseload - Care Coordinator',
    'Directory of all enrolled seniors and 200-senior demonstration cohort with baseline triage status.'
  );

  const navigate = useNavigate();
  const { t, seniors, cohortSeniors, setCurrentSeniorId } = useApp();

  // Mode: 'enrolled' (live repository seniors) | 'cohort' (200 demonstration profiles)
  const [viewMode, setViewMode] = useState<'enrolled' | 'cohort'>('cohort');

  // Filters for cohort
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'needs_attention' | 'stable'>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedAdmission, setSelectedAdmission] = useState<string>('all');
  const [selectedAgeBand, setSelectedAgeBand] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const [selectedSeniorId, setSelectedSeniorId] = useState<string>(
    viewMode === 'enrolled' ? (seniors[0]?.id || '') : (cohortSeniors[0]?.seniorId || '')
  );

  // Toggle overview map
  const [showOverviewMap, setShowOverviewMap] = useState(false);

  // Switch view mode
  const handleViewModeChange = (mode: 'enrolled' | 'cohort') => {
    setViewMode(mode);
    setSearchQuery('');
    setFilterTab('all');
    if (mode === 'enrolled') {
      const id = seniors[0]?.id || '';
      setSelectedSeniorId(id);
      setCurrentSeniorId(id);
    } else {
      const id = cohortSeniors[0]?.seniorId || '';
      setSelectedSeniorId(id);
      setCurrentSeniorId(id);
    }
  };

  // Filtered live seniors
  const filteredLiveSeniors = useMemo(() => {
    return seniors.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesPhone = Boolean(s.phone && s.phone.includes(q));
        const matchesCity = Boolean(s.city && s.city.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesCity) return false;
      }
      if (filterTab === 'needs_attention') {
        return s.currentUrgency === 'critical' || s.currentUrgency === 'moderate';
      }
      if (filterTab === 'stable') {
        return s.currentUrgency === 'low';
      }
      return true;
    });
  }, [seniors, searchQuery, filterTab]);

  // Filtered cohort seniors
  const filteredCohortSeniors = useMemo(() => {
    return cohortSeniors.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = s.seniorId.toLowerCase().includes(q);
        const matchRecord = s.recordId.toLowerCase().includes(q);
        const matchCond = s.medicalCondition.toLowerCase().includes(q);
        const matchMed = s.medicationName.toLowerCase().includes(q);
        if (!matchId && !matchRecord && !matchCond && !matchMed) return false;
      }
      // Status
      if (filterTab === 'needs_attention') {
        if (s.currentUrgency !== 'critical' && s.currentUrgency !== 'moderate') return false;
      } else if (filterTab === 'stable') {
        if (s.currentUrgency !== 'low') return false;
      }
      // Condition
      if (selectedCondition !== 'all' && s.medicalCondition !== selectedCondition) {
        return false;
      }
      // Admission
      if (selectedAdmission !== 'all' && s.admissionType !== selectedAdmission) {
        return false;
      }
      // Age Band
      if (selectedAgeBand === '60-69' && (s.age < 60 || s.age > 69)) return false;
      if (selectedAgeBand === '70-79' && (s.age < 70 || s.age > 79)) return false;
      if (selectedAgeBand === '80+' && s.age < 80) return false;
      // Gender
      if (selectedGender !== 'all' && s.gender !== selectedGender) {
        return false;
      }
      return true;
    });
  }, [cohortSeniors, searchQuery, filterTab, selectedCondition, selectedAdmission, selectedAgeBand, selectedGender]);

  const handleSelectSenior = (seniorId: string) => {
    setSelectedSeniorId(seniorId);
    setCurrentSeniorId(seniorId);

    // On mobile (< 1024px), navigate to full page view
    if (window.innerWidth < 1024) {
      navigate(`/coordinator/senior/${seniorId}`);
    }
  };

  const activeSeniorsList = viewMode === 'enrolled' ? filteredLiveSeniors : filteredCohortSeniors;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-forest tracking-tight">
              {t.coordSeniors}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-mint-deep border border-border text-forest font-semibold">
              {viewMode === 'enrolled' ? `${seniors.length} Enrolled` : `${cohortSeniors.length} in Demonstration Cohort`}
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            {viewMode === 'enrolled'
              ? 'Active enrolled seniors under direct coordination.'
              : '200 source-derived senior profiles aged 60+ with 90-day simulated longitudinal monitoring.'}
          </p>
        </div>

        {/* View Mode & Map Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOverviewMap(!showOverviewMap)}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              showOverviewMap
                ? 'bg-forest text-cream border-forest'
                : 'bg-white text-ink border-border hover:bg-mint-deep'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{showOverviewMap ? 'Hide Overview Map' : 'Caseload Overview Map'}</span>
          </button>

          <div className="flex items-center bg-mint-deep/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => handleViewModeChange('cohort')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'cohort'
                  ? 'bg-forest text-cream shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              60+ Demonstration Cohort ({cohortSeniors.length})
            </button>
            <button
              onClick={() => handleViewModeChange('enrolled')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'enrolled'
                  ? 'bg-forest text-cream shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Enrolled Seniors ({seniors.length})
            </button>
          </div>
        </div>
      </div>

      {/* Coordinator Overview Caseload Map (When toggled) */}
      {showOverviewMap && (
        <CoordinatorOverviewMap
          seniors={seniors}
          onSelectSenior={(id) => handleSelectSenior(id)}
        />
      )}

      {/* Provenance and Data Notice Banner for Cohort */}
      {viewMode === 'cohort' && (
        <div className="bg-cream border border-border rounded-xl p-4 text-xs text-ink-muted space-y-2">
          <div className="flex items-center gap-2 text-forest font-bold">
            <Database className="w-4 h-4 text-sage" strokeWidth={1.5} />
            <span>Dataset Provenance & Integrity Statement</span>
          </div>
          <p className="leading-relaxed">
            <strong className="text-ink">Hospital Records (Source):</strong> 200 pseudonymized hospital admission records (Age 60-86). Source identifiers (names, doctors, hospitals, insurance, billing) were permanently excluded. These rows are not verified unique individuals.
          </p>
          <p className="leading-relaxed">
            <strong className="text-ink">Home Monitoring (Simulated):</strong> All 90-day activity steps, resting heart rates, systolic/diastolic BP, medication confirmation events, and text check-in notes are simulated for demonstration (<span className="font-mono text-[11px] bg-mint-deep px-1 rounded">SIMULATED_NOT_OBSERVED</span>). Never present as real patient data or claim clinical validation.
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-cream border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="search"
              placeholder={
                viewMode === 'cohort'
                  ? 'Search by Senior ID (e.g. SW001), condition, or medication...'
                  : 'Search by name, phone or city...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[42px] pl-9 pr-4 py-1.5 rounded-lg bg-mint/50 border border-border text-ink text-sm placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-forest focus:bg-white transition-colors"
            />
          </div>

          {/* Segmented Filter Tabs: All, Needs attention, Stable */}
          <SegmentedTabs
            tabs={[
              { id: 'all', label: 'All', count: viewMode === 'enrolled' ? seniors.length : cohortSeniors.length },
              { 
                id: 'needs_attention', 
                label: 'Needs Attention', 
                count: viewMode === 'enrolled'
                  ? seniors.filter((s) => s.currentUrgency === 'critical' || s.currentUrgency === 'moderate').length
                  : cohortSeniors.filter((s) => s.currentUrgency === 'critical' || s.currentUrgency === 'moderate').length
              },
              { 
                id: 'stable', 
                label: 'Stable', 
                count: viewMode === 'enrolled'
                  ? seniors.filter((s) => s.currentUrgency === 'low').length
                  : cohortSeniors.filter((s) => s.currentUrgency === 'low').length
              },
            ]}
            activeTab={filterTab}
            onChange={(tab) => setFilterTab(tab as any)}
          />
        </div>

        {/* Extended filters for Cohort mode */}
        {viewMode === 'cohort' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/60">
            {/* Condition Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded-lg bg-mint/40 border border-border text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="all">All Conditions</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Asthma">Asthma</option>
                <option value="Obesity">Obesity</option>
                <option value="Arthritis">Arthritis</option>
                <option value="Cancer">Cancer</option>
              </select>
            </div>

            {/* Admission Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Admission Type</label>
              <select
                value={selectedAdmission}
                onChange={(e) => setSelectedAdmission(e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded-lg bg-mint/40 border border-border text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="all">All Types</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Elective">Elective</option>
              </select>
            </div>

            {/* Age Band */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Age Band</label>
              <select
                value={selectedAgeBand}
                onChange={(e) => setSelectedAgeBand(e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded-lg bg-mint/40 border border-border text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="all">All Ages (60+)</option>
                <option value="60-69">60 to 69</option>
                <option value="70-79">70 to 79</option>
                <option value="80+">80 and above</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-semibold text-ink-muted mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded-lg bg-mint/40 border border-border text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (Master List) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-ink-muted px-1">
            <span>Showing {activeSeniorsList.length} senior profiles</span>
            {viewMode === 'cohort' && (
              <span className="font-mono text-[11px]">Day 1 to 90 time-series</span>
            )}
          </div>

          {activeSeniorsList.length === 0 ? (
            <div className="bg-cream border border-border rounded-xl p-8 text-center space-y-2">
              <UserX className="w-8 h-8 text-sage mx-auto" strokeWidth={1.5} />
              <h4 className="text-sm font-bold text-ink">No seniors match criteria</h4>
              <p className="text-xs text-ink-muted max-w-xs mx-auto">
                No profiles match your search or filter settings. Clear or adjust your filters to see more profiles.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {viewMode === 'enrolled'
                ? // Enrolled live seniors list
                  filteredLiveSeniors.map((senior) => {
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
                                <span>Enrolled live senior</span>
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
                  })
                : // Demonstration Cohort seniors list
                  filteredCohortSeniors.map((cs) => {
                    const isSelected = cs.seniorId === selectedSeniorId;
                    const isUrgent = cs.currentUrgency === 'critical';
                    const isModerate = cs.currentUrgency === 'moderate';
                    const statusVariant = isUrgent ? 'critical' : isModerate ? 'warning' : 'success';
                    const statusLabel = isUrgent ? 'Critical' : isModerate ? 'Moderate' : 'Stable';

                    return (
                      <article
                        key={cs.seniorId}
                        onClick={() => handleSelectSenior(cs.seniorId)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-cream border-forest shadow-xs ring-1 ring-forest'
                            : 'bg-cream border-border hover:border-forest/40 hover:bg-mint-deep/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <InitialsAvatar name={cs.seniorId} size="md" />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-sm font-black text-ink">{cs.seniorId}</span>
                                <span className="text-xs text-ink-muted font-normal">
                                  ({cs.age}y {cs.gender === 'Male' ? 'M' : 'F'})
                                </span>
                              </div>
                              <StatusChip label={statusLabel} variant={statusVariant} />
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-mint-deep text-forest font-semibold">
                                {cs.medicalCondition}
                              </span>
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-mint text-ink-muted">
                                Rx: {cs.medicationName}
                              </span>
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-cream border border-border text-ink-muted">
                                {cs.admissionType}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-ink-muted mt-2 pt-1.5 border-t border-border/50">
                              <span>Adherence: {cs.adherenceRate}%</span>
                              <span className="font-bold text-forest">
                                Risk: {cs.currentRiskScore}/100
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
        <div className="hidden lg:block lg:col-span-7 sticky top-4">
          {selectedSeniorId ? (
            <div className="bg-cream/70 border border-border rounded-2xl p-5 shadow-xs max-h-[820px] overflow-y-auto">
              <CoordinatorSeniorProfilePage seniorIdProp={selectedSeniorId} isEmbedded={true} />
            </div>
          ) : (
            <div className="bg-cream border border-border rounded-2xl p-12 text-center text-xs text-ink-muted">
              Select a senior from the list to view their complete hospital admission history, calibrated baseline vitals, 90-day activity trends, medication events, and n8n AI monitoring tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
