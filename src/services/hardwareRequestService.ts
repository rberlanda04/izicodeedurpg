import type { User } from 'firebase/auth';

export interface ResolveHardwareRequestResult {
  status: 'APPROVED' | 'DENIED';
}

/**
 * GM-triggered — same text-then-parse error handling as
 * skillValidationService.ts. Only a server call can move a student's
 * Izicoins/inventory here (see server/hardwareRequestHandler.ts).
 */
export async function resolveHardwareRequest(
  firebaseUser: User,
  requestId: string,
  decision: 'APPROVED' | 'DENIED'
): Promise<ResolveHardwareRequestResult> {
  const idToken = await firebaseUser.getIdToken();
  const res = await fetch('/api/resolve-hardware-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, requestId, decision })
  });
  const raw = await res.text();
  let data: (ResolveHardwareRequestResult & { error?: string }) | null = null;
  try {
    data = JSON.parse(raw);
  } catch {
    // fall through with data = null
  }
  if (!res.ok) {
    throw new Error(data?.error ?? 'Não foi possível resolver o pedido agora. Tente novamente.');
  }
  if (!data) {
    throw new Error('Resposta inesperada do servidor.');
  }
  return data;
}
