import React, { Suspense, lazy, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RouteGuard } from './components/RouteGuard';

// Layouts
import { CoordinatorLayout } from './layouts/CoordinatorLayout';
import { OpsLayout } from './layouts/OpsLayout';
import { SeniorLayout } from './layouts/SeniorLayout';
import { FamilyLayout } from './layouts/FamilyLayout';

// Critical core pages loaded upfront for budget phone performance
import { LoginPage } from './pages/LoginPage';
import { SeniorHome } from './pages/SeniorHome';
import { LandingPage } from './pages/LandingPage';

// Lazy-loaded heavy and chart-intensive pages for fast initial bundle
const CreditsPage = lazy(() => import('./pages/CreditsPage').then(m => ({ default: m.CreditsPage })));
const TodaysPriorities = lazy(() => import('./pages/TodaysPriorities').then(m => ({ default: m.TodaysPriorities })));
const SeniorDetail = lazy(() => import('./pages/SeniorDetail').then(m => ({ default: m.SeniorDetail })));
const CoordinatorHomePage = lazy(() => import('./pages/coordinator/CoordinatorHomePage').then(m => ({ default: m.CoordinatorHomePage })));
const CoordinatorSeniorsPage = lazy(() => import('./pages/coordinator/CoordinatorSeniorsPage').then(m => ({ default: m.CoordinatorSeniorsPage })));
const CoordinatorSeniorProfilePage = lazy(() => import('./pages/coordinator/CoordinatorSeniorProfilePage').then(m => ({ default: m.CoordinatorSeniorProfilePage })));
const CoordinatorAppointmentsPage = lazy(() => import('./pages/coordinator/CoordinatorAppointmentsPage').then(m => ({ default: m.CoordinatorAppointmentsPage })));
const CoordinatorInboxPage = lazy(() => import('./pages/coordinator/CoordinatorInboxPage').then(m => ({ default: m.CoordinatorInboxPage })));
const CoordinatorSettingsPage = lazy(() => import('./pages/coordinator/CoordinatorSettingsPage').then(m => ({ default: m.CoordinatorSettingsPage })));
const FamilyPortal = lazy(() => import('./pages/FamilyPortal').then(m => ({ default: m.FamilyPortal })));
const FamilyReport = lazy(() => import('./pages/FamilyReport').then(m => ({ default: m.FamilyReport })));
const VoiceCheckinDemo = lazy(() => import('./pages/VoiceCheckinDemo').then(m => ({ default: m.VoiceCheckinDemo })));
const OperationsDashboard = lazy(() => import('./pages/OperationsDashboard').then(m => ({ default: m.OperationsDashboard })));
const ModelEvaluation = lazy(() => import('./pages/ModelEvaluation').then(m => ({ default: m.ModelEvaluation })));
const PrivacySafety = lazy(() => import('./pages/PrivacySafety').then(m => ({ default: m.PrivacySafety })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import('./pages/TermsConditions').then(m => ({ default: m.TermsConditions })));
const CustomDomain = lazy(() => import('./pages/CustomDomain').then(m => ({ default: m.CustomDomain })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-6 text-teal-400 text-sm font-semibold">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
      <span>Loading...</span>
    </div>
  </div>
);

/** Catches React render errors and shows a recovery screen instead of a blank page. */
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error?.message || 'Unknown error' };
  }
  handleReset = () => {
    // Clear session and reload cleanly
    try { sessionStorage.clear(); } catch { /* ignore */ }
    window.location.href = '/login';
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 bg-slate-900 text-white">
          <div className="text-4xl">⚠️</div>
          <h1 className="text-xl font-bold text-center">Something went wrong</h1>
          <p className="text-sm text-slate-400 text-center max-w-sm">{this.state.errorMsg}</p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm"
          >
            Clear session and go to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * One-time boot-time data health check.
 * Clears invalid/stale session data so old browser state never blocks login.
 * Called once synchronously before React mounts.
 */
function runBootHealthCheck(): void {
  try {
    // 1. If auth session has a role that no longer exists or is malformed, purge it.
    const rawSession = localStorage.getItem('samarth_auth_session') || sessionStorage.getItem('samarth_auth_session');
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      const validRoles = ['coordinator', 'senior', 'family', 'manager'];
      if (!parsed?.role || !validRoles.includes(parsed.role)) {
        sessionStorage.removeItem('samarth_auth_session');
        localStorage.removeItem('samarth_auth_session');
        localStorage.removeItem('samarth_user_role');
      } else {
        // Keep both storages synchronized
        sessionStorage.setItem('samarth_auth_session', rawSession);
        localStorage.setItem('samarth_auth_session', rawSession);
        localStorage.setItem('samarth_user_role', parsed.role);
      }
    }

    // 2. Keep role state synchronized
    const lsRole = localStorage.getItem('samarth_user_role');
    const sessionRole = rawSession ? (() => { try { return JSON.parse(rawSession)?.role; } catch { return null; } })() : null;
    if (lsRole && sessionRole && lsRole !== sessionRole) {
      localStorage.setItem('samarth_user_role', sessionRole);
    }
  } catch {
    // If anything fails, clean slate is safer than a crash.
    try { sessionStorage.removeItem('samarth_auth_session'); } catch { /* ignore */ }
    try { localStorage.removeItem('samarth_auth_session'); } catch { /* ignore */ }
    try { localStorage.removeItem('samarth_user_role'); } catch { /* ignore */ }
  }
}

