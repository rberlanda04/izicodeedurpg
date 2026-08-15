import { updateUserProfile, updateUserProfileWithTransaction } from '../services/userRepo';
import type { UserProfile } from '../types';

export type ApplyUserPatch = (patch: Partial<UserProfile> | ((current: UserProfile) => Partial<UserProfile>)) => void;

/**
 * Shared by ClassLayout.tsx and GmDashboardPage.tsx (previously duplicated
 * inline in both). A plain object patch is a direct field replacement (e.g.
 * swapping the avatar) and doesn't need a transaction. A function patch is
 * for anything computed from the current value (XP/coin grants, level-up,
 * inventory/array updates) — routed through updateUserProfileWithTransaction
 * so it reads the authoritative server value instead of a stale local one.
 */
export function useApplyUserPatch(profile: UserProfile | null): ApplyUserPatch {
  return (patch) => {
    if (!profile) return;
    if (typeof patch === 'function') {
      void updateUserProfileWithTransaction(profile.uid, patch);
    } else {
      void updateUserProfile(profile.uid, patch);
    }
  };
}
