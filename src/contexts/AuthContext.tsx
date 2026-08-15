import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { subscribeToUserProfile } from '../services/userRepo';
import { signOutUser } from '../services/authRepo';
import { loadState, saveState, namespacedKey } from '../services/persistence';
import type { UserProfile } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileError: string | null;
  activeClassId: string | null;
  setActiveClassId: (classId: string | null) => void;
  isSchoolAdmin: (schoolId: string) => boolean;
  isGmOfClass: (classId: string) => boolean;
  isStudentOfClass: (classId: string) => boolean;
  isMemberOfClass: (classId: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [profileResolved, setProfileResolved] = useState(false);
  const [activeClassId, setActiveClassIdState] = useState<string | null>(() =>
    loadState(namespacedKey('activeClassId'), null as string | null)
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthResolved(true);
      if (!user) {
        setProfile(null);
        setProfileResolved(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    setProfileResolved(false);
    setProfileError(null);
    const unsubscribe = subscribeToUserProfile(
      firebaseUser.uid,
      (p) => {
        setProfile(p);
        setProfileResolved(true);
      },
      (error) => {
        // Without this, a permission-denied/offline error left the listener
        // silently never firing — profileResolved (and thus `loading`) got
        // stuck true forever with no way for the UI to show anything.
        console.error('Falha ao carregar perfil do usuário:', error);
        setProfileError('Não foi possível carregar seu perfil. Verifique sua conexão e tente novamente.');
        setProfileResolved(true);
      }
    );
    return unsubscribe;
  }, [firebaseUser]);

  const setActiveClassId = (classId: string | null) => {
    setActiveClassIdState(classId);
    saveState(namespacedKey('activeClassId'), classId);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      loading: !authResolved || !profileResolved,
      profileError,
      activeClassId,
      setActiveClassId,
      isSchoolAdmin: (schoolId) => profile?.schoolAdminOf.includes(schoolId) ?? false,
      isGmOfClass: (classId) => profile?.classIdsAsGameMaster.includes(classId) ?? false,
      isStudentOfClass: (classId) => profile?.classIdsAsStudent.includes(classId) ?? false,
      isMemberOfClass: (classId) =>
        (profile?.classIdsAsGameMaster.includes(classId) ||
          profile?.classIdsAsStudent.includes(classId)) ??
        false,
      signOut: signOutUser
    }),
    [firebaseUser, profile, profileError, authResolved, profileResolved, activeClassId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
