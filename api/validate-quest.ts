import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateQuest } from '../server/questValidationHandler.js';

// Production equivalent of the Vite dev-server proxy (vite.config.ts),
// same split as api/onboard-school.ts and api/generate-content.ts.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { idToken, questId, token } = (req.body ?? {}) as {
      idToken?: string;
      questId?: string;
      token?: string;
    };
    if (!idToken || !questId || !token) {
      res.status(400).json({ error: 'idToken, questId e token são obrigatórios.' });
      return;
    }
    const result = await validateQuest(idToken, questId, token);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
