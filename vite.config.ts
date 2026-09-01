import { defineConfig, loadEnv, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateContent, type ContentKind } from './server/aiContentHandler.js'
import { onboardSchool } from './server/onboardSchoolHandler.js'
import { validateQuest } from './server/questValidationHandler.js'
import { validateSkill } from './server/skillValidationHandler.js'
import { completeSkillWithLink } from './server/skillLinkCompletionHandler.js'

/**
 * Dev-only server-side proxy factory — mirrors, for local `npm run dev`,
 * whatever the matching api/*.ts Vercel function does in production. Each
 * endpoint's handler receives the parsed JSON body and returns the JSON
 * payload to send back (or throws, which becomes a 400 with the error
 * message) — this is the one bit of shared shape across generate-content,
 * onboard-school and validate-quest, so it's factored out instead of
 * copy-pasted a third time.
 */
function jsonProxyPlugin(name: string, path: string, handle: (body: any) => Promise<unknown>): Plugin {
  return {
    name,
    configureServer(server) {
      server.middlewares.use(path, async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
          const result = await handle(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Erro desconhecido' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.NVIDIA_API_KEY;
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Keeps NVIDIA_API_KEY out of the client bundle entirely (this file
      // runs in Node, never ships to the browser).
      jsonProxyPlugin('nvidia-ai-proxy', '/api/generate-content', async ({ kind, context }: { kind: ContentKind; context: Record<string, unknown> }) => {
        if (!apiKey) throw new Error('NVIDIA_API_KEY não configurada em .env.local');
        const result = await generateContent(apiKey, kind, context ?? {});
        return { kind, result };
      }),
      jsonProxyPlugin('onboard-school-proxy', '/api/onboard-school', async ({ idToken, schoolName, city }: { idToken?: string; schoolName?: string; city?: string }) => {
        if (!idToken || !schoolName) throw new Error('idToken e schoolName são obrigatórios.');
        return onboardSchool(idToken, schoolName, city ?? '');
      }),
      jsonProxyPlugin('validate-quest-proxy', '/api/validate-quest', async ({ idToken, questId, token }: { idToken?: string; questId?: string; token?: string }) => {
        if (!idToken || !questId || !token) throw new Error('idToken, questId e token são obrigatórios.');
        return validateQuest(idToken, questId, token);
      }),
      jsonProxyPlugin('validate-skill-proxy', '/api/validate-skill', async ({ idToken, classId, skillId, token }: { idToken?: string; classId?: string; skillId?: string; token?: string }) => {
        if (!idToken || !classId || !skillId || !token) throw new Error('idToken, classId, skillId e token são obrigatórios.');
        return validateSkill(idToken, classId, skillId, token);
      }),
      jsonProxyPlugin(
        'complete-skill-link-proxy',
        '/api/complete-skill-link',
        async ({
          idToken,
          classId,
          schoolId,
          studentName,
          skillId,
          skillTitle,
          projectLink,
          xpReward,
          coinReward
        }: {
          idToken?: string;
          classId?: string;
          schoolId?: string;
          studentName?: string;
          skillId?: string;
          skillTitle?: string;
          projectLink?: string;
          xpReward?: number;
          coinReward?: number;
        }) => {
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
            throw new Error('Campos obrigatórios faltando.');
          }
          return completeSkillWithLink(idToken, classId, schoolId, studentName, skillId, skillTitle, projectLink, xpReward, coinReward);
        }
      )
    ]
  };
})
