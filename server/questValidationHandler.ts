import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './firebaseAdmin.js';

export interface ValidateQuestResult {
  xpReward: number;
  coinReward: number;
  newLevel: number;
}

/**
 * Confirms a quest completion using the code the teacher revealed
 * in person. Runs with the Admin SDK on purpose: the correct code lives in
 * questValidations/{questId}, which firestore.rules only lets the Game
 * Master/Admin read — a plain client-side check would need the student's
 * browser to read that same document, defeating the whole point (the
 * secrecy is what makes this an actual in-person check, not a
 * self-report). Also grants XP/coins here, atomically with marking the
 * quest COMPLETED, so a match always means "reward paid" and a mismatch
 * always means "nothing changed."
 */
export async function validateQuest(idToken: string, questId: string, submittedToken: string): Promise<ValidateQuestResult> {
  const app = getFirebaseAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  const uid = decoded.uid;

  const db = getFirestore(app);
  const validationRef = db.collection('questValidations').doc(questId);
  const questRef = db.collection('quests').doc(questId);
  const userRef = db.collection('users').doc(uid);

  return db.runTransaction(async (tx) => {
    const [validationSnap, questSnap, userSnap] = await Promise.all([
      tx.get(validationRef),
      tx.get(questRef),
      tx.get(userRef)
    ]);

    if (!validationSnap.exists) {
      throw new Error('Não há validação pendente para esta missão — peça pro Game Master conferir.');
    }
    const validation = validationSnap.data() as {
      studentUid: string;
      token: string;
      xpReward: number;
      coinReward: number;
    };
    if (validation.studentUid !== uid) {
      throw new Error('Esta missão foi aceita por outro aventureiro.');
    }
    if (validation.token.trim().toUpperCase() !== submittedToken.trim().toUpperCase()) {
      throw new Error('Código incorreto. Confira com o Game Master.');
    }
    if (!questSnap.exists) {
      throw new Error('Missão não encontrada.');
    }
    if (!userSnap.exists) {
      throw new Error('Perfil de usuário não encontrado.');
    }

    const user = userSnap.data() as { xp: number; level: number; xpToNextLevel: number; izicoins: number };
    const newXp = user.xp + validation.xpReward;
    let newLevel = user.level;
    let nextLevelXp = user.xpToNextLevel;
    if (newXp >= nextLevelXp) {
      newLevel += 1;
      nextLevelXp += 1000;
    }

    tx.update(questRef, {
      status: 'COMPLETED',
      pendingValidationStudentUid: null,
      pendingValidationStudentName: null
    });
    tx.update(userRef, {
      xp: newXp,
      level: newLevel,
      xpToNextLevel: nextLevelXp,
      izicoins: user.izicoins + validation.coinReward
    });
    tx.delete(validationRef);

    return { xpReward: validation.xpReward, coinReward: validation.coinReward, newLevel };
  });
}
