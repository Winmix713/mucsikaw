/**
 * tokens.ts — Design token source of truth.
 *
 * Framework-agnostic. Emits the EXACT CSS variable names the existing
 * component tree already consumes (--accent, --bg-glass, --bg-badge,
 * --text-hi, --sh-ctrl, etc.) so no component needs rewriting.
 *
 * Two genuinely tuned appearance maps (light / dark) — not naive inversions.
 * Accent-aware token generation lets the active accent drive glow, ring,
 * border and active states.
 */

// ─── Appearance ────────────────────────────────────────────────────────────

export type Appearance = 'light' | 'dark';

/** The set of named accents the system can switch between. */
export type AccentName = 'blue' | 'teal' | 'amber' | 'green' | 'violet' | 'pink';

export interface AccentDefinition {
  /** Base accent (solid). */
  base: string;
  /** Lighter tint, used for highlights / hover text. */
  light: string;
  /** Low-alpha wash, used for fills / active backgrounds. */
  lo: string;
  /** rgb triplet (no alpha) for composing glows: `rgba(var, a)`. */
  rgb: string;
}

export const ACCENTS: Record<AccentName, AccentDefinition> = {
  blue: {
    base: '#3d6aff',
    light: '#779dff',
    lo: 'rgba(61,106,255,0.18)',
    rgb: '61,106,255'
  },
  teal: {
    base: '#2dd4bf',
    light: '#7ff0e2',
    lo: 'rgba(45,212,191,0.18)',
    rgb: '45,212,191'
  },
  amber: {
    base: '#f59e0b',
    light: '#fbc560',
    lo: 'rgba(245,158,11,0.18)',
    rgb: '245,158,11'
  },
  green: {
    base: '#10b981',
    light: '#5ee3b6',
    lo: 'rgba(16,185,129,0.18)',
    rgb: '16,185,129'
  },
  violet: {
    base: '#8b5cf6',
    light: '#b794ff',
    lo: 'rgba(139,92,246,0.18)',
    rgb: '139,92,246'
  },
  pink: {
    base: '#ec4899',
    light: '#f78fc2',
    lo: 'rgba(236,72,153,0.18)',
    rgb: '236,72,153'
  }
};

export const DEFAULT_ACCENT: AccentName = 'blue';

// ─── Static (appearance-independent) tokens ──────────────────────────────────

/** Radii, blur, z-depth, fixed brand colors — identical across themes. */
export const STATIC_TOKENS = {
  '--r-pill': '9999px',
  '--r-xl': '22px',
  '--r-lg': '16px',
  '--r-md': '11px',
  '--r-sm': '7px',

  '--blur-sm': '6px',
  '--blur-md': '12px',
  '--blur-lg': '22px',

  '--z-base': '0',
  '--z-raised': '10',
  '--z-overlay': '40',
  '--z-modal': '60',
  '--z-toast': '80',

  /* Fixed secondary brand hues (kept for variant components). */
  '--teal': '#2dd4bf',
  '--amber': '#f59e0b',
  '--green': '#10b981',
  '--violet': '#8b5cf6'
} as const;

// ─── Semantic surface maps ───────────────────────────────────────────────────

export type TokenMap = Record<string, string>;

/**
 * DARK appearance — refined from the original premium dark surface.
 * White-on-dark glass, deep layered shadows, soft inset highlights.
 */
export const DARK_TOKENS: TokenMap = {
  '--bg-page': '#080a10',
  '--bg-base': '#080a10',
  '--bg-card': 'rgba(13,15,22,0.92)',
  '--bg-glass': 'rgba(255,255,255,0.032)',
  '--bg-badge': 'rgba(255,255,255,0.055)',
  '--bg-icon': 'rgba(255,255,255,0.07)',
  '--bg-stepper': 'rgba(255,255,255,0.038)',
  '--bg-thumb': '#0d0f18',

  '--border-subtle': 'rgba(255,255,255,0.07)',
  '--border-mid': 'rgba(255,255,255,0.10)',
  '--border-panel': 'rgba(255,255,255,0.065)',

  '--text-hi': 'rgba(255,255,255,0.92)',
  '--text-mid': 'rgba(255,255,255,0.52)',
  '--text-lo': 'rgba(255,255,255,0.22)',

  '--sh-card':
  '0 48px 120px -32px rgba(0,0,0,0.90), 0 0 0 1px rgba(255,255,255,0.05)',
  '--sh-ctrl':
  '0 16px 28px -12px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.055), inset 0 0 0 1px rgba(255,255,255,0.035)',
  '--sh-ctrl-hover':
  '0 18px 32px -10px rgba(0,0,0,0.60), 0 4px 12px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.055)',
  '--sh-thumb':
  '0 3px 10px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)',

  /* Highlight / inset-light tokens used by surface recipes. */
  '--hl-top': 'rgba(255,255,255,0.08)',
  '--hl-inset': 'rgba(255,255,255,0.05)'
};

