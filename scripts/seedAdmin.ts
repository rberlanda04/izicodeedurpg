/**
 * Manual/operator variant of the "create a school" flow — most teachers
 * should now use the self-service onboarding flow in the app itself
 * (OnboardingView.tsx -> server/onboardSchoolHandler.ts), which does the
 * same transaction but is triggered by the user's own login, not this
 * script. This remains useful for support/ops (e.g. onboarding someone
 * without walking them through the UI) since it needs elevated (Admin SDK)
 * access that a client-writable path can't have — see firestore.rules.
 *
 * Setup:
 *   1. Create the target user's account first through the normal app
 *      /cadastro flow (or Firebase Console > Authentication), so they have
 *      a uid and a users/{uid} profile document already.
 *   2. Authenticate locally: generate a service account key (Firebase
 *      Console > Project Settings > Service Accounts > Generate new private
 *      key) and save it as `service-account.json` in the repo root
 *      (gitignored — NEVER commit it, it grants full admin access to your
 *      Firebase project), or have `gcloud auth application-default login`
 *      already run. See server/firebaseAdmin.ts for the exact fallback
 *      order.
 *   3. Run:
 *        npx tsx scripts/seedAdmin.ts --uid <firebaseUid> --school "Nome da Escola" --city "Cidade"
 */
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '../server/firebaseAdmin.ts';
import { generateRoomPasscode } from '../src/services/passcode.ts';

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };
  const uid = get('--uid');
  const school = get('--school') ?? 'Minha Escola';
  const city = get('--city') ?? '';
  if (!uid) {
    console.error('Uso: npx tsx scripts/seedAdmin.ts --uid <firebaseUid> [--school "Nome"] [--city "Cidade"]');
    process.exit(1);
  }
  return { uid, school, city };
}

async function main() {
  const { uid, school, city } = parseArgs();

  const db = getFirestore(getFirebaseAdminApp());

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    console.error(`users/${uid} não existe ainda — crie a conta pelo app (/cadastro) antes de rodar este script.`);
    process.exit(1);
  }

  const schoolRef = db.collection('schools').doc();
  const classRef = db.collection('classes').doc();
  const passcode = generateRoomPasscode();

  await db.runTransaction(async (tx) => {
    tx.set(schoolRef, { id: schoolRef.id, name: school, city, adminIds: [uid] });
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

  console.log(`Pronto! Escola "${school}" (${schoolRef.id}) criada.`);
  console.log(`Turma piloto criada com código de sala: ${passcode}`);
  console.log(`Usuário ${uid} agora é ADMIN da escola e Game Master da turma piloto.`);
  console.log(`Painel Admin: /admin/${schoolRef.id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
