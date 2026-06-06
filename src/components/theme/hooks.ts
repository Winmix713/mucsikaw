/**
 * hooks.ts — Focused, typed hooks for consuming the theme system.
 */

import { useContext, useMemo } from 'react';
import { ThemeContext, type ThemeContextValue } from './ThemeProvider';
import {
  type AccentName,
  type Appearance,
  ACCENTS,
  resolveTokens } from
'./tokens';
import { cx } from './surface';

/** Access the theme context. Throws if used outside <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return ctx;
}

/**
 * Derive the resolved token map for the current (or a given) appearance +
 * accent. Useful for reading values in JS (e.g. canvas, charts) without
 * touching the DOM.
 */
export function useThemeVars(
appearanceOverride?: Appearance,
accentOverride?: AccentName)
: Record<string, string> {
  const { appearance, accent } = useTheme();
  const a = appearanceOverride ?? appearance;
  const acc = accentOverride ?? accent;
  return useMemo(() => resolveTokens(a, acc), [a, acc]);
}

/** Read a single resolved CSS variable value by name (with or without --). */
export function useThemeVar(name: string): string | undefined {
  const vars = useThemeVars();
  const key = name.startsWith('--') ? name : `--${name}`;
  return vars[key];
}

/** Ergonomic accent management. */
export function useAccent(): {
  accent: AccentName;
  accents: AccentName[];
  definition: (typeof ACCENTS)[AccentName];
  setAccent: (accent: AccentName) => void;
} {
  const { accent, setAccent } = useTheme();
  return {
    accent,
    accents: Object.keys(ACCENTS) as AccentName[],
    definition: ACCENTS[accent],
    setAccent
  };
}

/** Theme-safe class composition (re-exported for ergonomic imports). */
export function useThemeClass(
...classes: Array<string | false | null | undefined>)
: string {
  return useMemo(() => cx(...classes), [classes.join('|')]);
}