import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  createContext } from
'react';
import {
  type Appearance,
  type AccentName,
  DEFAULT_ACCENT,
  resolveTokens,
  applyTokens } from
'./tokens';
import {
  type ThemeMode,
  getStoredMode,
  setStoredMode,
  getStoredAccent,
  setStoredAccent } from
'./storage';
export interface ThemeContextValue {
  /** Persisted preference: 'light' | 'dark' | 'system'. */
  mode: ThemeMode;
  /** Resolved appearance currently applied to the document. */
  appearance: Appearance;
  /** Active accent name. */
  accent: AccentName;
  /** Set an explicit preference. */
  setMode: (mode: ThemeMode) => void;
  /** Convenience: jump straight to a resolved appearance. */
  setAppearance: (appearance: Appearance) => void;
  /** Toggle between light and dark (resolves system first). */
  toggle: () => void;
  /** Change the active accent. */
  setAccent: (accent: AccentName) => void;
}
export const ThemeContext = createContext<ThemeContextValue | null>(null);
function getSystemAppearance(): Appearance {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ?
  'dark' :
  'light';
}
function resolveAppearance(mode: ThemeMode): Appearance {
  return mode === 'system' ? getSystemAppearance() : mode;
}
function syncDocument(appearance: Appearance, accent: AccentName): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', appearance === 'dark');
  root.setAttribute('data-theme', appearance);
  root.style.colorScheme = appearance;
  applyTokens(root.style, resolveTokens(appearance, accent));
}

const useIsomorphicLayoutEffect =
typeof window === 'undefined' ? useEffect : useLayoutEffect;
export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default mode when nothing is stored. */
  defaultMode?: ThemeMode;
  /** Default accent when nothing is stored. */
  defaultAccent?: AccentName;
}
export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultAccent = DEFAULT_ACCENT
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => getStoredMode() ?? defaultMode
  );
  const [accent, setAccentState] = useState<AccentName>(
    () => getStoredAccent() ?? defaultAccent
  );
  const [appearance, setAppearanceResolved] = useState<Appearance>(() =>
  resolveAppearance(getStoredMode() ?? defaultMode)
  );

  useIsomorphicLayoutEffect(() => {
    const resolved = resolveAppearance(mode);
    setAppearanceResolved(resolved);
    syncDocument(resolved, accent);
  }, [mode, accent]);
  // React to OS preference changes while in `system` mode.
  useEffect(() => {
    if (
    mode !== 'system' ||
    typeof window === 'undefined' ||
    !window.matchMedia)

    return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = getSystemAppearance();
      setAppearanceResolved(resolved);
      syncDocument(resolved, accent);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode, accent]);
  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setStoredMode(next);
  }, []);
  const setAppearance = useCallback(
    (next: Appearance) => {
      setMode(next);
    },
    [setMode]
  );
  const toggle = useCallback(() => {
    const current = resolveAppearance(mode);
    setMode(current === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);
  const setAccent = useCallback((next: AccentName) => {
    setAccentState(next);
    setStoredAccent(next);
  }, []);
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      appearance,
      accent,
      setMode,
      setAppearance,
      toggle,
      setAccent
    }),
    [mode, appearance, accent, setMode, setAppearance, toggle, setAccent]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}