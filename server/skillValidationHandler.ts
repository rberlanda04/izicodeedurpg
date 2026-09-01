import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './firebaseAdmin.js';

export interface ValidateSkillResult {
  xpReward: number;
  coinReward: number;
  newLevel: number;
}

/**
 * The skill-unlock sibling of questValidationHandler.ts — same reasoning:
 * the code lives in skillValidationTokens/{id} (separate from the public
 * skillValidations/{id} doc so the student can subscribe to the latter
 * for BattleScreen persistence without ever reading their own secret
 * code), readable only by the Game Master/Admin per firestore.rules, so
 * a match here is proof the teacher actually looked at the student's
 * physical build and read the code out loud. Also the ONLY path that's
 * allowed to write UserProfile.unlockedSkills — firestore.rules blocks
 * the student from self-writing that array directly (see the comment
 * there), closing the "just unlock every skill from devtools" hole.
 */
export async function validateSkill(
  idToken: string,
  classId: string,
  skillId: string,
  submittedToken: string
): Promise<ValidateSkillResult> {
  const app = getFirebaseAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  const uid = decoded.uid;

  const db = getFirestore(app);
  const validationId = `${classId}_${uid}_${skillId}`;
  const validationRef = db.collection('skillValidations').doc(validationId);
  const tokenRef = db.collection('skillValidationTokens').doc(validationId);
  const userRef = db.collection('users').doc(uid);
  const completionRef = db.collection('skillCompletions').doc(validationId);

  return db.runTransaction(async (tx) => {
    const [validationSnap, tokenSnap, userSnap] = await Promise.all([
      tx.get(validationRef),
      tx.get(tokenRef),
      tx.get(userRef)
    ]);

    if (!validationSnap.exists || !tokenSnap.exists) {
      throw new Error('Não há validação pendente para esta habilidade — peça pro Game Master conferir.');
    }
    const validation = validationSnap.data() as {
      classId: string;
      schoolId: string;
      studentUid: string;
      studentName: string;
      skillId: string;
      skillTitle: string;
      xpReward: number;
      coinReward: number;
    };
    const tokenData = tokenSnap.data() as { token: string };
    if (validation.studentUid !== uid) {
      throw new Error('Esta habilidade foi solicitada por outro aventureiro.');
    }
    if (tokenData.token.trim().toUpperCase() !== submittedToken.trim().toUpperCase()) {
      throw new Error('Código incorreto. Confira com o Game Master.');
    }
    if (!userSnap.exists) {
      throw new Error('Perfil de usuário não encontrado.');
    }

    const user = userSnap.data() as {
      xp: number;
      level: number;
      xpToNextLevel: number;
      izicoins: number;
      unlockedSkills: string[];
    };

    if (user.unlockedSkills.includes(skillId)) {
      tx.delete(validationRef);
      tx.delete(tokenRef);
      return { xpReward: 0, coinReward: 0, newLevel: user.level };
    }

    const newXp = user.xp + validation.xpReward;
    let newLevel = user.level;
    let nextLevelXp = user.xpToNextLevel;
    if (newXp >= nextLevelXp) {
      newLevel += 1;
      nextLevelXp += 1000;
    }

    tx.update(userRef, {
      unlockedSkills: [...user.unlockedSkills, skillId],
      xp: newXp,
      level: newLevel,
      xpToNextLevel: nextLevelXp,
      izicoins: user.izicoins + validation.coinReward
    });
    tx.set(completionRef, {
      id: completionRef.id,
      classId: validation.classId,
      schoolId: validation.schoolId,
      studentUid: uid,
      studentName: validation.studentName,
      skillId: validation.skillId,
      skillTitle: validation.skillTitle,
      method: 'teacher_token',
      xpReward: validation.xpReward,
      coinReward: validation.coinReward,
      completedAt: new Date().toISOString()
    });
    tx.delete(validationRef);
    tx.delete(tokenRef);

    return { xpReward: validation.xpReward, coinReward: validation.coinReward, newLevel };
  });
}
