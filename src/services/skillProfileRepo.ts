import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { SURVEY_VERSION } from '../data/skillProfileSurvey';
import type { UserProfile } from '../types';

/**
 * Sobrescreve o doc inteiro (não faz merge) — cada nova submissão substitui
 * a anterior por completo, então não sobra rastro de respostas antigas de
 * uma versão anterior do questionário.
 */
export async function saveSkillProfileAnswers(
  profile: UserProfile,
  selections: Record<string, string>
): Promise<void> {
  await setDoc(doc(db, 'skillProfileAnswers', profile.uid), {
    uid: profile.uid,
    classIdsAsStudent: profile.classIdsAsStudent,
    schoolIds: profile.schoolIds,
    selections,
    consentGivenAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    surveyVersion: SURVEY_VERSION
  });
}

export async function deleteSkillProfileAnswers(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'skillProfileAnswers', uid));
}