/**
 * LIGHT appearance — genuinely tuned, NOT an inversion.
 * Dark-on-light tints, soft cool hairline borders, dark text with proper
 * contrast, softer/cooler shadows.
 */
export const LIGHT_TOKENS: TokenMap = {
  '--bg-page': '#eef1f6',
  '--bg-base': '#eef1f6',
  '--bg-card': 'rgba(255,255,255,0.86)',
  '--bg-glass': 'rgba(15,23,42,0.028)',
  '--bg-badge': 'rgba(15,23,42,0.05)',
  '--bg-icon': 'rgba(15,23,42,0.06)',
  '--bg-stepper': 'rgba(15,23,42,0.035)',
  '--bg-thumb': '#ffffff',

  '--border-subtle': 'rgba(15,23,42,0.08)',
  '--border-mid': 'rgba(15,23,42,0.12)',
  '--border-panel': 'rgba(15,23,42,0.07)',

  '--text-hi': 'rgba(15,23,42,0.92)',
  '--text-mid': 'rgba(15,23,42,0.55)',
  '--text-lo': 'rgba(15,23,42,0.32)',

  '--sh-card':
  '0 32px 80px -28px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,23,42,0.05)',
  '--sh-ctrl':
  '0 12px 24px -14px rgba(15,23,42,0.16), 0 2px 8px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(15,23,42,0.03)',
  '--sh-ctrl-hover':
  '0 16px 30px -12px rgba(15,23,42,0.20), 0 3px 10px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,1), inset 0 0 0 1px rgba(15,23,42,0.05)',
  '--sh-thumb':
  '0 2px 8px rgba(15,23,42,0.20), 0 1px 3px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(15,23,42,0.04)',

  '--hl-top': 'rgba(255,255,255,0.85)',
  '--hl-inset': 'rgba(255,255,255,0.6)'
};

// ─── Accent-aware token generation ────────────────────────────────────────────

/**
 * Build accent-driven variables for the active accent. These influence
 * glow, ring, border and active states across the system.
 */
export function buildAccentTokens(
accent: AccentName,
appearance: Appearance)
: TokenMap {
  const def = ACCENTS[accent];
  const glowAlpha = appearance === 'dark' ? 0.45 : 0.32;
  const ringAlpha = appearance === 'dark' ? 0.55 : 0.42;

  return {
    '--accent': def.base,
    '--accent-light': def.light,
    '--accent-lo': def.lo,
    '--accent-rgb': def.rgb,
    '--accent-glow': `rgba(${def.rgb},${glowAlpha})`,
    '--accent-ring': `rgba(${def.rgb},${ringAlpha})`,
    '--accent-border': `rgba(${def.rgb},${appearance === 'dark' ? 0.4 : 0.3})`,
    '--accent-active': `rgba(${def.rgb},${appearance === 'dark' ? 0.22 : 0.14})`
  };
}

// ─── Composition helpers ──────────────────────────────────────────────────────

/** Merge any number of token groups into one map (later wins). */
export function mergeTokens(...groups: Array<TokenMap | undefined>): TokenMap {
  return Object.assign({}, ...groups.filter(Boolean));
}

/**
 * Resolve the complete token map for an appearance + accent.
 * This is the single function the ThemeProvider applies to the root.
 */
export function resolveTokens(
appearance: Appearance,
accent: AccentName)
: TokenMap {
  return mergeTokens(
    STATIC_TOKENS as unknown as TokenMap,
    appearance === 'dark' ? DARK_TOKENS : LIGHT_TOKENS,
    buildAccentTokens(accent, appearance)
  );
}

/** Apply a token map to a CSSStyleDeclaration (e.g. documentElement.style). */
export function applyTokens(
style: CSSStyleDeclaration,
tokens: TokenMap)
: void {
  for (const [key, value] of Object.entries(tokens)) {
    style.setProperty(key, value);
  }
}

/** Serialize a token map into a safe CSS rule body (for SSR / style tags). */
export function serializeTokens(tokens: TokenMap, selector = ':root'): string {
  const body = Object.entries(tokens).
  map(([key, value]) => `  ${key}: ${String(value).replace(/[\n;]/g, '')};`).
  join('\n');
  return `${selector} {\n${body}\n}`;
}