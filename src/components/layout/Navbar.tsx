import React, { useState } from 'react';
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
  Menu,
  X,
  Globe,
  Phone
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Top priority seniors for focus selector
  const prioritySeniors = seniors.slice(0, 12);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs">
      
      {/* Top Bar: Guardrail notice, domain settings, precision, and quick reset */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30">
            <ShieldAlert className="w-3 h-3 text-amber-400" /> Risk Signal Detection Only - Not a Diagnosis
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            Seeded 200 seniors cohort • 90-day time series
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/custom-domain"
            className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            title="Custom Domain Settings"
          >
            <Globe className="w-3 h-3 text-teal-400" />
            <span className="hidden sm:inline">care.samarth.in</span>
          </Link>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 hidden sm:inline">Precision this week:</span>
            <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-semibold text-[11px] border border-teal-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-400" /> {precisionRate}%
            </span>
          </div>

          <span className="text-slate-600">|</span>

          <button 
            onClick={resetDemoData}
            title="Reset all demo actions and feedback"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Clickable Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobile}>
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white border border-slate-700 shadow-xs">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">Samarth</span>
                <span className="text-base sm:text-lg font-extrabold text-teal-700">Watch</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold uppercase px-1.5 py-0.5 rounded border border-slate-200">
                  Early Warning
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Care Coordinator Intelligence</p>
            </div>
          </Link>

          {/* Senior Selector Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 px-2">Focus Senior:</span>
            <select
              value={currentSeniorId}
              onChange={(e) => setCurrentSeniorId(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              {prioritySeniors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.age}y, {s.city}) - Score: {s.currentRiskScore} ({s.currentUrgency.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Role Switcher (Crisp rectangles, NO pill shapes, NO emojis) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setRole('coordinator')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === 'coordinator'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-teal-700" />
              <span>Coordinator</span>
            </button>

            <button
              onClick={() => setRole('manager')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === 'manager'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
              <span>Ops Manager</span>
            </button>

            <button
              onClick={() => setRole('family')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === 'family'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Family Member</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Desktop Secondary Navigation Links */}
        <nav aria-label="Desktop Navigation" className="hidden md:flex items-center space-x-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Priorities</span>
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">12</span>
          </Link>

          <Link
            to={`/senior/${currentSeniorId}`}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname.startsWith('/senior') 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Senior Detail & Baseline</span>
          </Link>

          <Link
            to="/voice-checkin"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/voice-checkin' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Voice & IVR Simulator</span>
          </Link>

          <Link
            to="/operations"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/operations' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Operations Dashboard</span>
          </Link>

          <Link
            to="/family-summary"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/family-summary' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Family Weekly Summary</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          <Link
            to="/model-evaluation"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/model-evaluation' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Model Benchmark (Judges)</span>
          </Link>

          <Link
            to="/privacy-safety"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/privacy-safety' 
                ? 'bg-slate-900 text-white font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Privacy & Safety</span>
          </Link>
        </nav>

        {/* Mobile Navigation Drawer / Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-4 animate-fadeIn">
            
            {/* Mobile Role Switcher */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Role</div>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => { setRole('coordinator'); closeMobile(); }}
                  className={`py-1.5 text-center text-xs font-semibold rounded-md ${
                    role === 'coordinator' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Coordinator
                </button>
                <button
                  onClick={() => { setRole('manager'); closeMobile(); }}
                  className={`py-1.5 text-center text-xs font-semibold rounded-md ${
                    role === 'manager' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Manager
                </button>
                <button
                  onClick={() => { setRole('family'); closeMobile(); }}
                  className={`py-1.5 text-center text-xs font-semibold rounded-md ${
                    role === 'family' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  Family
                </button>
              </div>
            </div>

            {/* Mobile Senior Focus Picker */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Focus Senior</div>
              <select
                value={currentSeniorId}
                onChange={(e) => { setCurrentSeniorId(e.target.value); closeMobile(); }}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-md p-2"
              >
                {prioritySeniors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.age}y, {s.city}) - Score: {s.currentRiskScore}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Links List */}
            <nav aria-label="Mobile Navigation" className="space-y-1 text-xs font-medium">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Today's Priorities
                </span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">12 Active</span>
              </Link>

              <Link
                to={`/senior/${currentSeniorId}`}
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Activity className="w-4 h-4 text-teal-600" />
                Senior Detail & Baseline
              </Link>

              <Link
                to="/voice-checkin"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <PhoneCall className="w-4 h-4 text-blue-600" />
                Voice & IVR Simulator
              </Link>

              <Link
                to="/operations"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Operations Dashboard
              </Link>

              <Link
                to="/family-summary"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Heart className="w-4 h-4 text-rose-600" />
                Family Weekly Summary
              </Link>

              <Link
                to="/model-evaluation"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Model Benchmark (Judges)
              </Link>

              <Link
                to="/privacy-safety"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Lock className="w-4 h-4 text-slate-600" />
                Privacy & Safety
              </Link>

              <Link
                to="/custom-domain"
                onClick={closeMobile}
                className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-100 text-slate-800"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                Custom Domain (care.samarth.in)
              </Link>
            </nav>

          </div>
        )}

      </div>
    </header>
  );
};
