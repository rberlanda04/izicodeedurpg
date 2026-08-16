import type { User } from 'firebase/auth';

export interface OnboardSchoolResult {
  schoolId: string;
  classId: string;
  roomPasscode: string;
}

/**
 * Client for the self-service "create my school" onboarding flow. Posts to
 * /api/onboard-school — served by a Vite dev-server proxy locally
 * (vite.config.ts) and a Vercel serverless function in production
 * (api/onboard-school.ts), same split as aiContentService.ts.
 */
export async function createSchoolAsTeacher(
  firebaseUser: User,
  schoolName: string,
  city: string
): Promise<OnboardSchoolResult> {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch('/api/onboard-school', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, schoolName, city })
  });
  // A crashed serverless function (e.g. misconfigured credentials) returns
  // Vercel's own plain-text error page, not JSON — res.json() on that throws
  // a confusing "Unexpected token" instead of a message the user can act on.
  const raw = await res.text();
  let data: (OnboardSchoolResult & { error?: string }) | null = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // fall through with data = null
  }
  if (!res.ok) {
    throw new Error(data?.error ?? 'O servidor de cadastro de escolas está indisponível no momento. Tente novamente em instantes.');
  }
  if (!data) {
    throw new Error('Resposta inesperada do servidor ao cadastrar a escola.');
  }
  return data;
}
