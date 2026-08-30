import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  runTransaction,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '../types';

const AVATAR_PRESETS = [
  { head: '🤖', body: '🛡️', accessory: '⚡', color: '#0E7C7B' },
  { head: '🦊', body: '🎒', accessory: '🔧', color: '#F25C54' },
  { head: '🐈', body: '🧪', accessory: '✨', color: '#6A4C93' },
  { head: '👽', body: '🚀', accessory: '💡', color: '#F4A259' }
];

export function newUserProfile(uid: string, adventureName: string, realName = ''): UserProfile {
  const avatarConfig = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
  return {
    uid,
    adventureName,
    realName,
    role: 'ADVENTURER',
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    izicoins: 50,
    avatarConfig,
    unlockedSkills: [],
    badges: [],
    inventory: [],
    unlockedCuriosities: [],
    completedWizards: [],
    completedQuestSdgGoals: [],
    heroContractSigned: false,
    schoolAdminOf: [],
    schoolIds: [],
    classIdsAsGameMaster: [],
    classIdsAsStudent: [],
    memberships: {}
  };
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, 'users', profile.uid), profile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export function subscribeToUserProfile(
  uid: string,
  onChange: (profile: UserProfile | null) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      onChange(snap.exists() ? (snap.data() as UserProfile) : null);
    },
    onError
  );
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), patch);
}

/**
 * Patches derived from the current profile value (XP/coin/inventory grants,
 * level-up thresholds) must read that value inside the transaction, not from
 * a possibly-stale in-memory `profile` snapshot — two rapid actions (double
 * click, two tabs of the same account) can otherwise both read the same
 * pre-update value and one silently overwrites the other's grant.
 */
export async function updateUserProfileWithTransaction(
  uid: string,
  updater: (current: UserProfile) => Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('Perfil não encontrado.');
    tx.update(ref, updater(snap.data() as UserProfile));
  });
}
