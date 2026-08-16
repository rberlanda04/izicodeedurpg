import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { generateContent, type ContentKind } from './server/aiContentHandler'
import { onboardSchool } from './server/onboardSchoolHandler'

// Dev-only server-side proxy for AI content generation: keeps NVIDIA_API_KEY
// out of the client bundle entirely (this file runs in Node, never ships to
// the browser) while making /api/generate-content actually work today,
// without needing the Firebase Blaze plan the Cloud Function equivalent
// (functions/src/index.ts) requires. Reads NVIDIA_API_KEY from .env.local
// via loadEnv's empty-prefix mode, which is NOT restricted to VITE_-prefixed
// vars (unlike import.meta.env on the client).
function nvidiaProxyPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'nvidia-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/generate-content', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }
        if (!apiKey) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'NVIDIA_API_KEY não configurada em .env.local' }));
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const { kind, context } = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as {
            kind: ContentKind;
            context: Record<string, unknown>;
          };
          const result = await generateContent(apiKey, kind, context ?? {});
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ kind, result }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Erro desconhecido' }));
        }
      });
    }
  };
}

// Dev-only server-side proxy for the self-service "create my school"
// onboarding flow — production equivalent is api/onboard-school.ts. Uses
// the Admin SDK (server/firebaseAdmin.ts), which in dev reads
// service-account.json from the repo root, same as scripts/seedAdmin.ts.
function onboardSchoolProxyPlugin(): Plugin {
  return {
    name: 'onboard-school-proxy',
    configureServer(server) {
      server.middlewares.use('/api/onboard-school', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const { idToken, schoolName, city } = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as {
            idToken?: string;
            schoolName?: string;
            city?: string;
          };
          if (!idToken || !schoolName) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'idToken e schoolName são obrigatórios.' }));
            return;
          }
          const result = await onboardSchool(idToken, schoolName, city ?? '');
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
  return {
    plugins: [react(), tailwindcss(), nvidiaProxyPlugin(env.NVIDIA_API_KEY), onboardSchoolProxyPlugin()]
  };
})
