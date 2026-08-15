import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateContent, type ContentKind } from '../server/aiContentHandler.ts';

// Production equivalent of the Vite dev-server proxy (vite.config.ts) for
// Vercel's static build — Vite's dev-only middleware doesn't run in a
// deployed build, so without this file "/api/generate-content" 404s on
// Vercel and the client falls back to the Cloud Function path, which
// itself needs a Firebase Blaze plan. This uses the same generateContent()
// implementation from server/aiContentHandler.ts, so prompts/parsing stay
// in one place. NVIDIA_API_KEY must be set as a Vercel project env var
// (NOT prefixed with VITE_, so it never reaches the client bundle).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'NVIDIA_API_KEY não configurada nas variáveis de ambiente da Vercel' });
    return;
  }

  try {
    const { kind, context } = (req.body ?? {}) as { kind: ContentKind; context?: Record<string, unknown> };
    const result = await generateContent(apiKey, kind, context ?? {});
    res.status(200).json({ kind, result });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
