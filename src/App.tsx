import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TodaysPriorities } from './pages/TodaysPriorities';
import { SeniorDetail } from './pages/SeniorDetail';
import { VoiceCheckinDemo } from './pages/VoiceCheckinDemo';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { FamilySummary } from './pages/FamilySummary';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { PrivacySafety } from './pages/PrivacySafety';

export function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<TodaysPriorities />} />
              <Route path="/senior/:id" element={<SeniorDetail />} />
              <Route path="/voice-checkin" element={<VoiceCheckinDemo />} />
              <Route path="/operations" element={<OperationsDashboard />} />
              <Route path="/family-summary" element={<FamilySummary />} />
              <Route path="/model-evaluation" element={<ModelEvaluation />} />
              <Route path="/privacy-safety" element={<PrivacySafety />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
