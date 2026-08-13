// Small localStorage-backed persistence layer.
//
// The app is a client-side mock with no backend, so this is the only thing
// standing between a page refresh and losing all progress. localStorage can
// throw (private browsing, quota exceeded, disabled storage, SSR-ish
// environments, etc.), so every operation is wrapped in try/catch and falls
// back to silently doing nothing — the app should keep working purely in
// memory in that case, it just won't survive a reload.

/** Shared prefix for every persisted key, e.g. `izicode:v1:user`. Bump the
 * version segment if a stored shape ever changes incompatibly. */
export const NAMESPACE = 'izicode:v1';

/** Builds a namespaced key, e.g. `namespacedKey('user')` -> `izicode:v1:user`. */
export function namespacedKey(name: string): string {
  return `${NAMESPACE}:${name}`;
}

/**
 * Loads a persisted value for `key` (expected to already be namespaced, e.g.
 * via `namespacedKey` or the literal `izicode:v1:...` form), falling back to
 * `fallback` when nothing is stored yet, storage is unavailable, or the
 * stored value can't be parsed.
 */
export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persists `value` under `key`. Fails silently if localStorage is
 * unavailable or throws (private browsing, quota exceeded, etc.).
 */
export function saveState<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore — persistence is best-effort, the app still works in memory.
  }
}

/**
 * Removes a persisted value for `key`. Fails silently, same as saveState.
 */
export function clearState(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}

/**
 * Debounces `fn` so bursts of rapid calls (e.g. several state updates in the
 * same render tick) collapse into a single call `wait`ms after the last one.
 */
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number
): (...args: TArgs) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      fn(...args);
    }, wait);
  };
}
