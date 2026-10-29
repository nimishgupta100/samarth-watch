import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TodaysPriorities } from './pages/TodaysPriorities';
import { SeniorDetail } from './pages/SeniorDetail';
import { VoiceCheckinDemo } from './pages/VoiceCheckinDemo';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { FamilySummary } from './pages/FamilySummary';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { PrivacySafety } from './pages/PrivacySafety';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { CustomDomain } from './pages/CustomDomain';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<TodaysPriorities />} />
                <Route path="/senior/:id" element={<SeniorDetail />} />
                <Route path="/voice-checkin" element={<VoiceCheckinDemo />} />
                <Route path="/operations" element={<OperationsDashboard />} />
                <Route path="/family-summary" element={<FamilySummary />} />
                <Route path="/model-evaluation" element={<ModelEvaluation />} />
                <Route path="/privacy-safety" element={<PrivacySafety />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/custom-domain" element={<CustomDomain />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
