import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateSkill } from '../server/skillValidationHandler.js';

// Production equivalent of the Vite dev-server proxy (vite.config.ts),
// same split as api/validate-quest.ts.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { idToken, classId, skillId, token } = (req.body ?? {}) as {
      idToken?: string;
      classId?: string;
      skillId?: string;
      token?: string;
    };
    if (!idToken || !classId || !skillId || !token) {
      res.status(400).json({ error: 'idToken, classId, skillId e token são obrigatórios.' });
      return;
    }
    const result = await validateSkill(idToken, classId, skillId, token);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
