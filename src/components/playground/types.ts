// ─── Button Playground — domain types & data ─────────────────────────────────

export type Appearance = 'light' | 'dark';

export type EffectKind =
'glass' |
'innerShadow' |
'dropShadow' |
'backgroundBlur' |
'texture' |
'noise';

export interface GlassEffect {
  kind: 'glass';
  enabled: boolean;
  refraction: number; // 0–100 → blur px
  depth: number; // 0–100 → saturate
  dispersion: number; // 0–100 → chromatic spread
  frost: number; // 0–100 → extra blur
  splay: number; // 0–100 → edge spread
  lightAngle: number; // deg, e.g. -45
  lightIntensity: number; // 0–100, e.g. 80
  tint: string; // hex
  tintOpacity: number; // 0–100
  autoHighlight: boolean;
}

export interface InnerShadowEffect {
  kind: 'innerShadow';
  enabled: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number; // 0–100
}

export interface DropShadowEffect {
  kind: 'dropShadow';
  enabled: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number; // 0–100
  showBehind: boolean;
}

export interface BackgroundBlurEffect {
  kind: 'backgroundBlur';
  enabled: boolean;
  mode: 'uniform' | 'progressive';
  amount: number; // px
}

export interface TextureEffect {
  kind: 'texture';
  enabled: boolean;
  size: number; // grain scale, e.g. 0.5
  radius: number; // px
  clipToShape: boolean;
  opacity: number; // 0–100
}

export interface NoiseEffect {
  kind: 'noise';
  enabled: boolean;
  mode: 'mono' | 'duo' | 'multi';
  size: number; // grain scale, e.g. 0.5
  density: number; // 0–100
  color: string; // hex
  opacity: number; // 0–100
}

export type Effect =
GlassEffect |
InnerShadowEffect |
DropShadowEffect |
BackgroundBlurEffect |
TextureEffect |
NoiseEffect;

export interface ButtonStyle {
  label: string;
  baseColor: string; // accent hex driving the gradient
  textColor: string;
  radius: number; // px
  paddingX: number; // px
  paddingY: number; // px
  fontSize: number; // px
  fontWeight: number;
  borderWidth: number; // px
  borderColor: string;
  borderOpacity: number; // 0–100
  fillColor: string; // hex shown in the Fill section
  fillOpacity: number; // 0–100
  effects: Effect[];
}

export interface Preset {
  name: string;
  swatch: string; // gradient or color for the chip
  style: ButtonStyle;
  /** Built-in presets are regenerated from code, never persisted or deletable. */
  builtIn?: boolean;
}

export interface ColorTheme {
  id: string;
  name: string;
  color: string;
  ring: string;
}

// ─── Color themes (from the Playground spec) ─────────────────────────────────
export const COLOR_THEMES: ColorTheme[] = [
{
  id: 'violet',
  name: 'Violet',
  color: '#7c5cff',
  ring: 'rgba(124,92,255,0.95)'
},
{ id: 'blue', name: 'Blue', color: '#2563eb', ring: 'rgba(37,99,235,0.95)' },
{ id: 'cyan', name: 'Cyan', color: '#06b6d4', ring: 'rgba(6,182,212,0.95)' },
{
  id: 'emerald',
  name: 'Emerald',
  color: '#10b981',
  ring: 'rgba(16,185,129,0.95)'
},
{
  id: 'amber',
  name: 'Amber',
  color: '#f59e0b',
  ring: 'rgba(245,158,11,0.95)'
},
{
  id: 'orange',
  name: 'Orange',
  color: '#f97316',
  ring: 'rgba(249,115,22,0.95)'
},
{
  id: 'rose',
  name: 'Rose',
  color: '#fb7185',
  ring: 'rgba(251,113,133,0.95)'
},
{
  id: 'fuchsia',
  name: 'Fuchsia',
  color: '#d946ef',
  ring: 'rgba(217,70,239,0.95)'
}];


export const RADIUS_PRESETS: {label: string;value: number;}[] = [
{ label: 'Sharp', value: 6 },
{ label: 'Soft', value: 12 },
{ label: 'Rounded', value: 14 },
{ label: 'Pill', value: 999 }];


// ─── Default starting style (mirrors the spec's primary button) ──────────────
export function createDefaultStyle(): ButtonStyle {
  return {
    label: 'Primary Action',
    baseColor: '#7c5cff',
    textColor: '#ffffff',
    radius: 14,
    paddingX: 24,
    paddingY: 12,
    fontSize: 14,
    fontWeight: 500,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderOpacity: 18,
    fillColor: '#000000',
    fillOpacity: 25,
    effects: [
    {
      kind: 'glass',
      enabled: true,
      refraction: 80,
      depth: 20,
      dispersion: 50,
      frost: 4,
      splay: 0,
      lightAngle: -45,
      lightIntensity: 80,
      tint: '#7c5cff',
      tintOpacity: 18,
      autoHighlight: true
    },
    {
      kind: 'dropShadow',
      enabled: true,
      x: 0,
      y: 16,
      blur: 42,
      spread: 0,
      color: '#7c5cff',
      opacity: 35,
      showBehind: true
    },
    {
      kind: 'innerShadow',
      enabled: true,
      x: 0,
      y: 1,
      blur: 0,
      spread: 0,
      color: '#ffffff',
      opacity: 26
    },
    {
      kind: 'backgroundBlur',
      enabled: false,
      mode: 'uniform',
      amount: 4
    },
    {
      kind: 'texture',
      enabled: false,
      size: 0.5,
      radius: 4,
      clipToShape: false,
      opacity: 24
    },
    {
      kind: 'noise',
      enabled: false,
      mode: 'mono',
      size: 0.5,
      density: 100,
      color: '#000000',
      opacity: 25
    }]

  };
}

// ─── Built-in presets ────────────────────────────────────────────────────────
export function createDefaultPresets(): Preset[] {
  const base = createDefaultStyle();
  return [
  {
    name: 'Aurora',
    swatch: 'linear-gradient(180deg, #8b74ff, #7051ff)',
    builtIn: true,
    style: { ...base, label: 'Aurora', baseColor: '#7c5cff' }
  },
  {
    name: 'Ocean',
    swatch: 'linear-gradient(180deg, #38bdf8, #2563eb)',
    builtIn: true,
    style: {
      ...base,
      label: 'Ocean',
      baseColor: '#2563eb',
      effects: tintEffects(base.effects, '#2563eb')
    }
  },
  {
    name: 'Ember',
    swatch: 'linear-gradient(180deg, #fb7185, #f97316)',
    builtIn: true,
    style: {
      ...base,
      label: 'Ember',
      baseColor: '#fb7185',
      effects: tintEffects(base.effects, '#fb7185')
    }
  }];

}

function tintEffects(effects: Effect[], color: string): Effect[] {
  return effects.map((e) => {
    if (e.kind === 'glass') return { ...e, tint: color };
    if (e.kind === 'dropShadow') return { ...e, color };
    return { ...e };
  });
}