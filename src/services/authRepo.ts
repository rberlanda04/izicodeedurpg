import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signOut,
  type User
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile, newUserProfile } from './userRepo';
import { joinClassByPasscode } from './classRepo';

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string, adventureName: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(newUserProfile(cred.user.uid, adventureName));
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const existing = await getUserProfile(cred.user.uid);
  if (!existing) {
    const fallbackName = cred.user.displayName?.split(' ')[0] ?? 'Aventureiro';
    await createUserProfile(newUserProfile(cred.user.uid, fallbackName));
  }
  return cred.user;
}

/**
 * Instant classroom entry: anonymous auth + room passcode, no account
 * creation friction. Preserves the "IZI-XXXX" 5-second join flow on top
 * of real Firebase Auth. The resulting anonymous account can be upgraded
 * later via upgradeAnonymousAccount() without losing progress.
 */
export async function joinRoomAsGuest(passcode: string, adventureName: string) {
  const cred = await signInAnonymously(auth);
  await createUserProfile(newUserProfile(cred.user.uid, adventureName));
  await joinClassByPasscode(cred.user.uid, passcode);
  return cred.user;
}

export async function upgradeAnonymousAccount(user: User, email: string, password: string) {
  const credential = EmailAuthProvider.credential(email, password);
  const result = await linkWithCredential(user, credential);
  return result.user;
}

export async function signOutUser() {
  await signOut(auth);
}
