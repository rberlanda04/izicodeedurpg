import { existsSync, readFileSync } from 'node:fs';
import { getApps, initializeApp, applicationDefault, cert, type App } from 'firebase-admin/app';

const PROJECT_ID = 'izicodeedurpg';

let app: App | undefined;

/**
 * Shared Admin SDK bootstrap for anything that needs elevated (bypasses
 * firestore.rules) access: scripts/seedAdmin.ts and the onboarding
 * self-service handler (onboardSchoolHandler.ts). Tries a local
 * service-account.json first (gitignored — see scripts/seedAdmin.ts's
 * header for how to generate one), then FIREBASE_SERVICE_ACCOUNT_BASE64 (the
 * same JSON, base64-encoded, for environments like Vercel where you can't
 * commit or mount a file), then falls back to Application Default
 * Credentials for a locally-authenticated gcloud session.
 */
export function getFirebaseAdminApp(): App {
  if (app) return app;
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
    return app;
  }

  if (existsSync('./service-account.json')) {
    const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf-8'));
    app = initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
    return app;
  }

  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (base64) {
    const serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    app = initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
    return app;
  }

  app = initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
  return app;
}
