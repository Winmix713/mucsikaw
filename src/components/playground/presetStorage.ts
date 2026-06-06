/**
 * presetStorage.ts — Safe, typed persistence for user-saved button presets.
 *
 * Mirrors the pattern in components/theme/storage.ts: encapsulated localStorage
 * access that degrades gracefully where storage is unavailable (SSR, privacy
 * mode, sandboxed iframes). Only USER presets are persisted — the built-in
 * presets are regenerated from code on every load and never written.
 */

import {
  createDefaultStyle,
  type ButtonStyle,
  type Effect,
  type EffectKind,
  type Preset } from
'./types';

const PRESET_KEY = 'button-playground-presets';
const EFFECT_ORDER: EffectKind[] = [
'glass',
'dropShadow',
'innerShadow',
'backgroundBlur',
'texture',
'noise'];
const BLUR_MODES = ['uniform', 'progressive'] as const;
const NOISE_MODES = ['mono', 'duo', 'multi'] as const;

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function readString(
value: unknown,
fallback: string,
maxLength = 160,
allowEmpty = false)
: string {
  if (typeof value !== 'string') return fallback;
  const next = value.slice(0, maxLength);
  if (!allowEmpty && next.trim().length === 0) return fallback;
  return next;
}

function readNumber(
value: unknown,
fallback: number,
min = Number.NEGATIVE_INFINITY,
max = Number.POSITIVE_INFINITY)
: number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function readEnum<T extends string>(
value: unknown,
allowed: readonly T[],
fallback: T)
: T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ?
  value as T :
  fallback;
}

function cloneEffect(effect: Effect): Effect {
  return { ...effect };
}

function parseEffect(
value: unknown,
defaults: Record<EffectKind, Effect>)
: Effect | null {
  if (!isRecord(value) || typeof value.kind !== 'string') return null;

  switch (value.kind) {
    case 'glass': {
      const fallback = defaults.glass;
      if (fallback.kind !== 'glass') return null;
      return {
        kind: 'glass',
        enabled: readBoolean(value.enabled, fallback.enabled),
        refraction: readNumber(value.refraction, fallback.refraction, 0, 100),
        depth: readNumber(value.depth, fallback.depth, 0, 100),
        dispersion: readNumber(value.dispersion, fallback.dispersion, 0, 100),
        frost: readNumber(value.frost, fallback.frost, 0, 100),
        splay: readNumber(value.splay, fallback.splay, 0, 100),
        lightAngle: readNumber(value.lightAngle, fallback.lightAngle, -180, 180),
        lightIntensity: readNumber(value.lightIntensity, fallback.lightIntensity, 0, 100),
        tint: readString(value.tint, fallback.tint, 32),
        tintOpacity: readNumber(value.tintOpacity, fallback.tintOpacity, 0, 100),
        autoHighlight: readBoolean(value.autoHighlight, fallback.autoHighlight)
      };
    }
    case 'dropShadow': {
      const fallback = defaults.dropShadow;
      if (fallback.kind !== 'dropShadow') return null;
      return {
        kind: 'dropShadow',
        enabled: readBoolean(value.enabled, fallback.enabled),
        x: readNumber(value.x, fallback.x, -200, 200),
        y: readNumber(value.y, fallback.y, -200, 200),
        blur: readNumber(value.blur, fallback.blur, 0, 300),
        spread: readNumber(value.spread, fallback.spread, -200, 200),
        color: readString(value.color, fallback.color, 32),
        opacity: readNumber(value.opacity, fallback.opacity, 0, 100),
        showBehind: readBoolean(value.showBehind, fallback.showBehind)
      };
    }
    case 'innerShadow': {
      const fallback = defaults.innerShadow;
      if (fallback.kind !== 'innerShadow') return null;
      return {
        kind: 'innerShadow',
        enabled: readBoolean(value.enabled, fallback.enabled),
        x: readNumber(value.x, fallback.x, -200, 200),
        y: readNumber(value.y, fallback.y, -200, 200),
        blur: readNumber(value.blur, fallback.blur, 0, 300),
        spread: readNumber(value.spread, fallback.spread, -200, 200),
        color: readString(value.color, fallback.color, 32),
        opacity: readNumber(value.opacity, fallback.opacity, 0, 100)
      };
    }
    case 'backgroundBlur': {
      const fallback = defaults.backgroundBlur;
      if (fallback.kind !== 'backgroundBlur') return null;
      return {
        kind: 'backgroundBlur',
        enabled: readBoolean(value.enabled, fallback.enabled),
        mode: readEnum(value.mode, BLUR_MODES, fallback.mode),
        amount: readNumber(value.amount, fallback.amount, 0, 100)
      };
    }
    case 'texture': {
      const fallback = defaults.texture;
      if (fallback.kind !== 'texture') return null;
      return {
        kind: 'texture',
        enabled: readBoolean(value.enabled, fallback.enabled),
        size: readNumber(value.size, fallback.size, 0, 1),
        radius: readNumber(value.radius, fallback.radius, 0, 40),
        clipToShape: readBoolean(value.clipToShape, fallback.clipToShape),
        opacity: readNumber(value.opacity, fallback.opacity, 0, 100)
      };
    }
    case 'noise': {
      const fallback = defaults.noise;
      if (fallback.kind !== 'noise') return null;
      return {
        kind: 'noise',
        enabled: readBoolean(value.enabled, fallback.enabled),
        mode: readEnum(value.mode, NOISE_MODES, fallback.mode),
        size: readNumber(value.size, fallback.size, 0, 1),
        density: readNumber(value.density, fallback.density, 0, 100),
        color: readString(value.color, fallback.color, 32),
        opacity: readNumber(value.opacity, fallback.opacity, 0, 100)
      };
    }
    default:
      return null;
  }
}

