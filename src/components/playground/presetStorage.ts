/**
 * presetStorage.ts — Safe, typed persistence for user-saved button presets.
 *
 * Mirrors the pattern in components/theme/storage.ts: encapsulated localStorage
 * access that degrades gracefully where storage is unavailable (SSR, privacy
 * mode, sandboxed iframes). Only USER presets are persisted — the built-in
 * presets are regenerated from code on every load and never written.
 */

import type { Preset } from './types';

const PRESET_KEY = 'button-playground-presets';

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const probe = '__preset_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Read the persisted user presets. Returns an empty array if storage is
 * unavailable or the stored payload is missing / malformed.
 */
export function getStoredPresets(): Preset[] {
  const store = getStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(PRESET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: only keep entries that look like presets.
    return parsed.filter(
      (p): p is Preset =>
      p &&
      typeof p.name === 'string' &&
      typeof p.swatch === 'string' &&
      p.style &&
      typeof p.style === 'object'
    );
  } catch {
    return [];
  }
}

/** Persist the given user presets. Silently no-ops where storage is blocked. */
export function setStoredPresets(presets: Preset[]): void {
  const store = getStorage();
  if (!store) return;
  try {
    store.setItem(PRESET_KEY, JSON.stringify(presets));
  } catch {

    /* ignore quota / privacy errors */}
}