import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './firebaseAdmin.js';

export interface ResolveHardwareRequestResult {
  status: 'APPROVED' | 'DENIED';
}

/**
 * Approving/denying a Maker Lab hardware request is the only path allowed
 * to move a student's Izicoins/inventory for this feature — firestore.rules
 * blocks `hardwareRequests/{id}` updates entirely from the client (see the
 * comment there), and a plain Game Master isn't a school Admin, so they
 * have no rule-based write access to another user's profile either. Runs
 * with the Admin SDK for the same reason questValidationHandler.ts does.
 */
export async function resolveHardwareRequest(
  idToken: string,
  requestId: string,
  decision: 'APPROVED' | 'DENIED'
): Promise<ResolveHardwareRequestResult> {
  const app = getFirebaseAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  const gmUid = decoded.uid;

  const db = getFirestore(app);
  const requestRef = db.collection('hardwareRequests').doc(requestId);
  const gmRef = db.collection('users').doc(gmUid);

  return db.runTransaction(async (tx) => {
    const [requestSnap, gmSnap] = await Promise.all([tx.get(requestRef), tx.get(gmRef)]);

    if (!requestSnap.exists) {
      throw new Error('Pedido não encontrado.');
    }
    const request = requestSnap.data() as {
      classId: string;
      schoolId: string;
      studentUid: string;
      itemId: string;
      itemName: string;
      itemIcon: string;
      coinCost: number;
      status: 'PENDING' | 'APPROVED' | 'DENIED';
    };
    if (request.status !== 'PENDING') {
      throw new Error('Este pedido já foi resolvido.');
    }

    const gm = gmSnap.data() as { classIdsAsGameMaster?: string[]; schoolAdminOf?: string[] } | undefined;
    const isGm = gm?.classIdsAsGameMaster?.includes(request.classId) ?? false;
    const isAdmin = gm?.schoolAdminOf?.includes(request.schoolId) ?? false;
    if (!isGm && !isAdmin) {
      throw new Error('Você não tem permissão sobre esta turma.');
    }

    if (decision === 'DENIED') {
      tx.update(requestRef, { status: 'DENIED', resolvedAt: new Date().toISOString() });
      return { status: 'DENIED' as const };
    }

    const studentRef = db.collection('users').doc(request.studentUid);
    const studentSnap = await tx.get(studentRef);
    if (!studentSnap.exists) {
      throw new Error('Aluno não encontrado.');
    }
    const student = studentSnap.data() as {
      izicoins: number;
      inventory: Array<{ itemId: string; name: string; qty: number; icon: string }>;
    };
    if (student.izicoins < request.coinCost) {
      throw new Error('O aluno não tem Izicoins suficientes no momento.');
    }

    const alreadyOwned = student.inventory.find((i) => i.itemId === request.itemId);
    const nextInventory = alreadyOwned
      ? student.inventory.map((i) => (i.itemId === request.itemId ? { ...i, qty: i.qty + 1 } : i))
      : [...student.inventory, { itemId: request.itemId, name: request.itemName, qty: 1, icon: request.itemIcon }];

    tx.update(studentRef, { izicoins: student.izicoins - request.coinCost, inventory: nextInventory });
    tx.update(requestRef, { status: 'APPROVED', resolvedAt: new Date().toISOString() });

    return { status: 'APPROVED' as const };
  });
}
