import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/coordinator/AppShell';

export const CoordinatorLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    // When searching from top bar, navigate to seniors list with search query if not already there
    if (q.trim() && !window.location.pathname.includes('/coordinator/seniors')) {
      navigate('/coordinator/seniors');
    }
  };

  return (
    <AppShell onSearch={handleSearch} searchQuery={searchQuery}>
      <Outlet context={{ searchQuery }} />
    </AppShell>
  );
};
