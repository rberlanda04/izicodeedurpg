import type { VercelRequest, VercelResponse } from '@vercel/node';
import { completeSkillWithLink } from '../server/skillLinkCompletionHandler.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { idToken, classId, schoolId, studentName, skillId, skillTitle, projectLink, xpReward, coinReward } =
      (req.body ?? {}) as {
        idToken?: string;
        classId?: string;
        schoolId?: string;
        studentName?: string;
        skillId?: string;
        skillTitle?: string;
        projectLink?: string;
        xpReward?: number;
        coinReward?: number;
      };
    if (
      !idToken ||
      !classId ||
      !schoolId ||
      !studentName ||
      !skillId ||
      !skillTitle ||
      !projectLink ||
      xpReward === undefined ||
      coinReward === undefined
    ) {
      res.status(400).json({ error: 'Campos obrigatórios faltando.' });
      return;
    }
    const result = await completeSkillWithLink(
      idToken,
      classId,
      schoolId,
      studentName,
      skillId,
      skillTitle,
      projectLink,
      xpReward,
      coinReward
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
  }
}
