import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  BarChart3, 
  PhoneCall, 
  Lock, 
  Heart, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    currentSeniorId, 
    setCurrentSeniorId, 
    seniors, 
    precisionRate,
    resetDemoData
  } = useApp();

  const location = useLocation();

  // Top 12 seniors for the quick switcher
  const prioritySeniors = seniors.slice(0, 12);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Banner: Strict non-diagnostic disclaimer & Precision Metric */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-500/30">
            <ShieldAlert className="w-3 h-3" /> Risk Signal Detection Only — Not a Diagnosis
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            Hackathon Live Prototype • Seeded 200 seniors • 90-day time series
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Alert Precision this week:</span>
            <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-semibold text-[11px] border border-teal-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-400" /> {precisionRate}%
            </span>
          </div>

          <button 
            onClick={resetDemoData}
            title="Reset all demo actions and feedback"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo and Tagline */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-900 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">Samarth</span>
                <span className="text-lg font-extrabold text-teal-600">Watch</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase px-1.5 py-0.5 rounded border border-slate-200">
                  Early Warning
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Care Coordinator Intelligence</p>
            </div>
          </Link>

          {/* Quick Senior Selector Dropdown */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 px-2">Focus Senior:</span>
            <select
              value={currentSeniorId}
              onChange={(e) => setCurrentSeniorId(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-2.5 py-1 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-xs cursor-pointer"
            >
              {prioritySeniors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.age}y, {s.city}) - Score: {s.currentRiskScore} ({s.currentUrgency.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">Role</span>
            
            <button
              onClick={() => setRole('coordinator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'coordinator'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Coordinator</span>
            </button>

            <button
              onClick={() => setRole('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'manager'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ops Manager</span>
            </button>

            <button
              onClick={() => setRole('family')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'family'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Family Member</span>
            </button>
          </div>

        </div>

        {/* Secondary Navigation Row: Dynamic Links tailored to role */}
        <div className="flex items-center space-x-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs">
          
          {/* Always Available Hero Pages */}
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/' 
                ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Priorities</span>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">12</span>
          </Link>

          <Link
            to={`/senior/${currentSeniorId}`}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname.startsWith('/senior') 
                ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Senior Detail & Baseline</span>
          </Link>

          <Link
            to="/voice-checkin"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/voice-checkin' 
                ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
            <span>Voice / IVR Check-in Demo</span>
          </Link>

          <Link
            to="/operations"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/operations' 
                ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Operations Dashboard</span>
          </Link>

          <Link
            to="/family-summary"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/family-summary' 
                ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Family Weekly Summary</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          {/* Technical Judges Pages */}
          <Link
            to="/model-evaluation"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/model-evaluation' 
                ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200' 
                : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold">Model & Evaluation (Judges)</span>
          </Link>

          <Link
            to="/privacy-safety"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/privacy-safety' 
                ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-300' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Privacy & Safety</span>
          </Link>

        </div>
      </div>
    </header>
  );
};
