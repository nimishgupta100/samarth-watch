import React, { createContext, useContext, useState, useEffect } from 'react';
import { Senior, UserRole } from '../types';
import { getCohort, updateSeniorAlert, updateFamilyConsent, saveCohort, generateSyntheticCohort } from '../data/mockDataGenerator';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentSeniorId: string;
  setCurrentSeniorId: (id: string) => void;
  seniors: Senior[];
  selectedSenior: Senior;
  handleAlertAction: (id: string, action: 'done' | 'snoozed' | 'pending') => void;
  handleFeedback: (id: string, feedback: 'useful' | 'not_useful') => void;
  toggleConsent: (id: string, consent: boolean) => void;
  feedbackStats: { useful: number; notUseful: number };
  precisionRate: number;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('coordinator');
  const [seniors, setSeniors] = useState<Senior[]>(() => getCohort());
  const [currentSeniorId, setCurrentSeniorId] = useState<string>('senior-001');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [feedbackStats, setFeedbackStats] = useState<{ useful: number; notUseful: number }>({
    useful: 38,
    notUseful: 4,
  });

  const selectedSenior = seniors.find(s => s.id === currentSeniorId) || seniors[0];

  const handleAlertAction = (id: string, action: 'done' | 'snoozed' | 'pending') => {
    updateSeniorAlert(id, { alertStatus: action });
    setSeniors([...getCohort()]);
  };

  const handleFeedback = (id: string, feedback: 'useful' | 'not_useful') => {
    updateSeniorAlert(id, { feedback });
    setSeniors([...getCohort()]);
    setFeedbackStats(prev => ({
      useful: feedback === 'useful' ? prev.useful + 1 : prev.useful,
      notUseful: feedback === 'not_useful' ? prev.notUseful + 1 : prev.notUseful,
    }));
  };

  const toggleConsent = (id: string, consent: boolean) => {
    updateFamilyConsent(id, consent);
    setSeniors([...getCohort()]);
  };

  const resetDemoData = () => {
    localStorage.removeItem('samarth_watch_cohort_v1');
    const fresh = generateSyntheticCohort();
    saveCohort(fresh);
    setSeniors(fresh);
    setFeedbackStats({ useful: 38, notUseful: 4 });
  };

  const precisionRate = +(
    (feedbackStats.useful / (feedbackStats.useful + feedbackStats.notUseful || 1)) * 100
  ).toFixed(1);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentSeniorId,
        setCurrentSeniorId,
        seniors,
        selectedSenior,
        handleAlertAction,
        handleFeedback,
        toggleConsent,
        feedbackStats,
        precisionRate,
        language,
        setLanguage,
        isHighContrast,
        setIsHighContrast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
