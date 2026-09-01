import {
  doc,
  writeBatch,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { SkillValidation, SkillValidationToken, SkillCompletion } from '../types';

function generateValidationToken(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function validationId(classId: string, studentUid: string, skillId: string): string {
  return `${classId}_${studentUid}_${skillId}`;
}

/**
 * The skill-unlock sibling of questRepo.ts's acceptQuest — a student
 * "starts" the teacher-validation path for a skill by creating two docs at
 * once: skillValidations/{id} (public — the student reads this back to
 * know their challenge is pending, e.g. after a page refresh) and
 * skillValidationTokens/{id} (the actual code, readable only by the Game
 * Master/Admin — see firestore.rules). Deterministic id so a student can't
 * pile up duplicate pending requests for the same skill.
 */
export async function requestSkillValidation(
  classId: string,
  schoolId: string,
  skillId: string,
  skillTitle: string,
  studentUid: string,
  studentName: string,
  xpReward: number,
  coinReward: number
): Promise<void> {
  const id = validationId(classId, studentUid, skillId);
  const token = generateValidationToken();
  const validation: SkillValidation = {
    id,
    classId,
    schoolId,
    studentUid,
    studentName,
    skillId,
    skillTitle,
    xpReward,
    coinReward,
    createdAt: new Date().toISOString()
  };
  const batch = writeBatch(db);
  batch.set(doc(db, 'skillValidations', id), validation);
  batch.set(doc(db, 'skillValidationTokens', id), { id, classId, studentUid, token });
  await batch.commit();
}

/** "Cancelar desafio" — releases both docs without granting anything. */
export async function cancelSkillValidation(classId: string, studentUid: string, skillId: string): Promise<void> {
  const id = validationId(classId, studentUid, skillId);
  await Promise.all([deleteDoc(doc(db, 'skillValidations', id)), deleteDoc(doc(db, 'skillValidationTokens', id))]);
}

/**
 * GM/Admin dashboard: every pending request in the class. A plain
 * `where('classId', ...)` query is only allowed for someone the rule grants
 * blanket class access to — a student querying this broadly would be
 * rejected outright, since Firestore can't prove every possible match is
 * their own doc from the query shape alone. See subscribeToMySkillValidation
 * below for the student-scoped equivalent.
 */
export function subscribeToClassSkillValidations(
  classId: string,
  onChange: (validations: SkillValidation[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'skillValidations'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as SkillValidation)),
    onError
  );
}

/** GM-only in practice — reads the actual codes, same shape as questRepo.ts's subscribeToClassValidations. */
export function subscribeToClassSkillValidationTokens(
  classId: string,
  onChange: (tokens: SkillValidationToken[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'skillValidationTokens'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as SkillValidationToken)),
    onError
  );
}

/**
 * A student's own pending request, if any — scoped by studentUid in the
 * query itself so Firestore can verify the "own doc" rule clause without
 * needing blanket class read access. Used to make the BattleScreen lock
 * survive a page refresh.
 */
export function subscribeToMySkillValidation(
  classId: string,
  studentUid: string,
  onChange: (validations: SkillValidation[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'skillValidations'), where('classId', '==', classId), where('studentUid', '==', studentUid)),
    (snap) => onChange(snap.docs.map((d) => d.data() as SkillValidation)),
    onError
  );
}

/** Permanent audit log for the Game Master's dashboard — written server-side only. */
export function subscribeToClassSkillCompletions(
  classId: string,
  onChange: (completions: SkillCompletion[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'skillCompletions'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as SkillCompletion)),
    onError
  );
}
