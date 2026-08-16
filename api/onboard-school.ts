import type { VercelRequest, VercelResponse } from '@vercel/node';
import { onboardSchool } from '../server/onboardSchoolHandler';

// Production equivalent of the Vite dev-server proxy (vite.config.ts),
// mirroring the pattern already established for AI content generation
// (api/generate-content.ts). Lets a signed-in teacher become a school Admin
// and get a pilot class without an operator running scripts/seedAdmin.ts —
// requires FIREBASE_SERVICE_ACCOUNT_BASE64 set as a Vercel project env var
// (see server/firebaseAdmin.ts).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { idToken, schoolName, city } = (req.body ?? {}) as {
      idToken?: string;
      schoolName?: string;
      city?: string;
    };
    if (!idToken || !schoolName) {
      res.status(400).json({ error: 'idToken e schoolName são obrigatórios.' });
      return;
    }
    const result = await onboardSchool(idToken, schoolName, city ?? '');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
