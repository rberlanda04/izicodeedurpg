import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  writeBatch,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { Quest, QuestValidation, SDGGoal } from '../types';

function generateValidationToken(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Follows classRepo.ts/userRepo.ts conventions: subscribeToX(id, onChange,
// onError) with the 3-arg onSnapshot form. quests/{questId} already has
// full firestore.rules coverage (classId/schoolId-scoped, GM/Admin write
// anything, students only propose+complete their own class's quests) —
// this was written during the original SaaS redesign but never actually
// used by the app until now (quests lived in localStorage instead).

export function subscribeToClassQuests(
  classId: string,
  onChange: (quests: Quest[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'quests'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as Quest)),
    onError
  );
}

/** GM/Admin-authored quest, published directly as ACTIVE (or another status if given). */
export async function createQuest(
  classId: string,
  schoolId: string,
  quest: Omit<Quest, 'id'>
): Promise<Quest> {
  const ref = doc(collection(db, 'quests'));
  const full: Quest = { ...quest, id: ref.id };
  await setDoc(ref, { ...full, classId, schoolId });
  return full;
}

/** Student-authored proposal — always starts PROPOSED, needs GM approval. */
export async function proposeQuest(
  classId: string,
  schoolId: string,
  title: string,
  description: string,
  sdgGoals: SDGGoal[],
  studentUid: string,
  studentName: string
): Promise<Quest> {
  const ref = doc(collection(db, 'quests'));
  const quest: Quest & { classId: string; schoolId: string } = {
    id: ref.id,
    classId,
    schoolId,
    title,
    description,
    tier: 'INTERMEDIATE',
    requiredSkills: [],
    sdgGoals,
    xpReward: 300,
    coinReward: 80,
    hardwareRequired: [],
    proposedByStudentId: studentUid,
    proposedByStudentName: studentName,
    status: 'PROPOSED',
    validationSteps: ['Revisão pelo Game Master na sala.']
  };
  await setDoc(ref, quest);
  return quest;
}

export async function approveQuest(questId: string): Promise<void> {
  await updateDoc(doc(db, 'quests', questId), { status: 'ACTIVE' });
}

/** Only for the Terminal Hacker secret quest — see the firestore.rules carve-out. */
export async function completeSecretQuest(questId: string): Promise<void> {
  await updateDoc(doc(db, 'quests', questId), { status: 'COMPLETED' });
}

/**
 * "Aceitar o desafio" — a student claims an ACTIVE quest to work on. Moves
 * it to PENDING_VALIDATION and generates a 4-digit code that only the GM
 * can read back (questValidations/{questId} — see firestore.rules). The
 * student gets the code from the teacher in person once the work is
 * actually done, not from Firestore.
 */
export async function acceptQuest(
  classId: string,
  schoolId: string,
  questId: string,
  studentUid: string,
  studentName: string,
  xpReward: number,
  coinReward: number
): Promise<string> {
  const token = generateValidationToken();
  const validation: QuestValidation = {
    questId,
    classId,
    schoolId,
    studentUid,
    studentName,
    token,
    xpReward,
    coinReward,
    createdAt: new Date().toISOString()
  };
  await setDoc(doc(db, 'questValidations', questId), validation);
  await updateDoc(doc(db, 'quests', questId), {
    status: 'PENDING_VALIDATION',
    pendingValidationStudentUid: studentUid,
    pendingValidationStudentName: studentName
  });
  return token;
}

/** GM-only in practice — questValidations read is rules-restricted to GM/Admin. */
export function subscribeToClassValidations(
  classId: string,
  onChange: (validations: QuestValidation[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'questValidations'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as QuestValidation)),
    onError
  );
}

/**
 * Seeds a freshly-created class with a starter mural of real quests —
 * called once, right after createClass()/onboardSchool() succeeds. A
 * best-effort follow-up (not part of the class-creation transaction): if it
 * partially fails, the class still exists and works, just with fewer
 * starter quests, which is an acceptable degradation.
 */
export async function seedClassQuests(
  classId: string,
  schoolId: string,
  templates: Array<Omit<Quest, 'id'>>
): Promise<void> {
  const batch = writeBatch(db);
  for (const template of templates) {
    const ref = doc(collection(db, 'quests'));
    batch.set(ref, { ...template, id: ref.id, classId, schoolId });
  }
  await batch.commit();
}
