import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from './firebaseAdmin.js';

export interface CompleteSkillWithLinkResult {
  xpReward: number;
  coinReward: number;
  newLevel: number;
}

/**
 * The self-serve alternative to skillValidationHandler.ts's teacher-code
 * path — for tools with a real shareable project (Scratch, App Inventor,
 * Tinkercad...) the student submits that link instead of waiting for the
 * teacher. Still server-side/Admin SDK only, same as the token path: the
 * client never gets to write UserProfile.unlockedSkills directly (blocked
 * by firestore.rules), so even this "no secret to check" path can't be
 * spoofed into granting a skill without at least going through here. Also
 * writes skillCompletions/{id} — the same durable record the teacher-token
 * path writes — so the link is visible in the Game Master's dashboard, not
 * just silently trusted.
 */
export async function completeSkillWithLink(
  idToken: string,
  classId: string,
  schoolId: string,
  studentName: string,
  skillId: string,
  skillTitle: string,
  projectLink: string,
  xpReward: number,
  coinReward: number
): Promise<CompleteSkillWithLinkResult> {
  const trimmedLink = projectLink.trim();
  if (!/^https?:\/\/.+/i.test(trimmedLink)) {
    throw new Error('Envie um link válido (começando com http:// ou https://).');
  }

  const app = getFirebaseAdminApp();
  const decoded = await getAuth(app).verifyIdToken(idToken);
  const uid = decoded.uid;

  const db = getFirestore(app);
  const userRef = db.collection('users').doc(uid);
  const completionRef = db.collection('skillCompletions').doc(`${classId}_${uid}_${skillId}`);

  return db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
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
      return { xpReward: 0, coinReward: 0, newLevel: user.level };
    }

    const newXp = user.xp + xpReward;
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
      izicoins: user.izicoins + coinReward
    });
    tx.set(completionRef, {
      id: completionRef.id,
      classId,
      schoolId,
      studentUid: uid,
      studentName,
      skillId,
      skillTitle,
      method: 'link',
      projectLink: trimmedLink,
      xpReward,
      coinReward,
      completedAt: new Date().toISOString()
    });

    return { xpReward, coinReward, newLevel };
  });
}
