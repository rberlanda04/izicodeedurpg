import type { User } from 'firebase/auth';
import { seedClassQuests } from './questRepo';
import { STARTER_QUEST_TEMPLATES } from '../data/mockData';

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

  // Seeded client-side (not inside the Admin SDK handler) on purpose: the
  // handler runs as a Vercel serverless function that only bundles files it
  // directly traces, and pulling in mockData.ts's whole real-content
  // dependency chain there risks the same import-resolution bug already
  // fixed once for api/*.ts (see tsconfig.node.json's comment). The GM is
  // already the class's own gameMasterIds by the time this runs (the Admin
  // SDK write already committed), so the normal quests/{questId} create
  // rule (isGmOfClass) already allows this from the client with no
  // elevated privileges needed.
  seedClassQuests(data.classId, data.schoolId, STARTER_QUEST_TEMPLATES).catch((err) =>
    console.error('Falha ao semear missões iniciais da turma piloto:', err)
  );

  return data;
}
