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
  const data = (await res.json()) as OnboardSchoolResult & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Não foi possível cadastrar a escola.');
  }
  return data;
}
