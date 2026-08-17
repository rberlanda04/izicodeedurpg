import type { User } from 'firebase/auth';

export interface ValidateQuestResult {
  xpReward: number;
  coinReward: number;
  newLevel: number;
}

/**
 * Client for submitting the teacher's in-person validation code. Posts to
 * /api/validate-quest — same dev-proxy/Vercel-function split as
 * onboardService.ts and aiContentService.ts. Runs server-side (Admin SDK)
 * because it needs to read the code from questValidations/{questId}, which
 * the student's own Firestore rules deliberately can't read.
 */
export async function submitValidationCode(
  firebaseUser: User,
  questId: string,
  token: string
): Promise<ValidateQuestResult> {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch('/api/validate-quest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, questId, token })
  });
  const raw = await res.text();
  let data: (ValidateQuestResult & { error?: string }) | null = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // fall through with data = null
  }
  if (!res.ok) {
    throw new Error(data?.error ?? 'Não foi possível validar a missão agora. Tente novamente.');
  }
  if (!data) {
    throw new Error('Resposta inesperada do servidor ao validar a missão.');
  }
  return data;
}
