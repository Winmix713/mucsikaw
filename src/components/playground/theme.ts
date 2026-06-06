import type { Appearance } from './types';

export interface ThemeTokens {
  // page / panel surfaces
  page: string;
  panel: string;
  panelSoft: string;
  stage: string;
  surface: string;
  surfaceHover: string;
  // borders
  border: string;
  borderStrong: string;
  // text
  textHi: string;
  textMid: string;
  textLo: string;
  // misc
  stageDots: string;
  shadowPanel: string;
}

export function getTokens(appearance: Appearance, accent: string): ThemeTokens {
  if (appearance === 'light') {
    return {
      page: '#f4f5f8',
      panel: '#ffffff',
      panelSoft: '#fbfbfd',
      stage: '#f7f8fb',
      surface: 'rgba(15,18,28,0.035)',
      surfaceHover: 'rgba(15,18,28,0.06)',
      border: 'rgba(15,18,28,0.08)',
      borderStrong: 'rgba(15,18,28,0.14)',
      textHi: 'rgba(15,18,28,0.92)',
      textMid: 'rgba(15,18,28,0.55)',
      textLo: 'rgba(15,18,28,0.38)',
      stageDots: 'rgba(15,18,28,0.07)',
      shadowPanel: '0 24px 60px -28px rgba(15,18,28,0.22)'
    };
  }
  return {
    page: '#040406',
    panel: '#0a0a0c',
    panelSoft: '#060608',
    stage: '#060608',
    surface: 'rgba(255,255,255,0.045)',
    surfaceHover: 'rgba(255,255,255,0.075)',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.16)',
    textHi: 'rgba(255,255,255,0.92)',
    textMid: 'rgba(255,255,255,0.5)',
    textLo: 'rgba(255,255,255,0.32)',
    stageDots: 'rgba(255,255,255,0.06)',
    shadowPanel: '0 40px 100px -32px rgba(0,0,0,0.85)'
  };
}

// NOTE: The previous `cssVars()` helper that injected light/dark CSS
// variables onto the playground root has been removed. Those themed
// variables (--bg-glass, --text-hi, --border-subtle, --sh-ctrl, etc.) are
// now owned globally by the centralized ThemeProvider, which writes them on
// the document root for both light and dark appearances. The playground no
// longer duplicates that theme logic.