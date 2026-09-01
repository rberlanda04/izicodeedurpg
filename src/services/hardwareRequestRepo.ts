import {
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { HardwareItem, HardwareRequest } from '../types';

/** Aluno pede um item do catálogo — cria um PENDING; a resolução mora inteiramente no server. */
export async function requestHardware(
  classId: string,
  schoolId: string,
  studentUid: string,
  studentName: string,
  item: HardwareItem
): Promise<void> {
  await addDoc(collection(db, 'hardwareRequests'), {
    classId,
    schoolId,
    studentUid,
    studentName,
    itemId: item.id,
    itemName: item.name,
    itemIcon: item.icon,
    coinCost: item.coinCost,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  });
}

/** Aluno desiste de um pedido ainda pendente. */
export async function cancelHardwareRequest(requestId: string): Promise<void> {
  await deleteDoc(doc(db, 'hardwareRequests', requestId));
}

/** GM/Admin dashboard: todo pedido da turma — mesmo motivo de subscribeToClassSkillValidations. */
export function subscribeToClassHardwareRequests(
  classId: string,
  onChange: (requests: HardwareRequest[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'hardwareRequests'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as HardwareRequest)),
    onError
  );
}

/** Os próprios pedidos do aluno — usado pelo Maker Lab pra mostrar "pendente" por item. */
export function subscribeToMyHardwareRequests(
  classId: string,
  studentUid: string,
  onChange: (requests: HardwareRequest[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(
      collection(db, 'hardwareRequests'),
      where('classId', '==', classId),
      where('studentUid', '==', studentUid)
    ),
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as HardwareRequest)),
    onError
  );
}
