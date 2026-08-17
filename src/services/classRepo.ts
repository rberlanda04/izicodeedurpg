import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  arrayUnion,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { generateRoomPasscode } from './passcode';
import { seedClassQuests } from './questRepo';
import { STARTER_QUEST_TEMPLATES } from '../data/mockData';
import type { School, ClassRoom, RoomPasscodeLookup } from '../types';

export async function createSchool(name: string, city: string, adminUid: string): Promise<School> {
  const ref = doc(db, 'schools', crypto.randomUUID());
  const school: School = { id: ref.id, name, city, adminIds: [adminUid] };
  await runTransaction(db, async (tx) => {
    tx.set(ref, school);
    tx.update(doc(db, 'users', adminUid), {
      schoolAdminOf: arrayUnion(school.id),
      schoolIds: arrayUnion(school.id)
    });
  });
  return school;
}

export async function createClass(
  schoolId: string,
  name: string,
  gradeRange: string,
  gameMasterUid: string,
  passcode: string = generateRoomPasscode()
): Promise<ClassRoom> {
  const ref = doc(db, 'classes', crypto.randomUUID());
  const classRoom: ClassRoom = {
    id: ref.id,
    schoolId,
    name,
    gradeRange,
    gameMasterIds: [gameMasterUid],
    studentIds: [],
    roomPasscode: passcode,
    createdAt: new Date().toISOString(),
    archivedAt: null
  };
  const passcodeLookup: RoomPasscodeLookup = { classId: ref.id, schoolId };

  await runTransaction(db, async (tx) => {
    tx.set(ref, classRoom);
    tx.set(doc(db, 'roomPasscodes', passcode), passcodeLookup);
    tx.update(doc(db, 'users', gameMasterUid), {
      schoolIds: arrayUnion(schoolId),
      classIdsAsGameMaster: arrayUnion(ref.id)
    });
  });

  // Best-effort follow-up, not part of the class-creation transaction: if
  // it partially fails, the class still exists and works, just with fewer
  // starter quests on the mural — the GM can always add more manually.
  seedClassQuests(ref.id, schoolId, STARTER_QUEST_TEMPLATES).catch((err) =>
    console.error('Falha ao semear missões iniciais da turma:', err)
  );

  return classRoom;
}

export async function getClass(classId: string): Promise<ClassRoom | null> {
  const snap = await getDoc(doc(db, 'classes', classId));
  return snap.exists() ? (snap.data() as ClassRoom) : null;
}

export function subscribeToClass(
  classId: string,
  onChange: (c: ClassRoom | null) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'classes', classId),
    (snap) => {
      onChange(snap.exists() ? (snap.data() as ClassRoom) : null);
    },
    onError
  );
}

/**
 * Resolve a 6-char room passcode to a class and join the signed-in user as
 * a student — the join-by-passcode flow that preserves the original
 * "5-second classroom entry" UX on top of real Firebase Auth. Writes to
 * both the class doc (studentIds) and the user doc (classIdsAsStudent/
 * schoolIds/memberships) in one transaction so the two stay consistent.
 */
export async function joinClassByPasscode(uid: string, code: string): Promise<ClassRoom> {
  const passcodeRef = doc(db, 'roomPasscodes', code.toUpperCase());
  const passcodeSnap = await getDoc(passcodeRef);
  if (!passcodeSnap.exists()) {
    throw new Error('Código de sala inválido. Confira com o seu Game Master.');
  }
  const { classId, schoolId } = passcodeSnap.data() as RoomPasscodeLookup;
  const classRef = doc(db, 'classes', classId);

  const classRoom = await runTransaction(db, async (tx) => {
    const classSnap = await tx.get(classRef);
    if (!classSnap.exists()) throw new Error('Turma não encontrada.');
    const current = classSnap.data() as ClassRoom;

    tx.update(classRef, { studentIds: arrayUnion(uid) });
    tx.update(doc(db, 'users', uid), {
      schoolIds: arrayUnion(schoolId),
      classIdsAsStudent: arrayUnion(classId),
      [`memberships.${classId}`]: { joinedAt: new Date().toISOString() }
    });

    return { ...current, studentIds: [...current.studentIds, uid] };
  });

  return classRoom;
}

export async function listClassesByIds(classIds: string[]): Promise<ClassRoom[]> {
  const results = await Promise.all(classIds.map((id) => getClass(id)));
  return results.filter((c): c is ClassRoom => c !== null);
}

export async function listClassesBySchool(schoolId: string): Promise<ClassRoom[]> {
  const snap = await getDocs(query(collection(db, 'classes'), where('schoolId', '==', schoolId)));
  return snap.docs.map((d) => d.data() as ClassRoom);
}

export async function getSchool(schoolId: string): Promise<School | null> {
  const snap = await getDoc(doc(db, 'schools', schoolId));
  return snap.exists() ? (snap.data() as School) : null;
}
