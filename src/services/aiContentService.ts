import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import type { Quest, SkillTier, SDGGoal } from '../types';

/**
 * Client for AI content generation. The NVIDIA API key never reaches the
 * browser in either path this tries:
 *   1. `/api/generate-content` — a Vite dev-server-only middleware
 *      (vite.config.ts + server/aiContentHandler.ts) that proxies to NVIDIA
 *      server-side. Works today in `npm run dev`, no Firebase billing plan
 *      needed. Does not exist in production static builds.
 *   2. The `generateContent` Cloud Function (functions/src/index.ts) —
 *      the production path, requires the Firebase Blaze plan + the
 *      NVIDIA_API_KEY secret + a deploy.
 * Callers should treat failures from both as expected when neither is
 * available yet and fall back to static/rules-based content.
 */

interface GenerateContentResponse<T> {
  kind: string;
  result: T;
}

const callCloudFunction = httpsCallable<
  { kind: string; context: Record<string, unknown> },
  GenerateContentResponse<unknown>
>(functions, 'generateContent');

async function callGenerateContent<T>(kind: string, context: Record<string, unknown>): Promise<T> {
  try {
    const res = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, context })
    });
    if (res.ok) {
      const data = (await res.json()) as GenerateContentResponse<T>;
      return data.result;
    }
  } catch {
    // Local dev proxy unavailable (e.g. production build) — fall through.
  }

  const res = await callCloudFunction({ kind, context });
  return (res.data as GenerateContentResponse<T>).result;
}

export interface AIQuestDraft {
  title: string;
  description: string;
  tier: SkillTier;
  sdgGoals: SDGGoal[];
  xpReward: number;
  coinReward: number;
  hardwareRequired: string[];
  validationSteps: string[];
}

export async function generateQuestWithAI(context: {
  unlockedSkillTitles: string[];
  unlockedHardware: string[];
  avoidTitles: string[];
}): Promise<Quest> {
  const draft = await callGenerateContent<AIQuestDraft>('quest', context);
  return {
    id: `quest-ai-${Date.now()}`,
    title: draft.title,
    description: draft.description,
    tier: draft.tier,
    requiredSkills: [],
    sdgGoals: draft.sdgGoals,
    xpReward: draft.xpReward,
    coinReward: draft.coinReward,
    hardwareRequired: draft.hardwareRequired,
    status: 'ACTIVE',
    validationSteps: draft.validationSteps
  };
}

export interface AICuriosityDraft {
  title: string;
  content: string;
  xpReward: number;
}

export async function generateCuriosityWithAI(labLocation: string): Promise<AICuriosityDraft> {
  return callGenerateContent<AICuriosityDraft>('curiosity', { labLocation });
}

export interface AIGuildIdentityDraft {
  name: string;
  motto: string;
}

export async function generateGuildIdentityWithAI(theme: string): Promise<AIGuildIdentityDraft> {
  return callGenerateContent<AIGuildIdentityDraft>('guildIdentity', { theme });
}
