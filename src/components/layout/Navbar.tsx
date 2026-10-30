import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { LanguageSelector } from '../common/LanguageSelector';
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
  FastForward,
  Play,
  LogOut,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    currentSeniorId, 
    setCurrentSeniorId, 
    seniors, 
    precisionRate,
    resetDemoData,
    demoSpeedFast,
    setDemoSpeedFast
  } = useApp();

  const { currentUser, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Top priority seniors for focus selector
  const prioritySeniors = seniors.slice(0, 12);

  const closeMobile = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  const handleRoleSelect = (targetRole: 'coordinator' | 'manager' | 'family' | 'senior') => {
    setRole(targetRole);
    if (targetRole === 'senior') {
      navigate('/senior-home');
    } else if (targetRole === 'family') {
      navigate('/family');
    } else if (targetRole === 'coordinator') {
      navigate('/coordinator');
    } else if (targetRole === 'manager') {
      navigate('/ops');
    }
    closeMobile();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMobile();
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-xs border-b border-mint-border shadow-xs text-ink">
      
      {/* Top Bar: Guardrail notice, domain settings, precision, and quick reset */}
      <div className="bg-mint-deep text-forest text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 border-b border-mint-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-mint text-forest px-2 py-0.5 rounded text-[11px] font-semibold border border-mint-border">
            <ShieldAlert className="w-3 h-3 text-forest" /> Risk Signal Detection Only : Not a Diagnosis
          </span>
          <span className="hidden md:inline text-sage">|</span>
          <span className="hidden md:inline text-ink-muted">
            Seeded 200 seniors cohort : 90-day time series
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Speed Controller */}
          <button
            onClick={() => setDemoSpeedFast(!demoSpeedFast)}
            title="Toggle virtual demo clock speed"
            className={`text-[11px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 border transition-colors ${
              demoSpeedFast
                ? 'bg-amber-100 text-alert-amber border-amber-300 font-bold'
                : 'bg-mint text-ink-muted border-mint-border hover:text-forest'
            }`}
          >
            {demoSpeedFast ? <FastForward className="w-3 h-3 text-alert-amber" /> : <Play className="w-3 h-3 text-ink-faint" />}
            <span>Clock: {demoSpeedFast ? '60x Fast (Demo)' : '1x Realtime'}</span>
          </button>

          <span className="text-sage hidden sm:inline">|</span>

          <Link
            to="/coordinator/custom-domain"
            className="text-[11px] text-ink-muted hover:text-forest flex items-center gap-1 transition-colors"
            title="Custom Domain Settings"
          >
            <Globe className="w-3 h-3 text-forest" />
            <span className="hidden sm:inline">care.samarth.in</span>
          </Link>

          <span className="text-sage hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink-muted hidden sm:inline">Precision this week:</span>
            <span className="bg-mint text-forest px-2 py-0.5 rounded font-semibold text-[11px] border border-mint-border flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-forest" /> {precisionRate}%
            </span>
          </div>

          <span className="text-sage">|</span>

          <button 
            onClick={resetDemoData}
            title="Reset all demo actions and feedback"
            className="text-[11px] text-ink-muted hover:text-forest flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>

          {/* Current user info and logout */}
          {currentUser && (
            <>
              <span className="text-sage hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-ink">
                <User className="w-3 h-3 text-forest" />
                <span>{currentUser.name}</span>
                <span className="text-ink-muted">({currentUser.role})</span>
              </span>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="text-[11px] text-ink-muted hover:text-alert-red flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Clickable Brand Logo & Tagline */}
          <Link to="/coordinator" className="flex items-center gap-3 shrink-0" onClick={closeMobile}>
            <div className="bg-forest p-2.5 rounded-lg text-cream font-bold shadow-xs">
              <Activity className="w-5 h-5 text-cream" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-forest">Samarth</span>
                <span className="text-base sm:text-lg font-extrabold text-sage-dark">Watch</span>
                <span className="text-[10px] bg-mint text-forest font-bold uppercase px-1.5 py-0.5 rounded border border-mint-border">
                  Early Warning
                </span>
              </div>
              <p className="text-[11px] text-ink-muted font-semibold tracking-wider uppercase block mt-0.5 hidden sm:block">AI Wellbeing Intelligence</p>
            </div>
          </Link>

          {/* Senior Selector Dropdown (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 bg-mint p-1.5 rounded-lg border border-mint-border">
            <span className="text-xs font-semibold text-ink-muted px-2">Focus Senior:</span>
            <select
              value={currentSeniorId}
              onChange={(e) => setCurrentSeniorId(e.target.value)}
              className="text-xs font-medium text-ink bg-cream border border-mint-border rounded px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-forest cursor-pointer"
            >
              {prioritySeniors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.age ? `${s.age}y` : 'Age N/A'}, {s.city || 'City N/A'}) : Score: {s.currentRiskScore} ({s.currentUrgency.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Role Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-mint p-1 rounded-lg border border-mint-border">
            <button
              onClick={() => handleRoleSelect('coordinator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === 'coordinator' && location.pathname.startsWith('/coordinator')
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-ink-muted hover:text-forest'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Coordinator</span>
            </button>

            <button
              onClick={() => handleRoleSelect('senior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                location.pathname === '/senior-home'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-ink-muted hover:text-forest'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Senior Mode</span>
            </button>

            <button
              onClick={() => handleRoleSelect('family')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                location.pathname === '/family'
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-ink-muted hover:text-forest'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Family View</span>
            </button>

            <button
              onClick={() => handleRoleSelect('manager')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                location.pathname.startsWith('/ops')
                  ? 'bg-forest text-cream shadow-xs font-bold'
                  : 'text-ink-muted hover:text-forest'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Operations</span>
            </button>
          </div>

          {/* Right Tools: Notification Center & Language Selector */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <LanguageSelector />

            {/* Mobile Menu Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg border border-mint-border bg-cream text-ink hover:text-forest focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Desktop Secondary Navigation Links */}
        <nav aria-label="Desktop Navigation" className="hidden md:flex items-center space-x-1 py-2 overflow-x-auto no-scrollbar border-t border-mint-border text-xs">
          <Link
            to="/coordinator"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/coordinator' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-alert-amber" />
            <span>Today's Priorities</span>
            <span className="bg-alert-red text-cream text-[10px] font-bold px-1.5 py-0.2 rounded">1</span>
          </Link>

          <Link
            to="/senior-home"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/senior-home' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-forest" />
            <span>Senior View</span>
          </Link>

          <Link
            to="/family"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/family' || location.pathname === '/family-summary' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-forest" />
            <span>Family Companion</span>
          </Link>

          <Link
            to="/ops"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/ops' || location.pathname === '/operations' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-forest" />
            <span>Operations Dashboard</span>
          </Link>

          <Link
            to="/coordinator/voice-checkin"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/coordinator/voice-checkin' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-forest" />
            <span>Voice & Check-in Simulator</span>
          </Link>

          <Link
            to="/coordinator/model-evaluation"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/coordinator/model-evaluation' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-alert-amber" />
            <span>Model Benchmark</span>
          </Link>

          <Link
            to="/coordinator/privacy-safety"
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              location.pathname === '/coordinator/privacy-safety' 
                ? 'bg-forest text-cream font-bold shadow-xs' 
                : 'text-ink-muted hover:text-forest hover:bg-mint'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-ink-muted" />
            <span>Privacy & Safety</span>
          </Link>
        </nav>

        {/* Mobile Navigation Drawer / Panel */}
        {mobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t border-slate-800 space-y-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            
            {/* Mobile Role Switcher */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active View / Role</div>
              <div className="grid grid-cols-2 gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
                <button
                  onClick={() => handleRoleSelect('coordinator')}
                  className={`min-h-[44px] py-2 text-center text-xs font-semibold rounded-lg ${
                    role === 'coordinator' && location.pathname.startsWith('/coordinator') ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Coordinator Triage
                </button>
                <button
                  onClick={() => handleRoleSelect('senior')}
                  className={`min-h-[44px] py-2 text-center text-xs font-semibold rounded-lg ${
                    location.pathname === '/senior-home' ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Senior Mode
                </button>
                <button
                  onClick={() => handleRoleSelect('family')}
                  className={`min-h-[44px] py-2 text-center text-xs font-semibold rounded-lg ${
                    location.pathname === '/family' ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Family Portal
                </button>
                <button
                  onClick={() => handleRoleSelect('manager')}
                  className={`min-h-[44px] py-2 text-center text-xs font-semibold rounded-lg ${
                    location.pathname.startsWith('/ops') ? 'bg-teal-600 text-white font-bold shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Operations
                </button>
              </div>
            </div>

            {/* Mobile Senior Focus Picker */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Focus Senior</div>
              <select
                value={currentSeniorId}
                onChange={(e) => { setCurrentSeniorId(e.target.value); closeMobile(); }}
                className="w-full min-h-[44px] text-xs font-medium text-slate-100 bg-slate-900 border border-slate-700 rounded-lg p-2"
              >
                {prioritySeniors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.age}y, {s.city}) : Score: {((s.currentRiskScore || 0) / 10).toFixed(1)}/10
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Links List */}
            <nav aria-label="Mobile Navigation" className="space-y-1 text-xs font-medium">
              <Link
                to="/coordinator"
                onClick={closeMobile}
                className="flex items-center justify-between min-h-[48px] p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-white"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Today's Priorities
                </span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">12 Active</span>
              </Link>

              <Link
                to="/senior-home"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                Senior View (/senior-home)
              </Link>

              <Link
                to="/family"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                Family Portal (/family)
              </Link>

              <Link
                to={`/coordinator/senior/${currentSeniorId}`}
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Activity className="w-4 h-4 text-teal-400" />
                Senior Detail & Baseline
              </Link>

              <Link
                to="/coordinator/voice-checkin"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                Voice & IVR Simulator
              </Link>

              <Link
                to="/ops"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Operations Dashboard
              </Link>

              <Link
                to="/coordinator/model-evaluation"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Model Benchmark
              </Link>

              <Link
                to="/coordinator/privacy-safety"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                Privacy & Safety
              </Link>

              <Link
                to="/coordinator/custom-domain"
                onClick={closeMobile}
                className="flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                Custom Domain (care.samarth.in)
              </Link>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 min-h-[48px] p-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-rose-300 text-left"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign out ({currentUser.name})
                </button>
              )}
            </nav>

          </div>
        )}

      </div>
    </header>
  );
};
