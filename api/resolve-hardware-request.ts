import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resolveHardwareRequest } from '../server/hardwareRequestHandler.js';

// Production equivalent of the Vite dev-server proxy (vite.config.ts),
// same split as api/validate-skill.ts.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { idToken, requestId, decision } = (req.body ?? {}) as {
      idToken?: string;
      requestId?: string;
      decision?: 'APPROVED' | 'DENIED';
    };
    if (!idToken || !requestId || (decision !== 'APPROVED' && decision !== 'DENIED')) {
      res.status(400).json({ error: 'idToken, requestId e decision (APPROVED/DENIED) são obrigatórios.' });
      return;
    }
    const result = await resolveHardwareRequest(idToken, requestId, decision);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
