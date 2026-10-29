import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SignalType, UrgencyLevel, RecommendedAction } from '../types';
import { Sparkline } from '../components/common/Sparkline';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Activity, 
  Pill, 
  MessageSquare, 
  VolumeX, 
  PhoneCall, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight, 
  UserCheck, 
  Info,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Flame
} from 'lucide-react';

export const TodaysPriorities: React.FC = () => {
  const { 
    seniors, 
    handleAlertAction, 
    handleFeedback, 
    precisionRate, 
    setCurrentSeniorId 
  } = useApp();

  // Filters state
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | UrgencyLevel>('all');
  const [signalFilter, setSignalFilter] = useState<'all' | SignalType>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusTab, setStatusTab] = useState<'active' | 'all' | 'resolved'>('active');

  // Daily alert cap constant for alert fatigue prevention
  const DAILY_ALERT_CAP = 15;

  // The 12 top alert seniors are the priority caseload
  const prioritySeniors = useMemo(() => {
    return seniors.slice(0, 15);
  }, [seniors]);

  // Unique cities from priority caseload
  const cities = useMemo(() => {
    const list = Array.from(new Set(prioritySeniors.map(s => s.city)));
    return ['all', ...list];
  }, [prioritySeniors]);

  // Filtered list
  const filteredSeniors = useMemo(() => {
    return prioritySeniors.filter(s => {
      // Status filter
      if (statusTab === 'active' && s.alertStatus !== 'pending') return false;
      if (statusTab === 'resolved' && s.alertStatus === 'pending') return false;

      // Urgency filter
      if (urgencyFilter !== 'all' && s.currentUrgency !== urgencyFilter) return false;

      // Signal filter
      if (signalFilter !== 'all' && !s.activeSignals.includes(signalFilter)) return false;

      // City filter
      if (cityFilter !== 'all' && s.city !== cityFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(query);
        const matchCity = s.city.toLowerCase().includes(query);
        const matchReason = s.topReasons.some(r => r.toLowerCase().includes(query));
        if (!matchName && !matchCity && !matchReason) return false;
      }

      return true;
    });
  }, [prioritySeniors, urgencyFilter, signalFilter, cityFilter, searchQuery, statusTab]);

  const activeAlertsCount = prioritySeniors.filter(s => s.alertStatus === 'pending').length;
  const criticalCount = prioritySeniors.filter(s => s.currentUrgency === 'critical' && s.alertStatus === 'pending').length;
  const capPercentage = Math.round((prioritySeniors.length / DAILY_ALERT_CAP) * 100);

  const getActionChipStyle = (action: RecommendedAction) => {
    switch (action) {
      case 'Schedule doctor visit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Call today':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medicine review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contact family':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Header Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Thursday, October 29, 2026 • Morning Briefing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good morning, Ananya
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              <strong className="text-red-600 font-bold">{activeAlertsCount} seniors</strong> need your attention today out of your 48 active caseload.
              Signals are ranked by baseline deviation risk score.
            </p>
          </div>

          {/* Alert Fatigue Protection & Precision Stat Cards */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Daily Alert Cap Meter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 min-w-[200px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Daily Alert Cap
                </span>
                <span className="font-bold text-slate-900">
                  {prioritySeniors.length} / {DAILY_ALERT_CAP}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    capPercentage > 90 ? 'bg-amber-500' : 'bg-teal-600'
                  }`}
                  style={{ width: `${Math.min(100, capPercentage)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" /> Max 15 alerts/day prevents fatigue
              </p>
            </div>

            {/* Live Model Precision Pill */}
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3 min-w-[170px]">
              <div className="text-[11px] font-semibold text-teal-800">Alert Precision this week</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-teal-900">{precisionRate}%</span>
                <span className="text-[11px] text-teal-700 font-medium">↑ High trust</span>
              </div>
              <div className="text-[10px] text-teal-600 mt-0.5">Updated live from thumbs feedback</div>
            </div>

          </div>
        </div>

        {/* Quick Triage Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-red-50/60 p-2.5 rounded-lg border border-red-100">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
              {criticalCount}
            </div>
            <div>
              <div className="text-xs font-bold text-red-900">Critical Priority</div>
              <div className="text-[11px] text-red-700">Risk Score &gt; 70</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              {prioritySeniors.filter(s => s.currentUrgency === 'moderate' && s.alertStatus === 'pending').length}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">Moderate Watch</div>
              <div className="text-[11px] text-amber-700">Risk Score 45 - 70</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
              48
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Total Caseload</div>
              <div className="text-[11px] text-slate-500">Under Care Coordinator Ananya</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {prioritySeniors.filter(s => s.alertStatus === 'done').length}
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">Handled Today</div>
              <div className="text-[11px] text-emerald-700">Resolved or snoozed</div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search senior by name, city, or symptom cue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusTab('active')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Action ({prioritySeniors.filter(s => s.alertStatus === 'pending').length})
            </button>
            <button
              onClick={() => setStatusTab('resolved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'resolved'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({prioritySeniors.filter(s => s.alertStatus !== 'pending').length})
            </button>
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts ({prioritySeniors.length})
            </button>
          </div>

        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          
          <span className="font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setUrgencyFilter('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium ${
                urgencyFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Urgency
            </button>
            <button
              onClick={() => setUrgencyFilter('critical')}
              className={`px-2 py-1 rounded text-[11px] font-medium ${
                urgencyFilter === 'critical' ? 'bg-red-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical (&gt;70)
            </button>
            <button
              onClick={() => setUrgencyFilter('moderate')}
              className={`px-2 py-1 rounded text-[11px] font-medium ${
                urgencyFilter === 'moderate' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Moderate (45-70)
            </button>
          </div>

          {/* Signal Type Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setSignalFilter('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium ${
                signalFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Signals
            </button>
            <button
              onClick={() => setSignalFilter('vitals')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'vitals' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3 h-3" /> Vitals
            </button>
            <button
              onClick={() => setSignalFilter('medication')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'medication' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3 h-3" /> Medication
            </button>
            <button
              onClick={() => setSignalFilter('call_notes')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'call_notes' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" /> Call Notes
            </button>
            <button
              onClick={() => setSignalFilter('silence')}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 ${
                signalFilter === 'silence' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <VolumeX className="w-3 h-3" /> Silence
            </button>
          </div>

          {/* City Filter Dropdown */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Cities</option>
            {cities.filter(c => c !== 'all').map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Alert Cards Ranked List */}
      <div className="space-y-4">
        {filteredSeniors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No alerts match your filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All filtered seniors are currently reviewed or parameters are steady within personal baselines.
            </p>
            <button
              onClick={() => {
                setUrgencyFilter('all');
                setSignalFilter('all');
                setCityFilter('all');
                setSearchQuery('');
                setStatusTab('active');
              }}
              className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredSeniors.map((senior, rankIdx) => {
            const isCritical = senior.currentUrgency === 'critical';
            const isDone = senior.alertStatus === 'done';
            const isSnoozed = senior.alertStatus === 'snoozed';

            return (
              <div
                key={senior.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isDone 
                    ? 'bg-slate-50/70 border-slate-200 opacity-70' 
                    : isCritical
                      ? 'bg-white border-red-200 hover:border-red-300 shadow-sm hover:shadow-md'
                      : 'bg-white border-amber-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="p-5 sm:p-6">
                  
                  {/* Top Row: Rank, Score Badge, Name & City, Days Shift, Sparkline */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    
                    <div className="flex items-start sm:items-center gap-3.5">
                      
                      {/* Priority Rank Indicator */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Rank</span>
                        <span className="text-lg font-black text-slate-700">#{rankIdx + 1}</span>
                      </div>

                      {/* Urgency Risk Score Circle */}
                      <div 
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-sm ${
                          isCritical 
                            ? 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-200' 
                            : 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-200'
                        }`}
                      >
                        <span className="text-xl font-black leading-none">{senior.currentRiskScore}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">Risk</span>
                      </div>

                      {/* Senior Name, Age, City */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors">
                            <Link 
                              to={`/senior/${senior.id}`}
                              onClick={() => setCurrentSeniorId(senior.id)}
                            >
                              {senior.name}
                            </Link>
                          </h2>
                          <span className="text-xs font-semibold text-slate-500">
                            {senior.age} yrs • {senior.gender}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {senior.city} ({senior.area})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{senior.livingSituation}</span>
                          <span>•</span>
                          <span className="text-teal-700 font-medium">{senior.assignedCoordinatorName}</span>
                          
                          {senior.familyConsentGranted ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.2 rounded border border-green-200">
                              Family Consent Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              Consent Paused
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right side: Drift days badge & 14-day trend sparkline */}
                    <div className="flex items-center gap-5 sm:justify-end shrink-0 pl-16 sm:pl-0">
                      
                      {/* Days since baseline shift */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {senior.daysSinceBaselineShift} days drifting
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">from personal baseline</div>
                      </div>

                      {/* 14-day sparkline */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-1.5 text-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">14d Trend</div>
                        <Sparkline 
                          data={senior.trend14Days} 
                          color={isCritical ? '#DC2626' : '#D97706'} 
                          width={95}
                          height={28}
                        />
                      </div>

                    </div>

                  </div>

                  {/* Middle Row: Top 3 Plain Language Reasons */}
                  <div className="py-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Top 3 Risk Drivers (Plain Language Explanation)
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {senior.topReasons.map((reason, rIdx) => (
                        <li 
                          key={rIdx}
                          className="text-xs text-slate-700 bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {rIdx + 1}
                          </span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Row: Recommended Action Chip & Quick Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    
                    {/* Recommended action chip */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500">Recommended Action:</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${getActionChipStyle(senior.recommendedAction)}`}>
                        <PhoneCall className="w-3.5 h-3.5" />
                        {senior.recommendedAction}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Thumbs Feedback (Useful / Not useful) */}
                      <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
                        <button
                          onClick={() => handleFeedback(senior.id, 'useful')}
                          title="Mark alert as useful (trains precision filter)"
                          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                            senior.feedback === 'useful'
                              ? 'bg-teal-600 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-[11px]">Useful</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(senior.id, 'not_useful')}
                          title="Mark alert as false alarm / not useful"
                          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                            senior.feedback === 'not_useful'
                              ? 'bg-rose-600 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span className="text-[11px]">Not useful</span>
                        </button>
                      </div>

                      {/* Snooze 24h Button */}
                      <button
                        onClick={() => handleAlertAction(senior.id, isSnoozed ? 'pending' : 'snoozed')}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                          isSnoozed 
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isSnoozed ? 'Snoozed 24h' : 'Snooze 24h'}</span>
                      </button>

                      {/* Mark Done Button */}
                      <button
                        onClick={() => handleAlertAction(senior.id, isDone ? 'pending' : 'done')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-xs'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Resolved' : 'Mark as done'}</span>
                      </button>

                      {/* View Profile & Script Link */}
                      <Link
                        to={`/senior/${senior.id}`}
                        onClick={() => setCurrentSeniorId(senior.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-xs ml-1"
                      >
                        <span>Open Details & Script</span>
                        <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
                      </Link>

                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
