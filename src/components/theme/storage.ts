/**
 * storage.ts — Safe, typed theme persistence.
 *
 * Encapsulates localStorage access and degrades gracefully where storage
 * is unavailable (SSR, privacy mode, sandboxed iframes).
 */

import type { Appearance, AccentName } from './tokens';

const MODE_KEY = 'theme-mode';
const ACCENT_KEY = 'theme-accent';

/** A persisted appearance preference, or `system` for auto. */
export type ThemeMode = Appearance | 'system';

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const probe = '__theme_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

function read(key: string): string | null {
  const store = getStorage();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  const store = getStorage();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch {

    /* ignore quota / privacy errors */}
}

// ─── Mode ──────────────────────────────────────────────────────────────────

export function getStoredMode(): ThemeMode | null {
  const value = read(MODE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return null;
}

export function setStoredMode(mode: ThemeMode): void {
  write(MODE_KEY, mode);
}

// ─── Accent ──────────────────────────────────────────────────────────────────

const VALID_ACCENTS: AccentName[] = [
'blue',
'teal',
'amber',
'green',
'violet',
'pink'];


export function getStoredAccent(): AccentName | null {
  const value = read(ACCENT_KEY);
  if (value && (VALID_ACCENTS as string[]).includes(value)) {
    return value as AccentName;
  }
  return null;
}

export function setStoredAccent(accent: AccentName): void {
  write(ACCENT_KEY, accent);
}