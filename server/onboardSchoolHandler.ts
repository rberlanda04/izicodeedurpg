import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './firebaseAdmin.ts';
import { generateRoomPasscode } from '../src/services/passcode.ts';

export interface OnboardSchoolResult {
  schoolId: string;
  classId: string;
  roomPasscode: string;
}

/**
 * Self-service equivalent of scripts/seedAdmin.ts — same "school + pilot
 * class + roomPasscode + promote to admin/GM" transaction, but triggered by
 * the signed-in user themselves instead of run manually by an operator.
 * Before this, the ONLY way to become a school Admin was that script, run
 * with Admin SDK credentials — no teacher could onboard without engineering
 * help. This bypasses firestore.rules (Admin SDK), so all the safety has to
 * live here: the ID token must be valid and must NOT belong to an anonymous
 * account (guest room-code sessions can't spin up a school), and the write
 * only ever grants rights over the ONE new school just created — never
 * touches any existing school or another user's profile.
 */
export async function onboardSchool(idToken: string, schoolName: string, city: string): Promise<OnboardSchoolResult> {
  const app = getFirebaseAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  if (decoded.firebase.sign_in_provider === 'anonymous') {
    throw new Error('Contas de convidado (código de sala) não podem cadastrar uma escola.');
  }
  const uid = decoded.uid;

  const trimmedName = schoolName.trim();
  if (!trimmedName) throw new Error('Informe o nome da escola.');

  const db = getFirestore(app);
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new Error('Perfil de usuário não encontrado — complete o cadastro antes de continuar.');
  }

  const schoolRef = db.collection('schools').doc();
  const classRef = db.collection('classes').doc();
  const passcode = generateRoomPasscode();

  await db.runTransaction(async (tx) => {
    tx.set(schoolRef, { id: schoolRef.id, name: trimmedName, city: city.trim(), adminIds: [uid] });
    tx.set(classRef, {
      id: classRef.id,
      schoolId: schoolRef.id,
      name: 'Turma Piloto',
      gradeRange: '6º ao 9º ano',
      gameMasterIds: [uid],
      studentIds: [],
      roomPasscode: passcode,
      createdAt: new Date().toISOString(),
      archivedAt: null
    });
    tx.set(db.collection('roomPasscodes').doc(passcode), { classId: classRef.id, schoolId: schoolRef.id });
    tx.update(userRef, {
      schoolAdminOf: FieldValue.arrayUnion(schoolRef.id),
      schoolIds: FieldValue.arrayUnion(schoolRef.id),
      classIdsAsGameMaster: FieldValue.arrayUnion(classRef.id)
    });
  });

  return { schoolId: schoolRef.id, classId: classRef.id, roomPasscode: passcode };
}
