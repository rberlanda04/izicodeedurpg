import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireSchoolAdmin?: string; // schoolId
  requireClassGameMaster?: string; // classId
}

/**
 * Renders `children` only if the signed-in user holds the required
 * permission — pure UI convenience, NOT a security boundary on its own.
 * The Firestore rules are what actually enforce access; this only decides
 * what to show/hide in the interface.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  fallback = null,
  requireSchoolAdmin,
  requireClassGameMaster
}) => {
  const { isSchoolAdmin, isGmOfClass } = useAuth();

  if (requireSchoolAdmin && !isSchoolAdmin(requireSchoolAdmin)) return <>{fallback}</>;
  if (requireClassGameMaster && !(isGmOfClass(requireClassGameMaster) || isSchoolAdmin(requireSchoolAdmin ?? ''))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
