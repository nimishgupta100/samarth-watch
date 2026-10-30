import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, roleHomePath } from '../context/AuthContext';
import { UserRole } from '../data/schema';

interface RouteGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

/**
 * Strict role-based route guard.
 * - Unauthenticated: Redirects to /login
 * - Mismatched role: Redirects to user's assigned role homepage with ?redirect=blocked
 *   (e.g., senior cannot access /family, family cannot access /senior-home)
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ allowedRole, children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen" role="status" aria-label="Loading secure session" />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== allowedRole) {
    const ownHome = roleHomePath(currentUser.role);
    return <Navigate to={`${ownHome}?redirect=blocked`} replace />;
  }

  return <>{children}</>;
};