// Run once at module load time before React renders.
runBootHealthCheck();

/**
 * Root redirect: sends authenticated users to their home, unauthenticated to /login.
 * Session is stored in localStorage / sessionStorage (see AuthContext SESSION_KEY).
 */
const RootRedirect: React.FC = () => {
  const session = localStorage.getItem('samarth_auth_session') || sessionStorage.getItem('samarth_auth_session');
  if (!session) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(session);
    const map: Record<string, string> = {
      coordinator: '/coordinator',
      manager: '/ops',
      senior: '/senior-home',
      family: '/family',
    };
    return <Navigate to={map[user.role] || '/login'} replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/credits" element={<CreditsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />

                  {/* ===== COORDINATOR routes ===== */}
                  <Route
                    path="/coordinator"
                    element={
                      <RouteGuard allowedRole="coordinator">
                        <CoordinatorLayout />
                      </RouteGuard>
                    }
                  >
                    <Route index element={<CoordinatorHomePage />} />
                    <Route path="seniors" element={<CoordinatorSeniorsPage />} />
                    <Route path="senior/:id" element={<CoordinatorSeniorProfilePage />} />
                    <Route path="appointments" element={<CoordinatorAppointmentsPage />} />
                    <Route path="inbox" element={<CoordinatorInboxPage />} />
                    <Route path="settings" element={<CoordinatorSettingsPage />} />
                    <Route path="priorities-legacy" element={<TodaysPriorities />} />
                    <Route path="voice-checkin" element={<VoiceCheckinDemo />} />
                    <Route path="model-evaluation" element={<ModelEvaluation />} />
                    <Route path="privacy-safety" element={<PrivacySafety />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsConditions />} />
                    <Route path="custom-domain" element={<CustomDomain />} />
                  </Route>

                  {/* ===== OPS MANAGER routes ===== */}
                  <Route
                    path="/ops"
                    element={
                      <RouteGuard allowedRole="manager">
                        <OpsLayout />
                      </RouteGuard>
                    }
                  >
                    <Route index element={<OperationsDashboard />} />
                    <Route path="model-evaluation" element={<ModelEvaluation />} />
                    <Route path="privacy-safety" element={<PrivacySafety />} />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsConditions />} />
                  </Route>

                  {/* ===== SENIOR routes ===== */}
                  <Route
                    path="/senior-home"
                    element={
                      <RouteGuard allowedRole="senior">
                        <SeniorLayout />
                      </RouteGuard>
                    }
                  >
                    <Route index element={<SeniorHome />} />
                  </Route>

                  {/* ===== FAMILY routes ===== */}
                  <Route
                    path="/family"
                    element={
                      <RouteGuard allowedRole="family">
                        <FamilyLayout />
                      </RouteGuard>
                    }
                  >
                    <Route index element={<FamilyPortal />} />
                    <Route path="report" element={<FamilyReport />} />
                  </Route>

                  {/* Legacy redirects */}
                  <Route path="/family-summary" element={<Navigate to="/family" replace />} />
                  <Route path="/operations" element={<Navigate to="/ops" replace />} />
                  <Route path="/senior/:id" element={<Navigate to="/login" replace />} />
                  <Route path="/voice-checkin" element={<Navigate to="/login" replace />} />
                  <Route path="/model-evaluation" element={<Navigate to="/login" replace />} />
                  <Route path="/privacy-safety" element={<Navigate to="/coordinator/privacy-safety" replace />} />
                  <Route path="/custom-domain" element={<Navigate to="/login" replace />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
