// No Firebase imports on purpose — this is shared between client code
// (classRepo.ts) and the Node-only scripts/seedAdmin.ts / server/
// onboardSchoolHandler.ts, which run outside the Vite client bundle.

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes stay easy to
// read aloud/write on a whiteboard.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

/**
 * Generates a passcode with ~32^6 (≈1 billion) combinations — the previous
 * "IZI-" + 4 digits format (~9,000 combinations) was brute-forceable by
 * scripting anonymous sign-ins against the get-only roomPasscodes lookup.
 * `prefix` lets callers use the same entropy/format for a different
 * namespace (e.g. 'ECO' for hackathon event join codes) without colliding
 * with room passcodes in the same get-only-lookup style collection pattern.
 */
export function generateRoomPasscode(prefix = 'IZI'): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${code}`;
}
