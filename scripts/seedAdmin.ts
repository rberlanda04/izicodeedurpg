/**
 * One-time bootstrap: creates the first School + Class + promotes a user
 * to school ADMIN. There is no public "become an admin" flow in the app by
 * design (a client-writable path to ADMIN would be a security hole — see
 * firestore.rules), so this has to run with elevated (Admin SDK) access.
 *
 * Setup:
 *   1. Create the target user's account first through the normal app
 *      /cadastro flow (or Firebase Console > Authentication), so they have
 *      a uid and a users/{uid} profile document already.
 *   2. Authenticate locally with a Google account that has Editor/Owner
 *      access on the Firebase project — either already logged in via
 *      `gcloud auth application-default login`, OR generate a service
 *      account key (Firebase Console > Project Settings > Service Accounts
 *      > Generate new private key) and save it as `service-account.json`
 *      in the repo root (gitignored — NEVER commit it, it grants full
 *      admin access to your Firebase project). This script tries
 *      Application Default Credentials first and falls back to that file.
 *   3. Run:
 *        npx tsx scripts/seedAdmin.ts --uid <firebaseUid> --school "Nome da Escola" --city "Cidade"
 */
import { existsSync, readFileSync } from 'node:fs';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'izicodeedurpg';

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

  if (existsSync('./service-account.json')) {
    const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf-8'));
    initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
  } else {
    initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
  }
  const db = getFirestore();

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    console.error(`users/${uid} não existe ainda — crie a conta pelo app (/cadastro) antes de rodar este script.`);
    process.exit(1);
  }

  const schoolRef = db.collection('schools').doc();
  const classRef = db.collection('classes').doc();
  const passcode = 'IZI-' + Math.floor(1000 + Math.random() * 9000);

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
      schoolAdminOf: [schoolRef.id],
      schoolIds: [schoolRef.id],
      classIdsAsGameMaster: [classRef.id]
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
