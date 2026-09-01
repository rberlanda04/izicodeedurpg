import type { User } from 'firebase/auth';

export interface ValidateSkillResult {
  xpReward: number;
  coinReward: number;
  newLevel: number;
}

/**
 * The skill-unlock siblings of questValidationService.ts — same
 * text-then-parse error handling, same reasoning for why this has to be a
 * server call (the secret token in skillValidations/{id} isn't readable by
 * the student's own Firestore rules, and UserProfile.unlockedSkills isn't
 * self-writable at all anymore — see firestore.rules).
 */
export async function submitSkillValidationCode(
  firebaseUser: User,
  classId: string,
  skillId: string,
  token: string
): Promise<ValidateSkillResult> {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch('/api/validate-skill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, classId, skillId, token })
  });
  return parseResult(res, 'Não foi possível validar a habilidade agora. Tente novamente.');
}

export async function completeSkillWithLink(
  firebaseUser: User,
  classId: string,
  schoolId: string,
  studentName: string,
  skillId: string,
  skillTitle: string,
  projectLink: string,
  xpReward: number,
  coinReward: number
): Promise<ValidateSkillResult> {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch('/api/complete-skill-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, classId, schoolId, studentName, skillId, skillTitle, projectLink, xpReward, coinReward })
  });
  return parseResult(res, 'Não foi possível registrar o link agora. Tente novamente.');
}

async function parseResult(res: Response, fallbackError: string): Promise<ValidateSkillResult> {
  const raw = await res.text();
  let data: (ValidateSkillResult & { error?: string }) | null = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // fall through with data = null
  }
  if (!res.ok) {
    throw new Error(data?.error ?? fallbackError);
  }
  if (!data) {
    throw new Error('Resposta inesperada do servidor.');
  }
  return data;
}