function parseEffects(value: unknown, fallbackEffects: Effect[]): Effect[] {
  const defaultByKind = fallbackEffects.reduce<Record<EffectKind, Effect>>(
    (acc, effect) => {
      acc[effect.kind] = effect;
      return acc;
    },
    {} as Record<EffectKind, Effect>
  );

  const parsedByKind = new Map<EffectKind, Effect>();

  if (Array.isArray(value)) {
    for (const effect of value) {
      const parsed = parseEffect(effect, defaultByKind);
      if (parsed) parsedByKind.set(parsed.kind, parsed);
    }
  }

  return EFFECT_ORDER.map(
    (kind) => parsedByKind.get(kind) ?? cloneEffect(defaultByKind[kind])
  );
}

function parseStyle(value: unknown): ButtonStyle | null {
  if (!isRecord(value)) return null;

  const fallback = createDefaultStyle();

  return {
    label: readString(value.label, fallback.label, 80),
    baseColor: readString(value.baseColor, fallback.baseColor, 32),
    textColor: readString(value.textColor, fallback.textColor, 32),
    radius: readNumber(value.radius, fallback.radius, 0, 999),
    paddingX: readNumber(value.paddingX, fallback.paddingX, 0, 200),
    paddingY: readNumber(value.paddingY, fallback.paddingY, 0, 200),
    fontSize: readNumber(value.fontSize, fallback.fontSize, 8, 72),
    fontWeight: readNumber(value.fontWeight, fallback.fontWeight, 100, 900),
    borderWidth: readNumber(value.borderWidth, fallback.borderWidth, 0, 20),
    borderColor: readString(value.borderColor, fallback.borderColor, 32),
    borderOpacity: readNumber(value.borderOpacity, fallback.borderOpacity, 0, 100),
    fillColor: readString(value.fillColor, fallback.fillColor, 32),
    fillOpacity: readNumber(value.fillOpacity, fallback.fillOpacity, 0, 100),
    effects: parseEffects(value.effects, fallback.effects)
  };
}

function parsePreset(value: unknown): Preset | null {
  if (!isRecord(value)) return null;
  const style = parseStyle(value.style);
  if (!style) return null;

  const name = readString(value.name, '', 80);
  if (!name.trim()) return null;

  const swatchFallback = `linear-gradient(180deg, ${style.baseColor}, ${style.baseColor})`;

  return {
    name,
    swatch: readString(value.swatch, swatchFallback, 200),
    style
  };
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

    return parsed.
    map((preset) => parsePreset(preset)).
    filter((preset): preset is Preset => Boolean(preset));
  } catch {
    return [];
  }
}

/** Persist the given user presets. Silently no-ops where storage is blocked. */
export function setStoredPresets(presets: Preset[]): void {
  const store = getStorage();
  if (!store) return;

  try {
    const safe = presets.
    map((preset) => parsePreset(preset)).
    filter((preset): preset is Preset => Boolean(preset));
    store.setItem(PRESET_KEY, JSON.stringify(safe));
  } catch {

    /* ignore quota / privacy errors */}
}
