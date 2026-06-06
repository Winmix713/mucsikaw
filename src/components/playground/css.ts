import type React from 'react';
import type {
  ButtonStyle,
  Effect,
  GlassEffect,
  DropShadowEffect,
  InnerShadowEffect,
  BackgroundBlurEffect,
  TextureEffect,
  NoiseEffect } from
'./types';

// ─── Color helpers ────────────────────────────────────────────────────────────
export function hexToRgb(hex: string): {r: number;g: number;b: number;} {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.
    split('').
    map((c) => c + c).
    join('');
  }
  const num = parseInt(h, 16);
  return {
    r: num >> 16 & 255,
    g: num >> 8 & 255,
    b: num & 255
  };
}

export function hexToRgba(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, opacity / 100));
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.round(c * (1 - amount));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function getEffect<T extends Effect>(
effects: Effect[],
kind: T['kind'])
: T | undefined {
  return effects.find((e) => e.kind === kind && e.enabled) as T | undefined;
}

// ─── Noise SVG generator (docs §7 — feTurbulence data URI) ─────────────────────
// size (0–1) → grain scale: smaller baseFrequency = larger grain.
//   baseFrequency ≈ 0.6 + size  (default 0.5 → 1.1), tile grows slightly with size.
// mode: 'mono'  → feColorMatrix saturate=0 (greyscale grain), blend multiply, tinted by color
//       'duo'   → saturate=0 + tinted overlay, blend overlay
//       'multi' → no colorMatrix (raw RGB random), blend overlay
export interface NoiseDescriptor {
  dataUri: string;
  tile: number; // px (background-size)
  opacity: number; // 0–1
  blend: 'multiply' | 'overlay';
  /** Solid tint painted under the grain for mono/duo (null = none). */
  tint: string | null;
}

function buildNoiseDescriptor(noise: NoiseEffect): NoiseDescriptor {
  const baseFrequency = Number(clamp(0.6 + noise.size, 0.4, 1.8).toFixed(3));
  const tile = Math.round(clamp(120 + noise.size * 60, 100, 200));
  const blend: 'multiply' | 'overlay' =
  noise.mode === 'mono' ? 'multiply' : 'overlay';
  const desaturate =
  noise.mode === 'multi' ? '' : `<feColorMatrix type='saturate' values='0'/>`;
  const tint = noise.mode === 'multi' ? null : hexToRgba(noise.color, 100);

  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${tile}' height='${tile}'>` +
    `<filter id='n'>` +
    `<feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='2' stitchTiles='stitch'/>` +
    desaturate +
    `</filter>` +
    `<rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  );

  // density × opacity both attenuate the overlay (docs: Density → overlay opacity).
  const opacity = Number(
    clamp(noise.density / 100 * (noise.opacity / 100), 0, 1).toFixed(3)
  );

  return {
    dataUri: `url("data:image/svg+xml;utf8,${svg}")`,
    tile,
    opacity,
    blend,
    tint
  };
}

// ─── Texture displacement filter (docs §8 — feTurbulence + feDisplacementMap) ──
export interface TextureDescriptor {
  filterId: string;
  baseFrequency: number; // size
  scale: number; // radius
  clip: boolean;
  opacity: number; // 0–1 (overlay reinforcement)
}

function buildTextureDescriptor(
tex: TextureEffect,
seedKey: string)
: TextureDescriptor {
  return {
    filterId: `tex-${seedKey}`,
    baseFrequency: Number(
      clamp(tex.size * 0.06 + 0.01, 0.005, 0.12).toFixed(4)
    ),
    scale: clamp(tex.radius, 0, 40),
    clip: tex.clipToShape,
    opacity: Number(clamp(tex.opacity / 100, 0, 1).toFixed(3))
  };
}

// ─── Compose the live values ─────────────────────────────────────────────────
export interface ComposedStyle {
  background: string;
  border: string;
  boxShadow: string;
  /** Backdrop-filter (glass OR background blur — never both, docs §9 conflict). */
  backdropFilter: string | undefined;
  /** Drop-shadow as filter() when "show behind transparent areas" is on (docs §2). */
  dropShadowFilter: string | undefined;
  noise: NoiseDescriptor | null;
  texture: TextureDescriptor | null;
  /** Glass highlight overlay gradient (light angle/intensity → docs §6). */
  glassHighlight: string | undefined;
  hasLayerBlur: boolean;
}

export function composeStyle(
style: ButtonStyle,
seedKey = 'preview')
: ComposedStyle {
  const top = lighten(style.baseColor, 0.18);
  const bottom = darken(style.baseColor, 0.28);
  const background = `linear-gradient(${top}, ${bottom})`;

  const border = `${style.borderWidth}px solid ${hexToRgba(
    style.borderColor,
    style.borderOpacity
  )}`;

  const shadows: string[] = [];

  const inner = getEffect<InnerShadowEffect>(style.effects, 'innerShadow');
  if (inner) {
    // docs §3 — inset box-shadow, stays within the border-box.
    shadows.push(
      `inset ${inner.x}px ${inner.y}px ${inner.blur}px ${inner.spread}px ${hexToRgba(
        inner.color,
        inner.opacity
      )}`
    );
  }

  // Glass depth ring (docs §6): inset top highlight + inset bottom shadow driven
  // by light angle/intensity + depth. Dispersion → subtle chromatic inset edge.
  const glass = getEffect<GlassEffect>(style.effects, 'glass');
  let glassHighlight: string | undefined;
  if (glass) {
    const rad = glass.lightAngle * Math.PI / 180;
    const li = glass.lightIntensity / 100;
    // Top highlight follows the light direction; bottom carries the depth shadow.
    const hlAlpha = clamp(0.25 + li * 0.45, 0, 0.85);
    shadows.push(`inset 0 1px 0 ${hexToRgba('#ffffff', hlAlpha * 100)}`);
    shadows.push(
      `inset 0 -1px 0 ${hexToRgba(darken(style.baseColor, 0.6), 12 + glass.depth / 100 * 20)}`
    );
    const ox = Math.round(Math.cos(rad) * (glass.splay / 100) * 12);
    const oy = Math.round(Math.sin(rad) * (glass.splay / 100) * 12);
    shadows.push(
      `inset ${ox}px ${-12 + oy}px 24px ${hexToRgba(
        darken(style.baseColor, 0.6),
        12 + glass.depth / 100 * 20
      )}`
    );
    if (glass.dispersion > 0) {
      shadows.push(
        `inset 0 0 ${Math.round(glass.dispersion / 100 * 8)}px ${hexToRgba(
          glass.tint,
          glass.dispersion / 4
        )}`
      );
    }
    // Highlight overlay gradient — light angle becomes the gradient angle,
    // intensity becomes the leading stop alpha (docs §6 table).
    const angle = (glass.lightAngle + 90 + 360) % 360;
    const a0 = clamp(0.15 + li * 0.4, 0, 0.6);
    const splayStop = clamp(35 + glass.splay * 0.4, 35, 75);
    glassHighlight = `linear-gradient(${angle}deg, rgba(255,255,255,${a0.toFixed(
      3
    )}) 0%, rgba(255,255,255,${(a0 * 0.12).toFixed(3)}) ${Math.round(
      splayStop * 0.6
    )}%, transparent ${Math.round(splayStop)}%)`;
  }

  // Drop shadow (docs §2). "Show behind transparent areas" → filter: drop-shadow()
  // (follows the alpha silhouette, NO spread). Otherwise → box-shadow.
  const drop = getEffect<DropShadowEffect>(style.effects, 'dropShadow');
  let dropShadowFilter: string | undefined;
  if (drop) {
    if (drop.showBehind) {
      dropShadowFilter = `drop-shadow(${drop.x}px ${drop.y}px ${drop.blur}px ${hexToRgba(
        drop.color,
        drop.opacity
      )})`;
    } else {
      shadows.push(
        `${drop.x}px ${drop.y}px ${drop.blur}px ${drop.spread}px ${hexToRgba(
          drop.color,
          drop.opacity
        )}`
      );
      shadows.push(`0 3px 12px rgba(0,0,0,0.28)`);
    }
  }

  // Backdrop-filter: glass (frost) OR background blur — a single element's
  // backdrop-filter cannot stack (docs §9), so glass wins when both are on.
  const bgBlur = getEffect<BackgroundBlurEffect>(
    style.effects,
    'backgroundBlur'
  );
  let backdropFilter: string | undefined;
  if (glass) {
    const blur = Math.round(
      glass.refraction / 100 * 22 + glass.frost / 100 * 10
    );
    const sat = Math.round(100 + glass.depth / 100 * 120);
    backdropFilter = `blur(${blur}px) saturate(${sat}%)`;
  } else if (bgBlur) {
    const amt =
    bgBlur.mode === 'progressive' ?
    Math.round(bgBlur.amount * 1.4) :
    bgBlur.amount;
    backdropFilter = `blur(${amt}px) saturate(140%)`;
  }

  const noiseFx = getEffect<NoiseEffect>(style.effects, 'noise');
  const textureFx = getEffect<TextureEffect>(style.effects, 'texture');

  return {
    background,
    border,
    boxShadow: shadows.join(', '),
    backdropFilter,
    dropShadowFilter,
    noise: noiseFx ? buildNoiseDescriptor(noiseFx) : null,
    texture: textureFx ? buildTextureDescriptor(textureFx, seedKey) : null,
    glassHighlight,
    // backgroundBlur 'progressive' uses a layer-blur style mask; flag retained
    // for the preview clarity warning. Glass suppresses it (single backdrop).
    hasLayerBlur: Boolean(bgBlur && !glass && bgBlur.mode === 'progressive')
  };
}

// ─── React inline style for the live preview ──────────────────────────────────
export function toReactStyle(
style: ButtonStyle,
seedKey = 'preview')
: React.CSSProperties {
  const c = composeStyle(style, seedKey);
  // fillOpacity drives the button fill's transparency (Appearance > Opacity).
  const fillAlpha = Math.max(0, Math.min(1, (style.fillOpacity ?? 100) / 100));
  // Compose root filter: texture displacement and/or drop-shadow filter.
  const filters: string[] = [];
  if (c.texture) filters.push(`url(#${c.texture.filterId})`);
  if (c.dropShadowFilter) filters.push(c.dropShadowFilter);
  return {
    color: style.textColor,
    borderRadius: style.radius >= 999 ? 9999 : style.radius,
    padding: `${style.paddingY}px ${style.paddingX}px`,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    background: c.background,
    border: c.border,
    boxShadow: c.boxShadow,
    backdropFilter: c.backdropFilter,
    WebkitBackdropFilter: c.backdropFilter,
    filter: filters.length ? filters.join(' ') : undefined,
    opacity: fillAlpha
  };
}

// ─── Interactive state simulation ─────────────────────────────────────────────
export type PreviewState = 'default' | 'hover' | 'active' | 'focus' | 'disabled';

/**
 * Returns the inline-style overrides that visually mirror what the exported
 * :hover / :active / :focus-visible / :disabled CSS rules produce, so the
 * preview faithfully matches the copyable output.
 */
export function stateOverrides(
style: ButtonStyle,
state: PreviewState,
accent: string)
: React.CSSProperties {
  const base = toReactStyle(style);
  switch (state) {
    case 'hover':
      return {
        transform: 'translateY(-1px)',
        filter: 'brightness(1.06)',
        boxShadow: `${base.boxShadow}, 0 6px 20px rgba(0,0,0,0.25)`
      };
    case 'active':
      return {
        transform: 'translateY(1px) scale(0.99)',
        filter: 'brightness(0.96)',
        boxShadow: `${base.boxShadow}, inset 0 2px 6px rgba(0,0,0,0.30)`
      };
    case 'focus':
      return {
        boxShadow: `${base.boxShadow}, 0 0 0 2px ${hexOrColor(accent)}`
      };
    case 'disabled':
      return {
        opacity: 0.5,
        filter: 'saturate(0.8)',
        cursor: 'not-allowed'
      };
    default:
      return {};
  }
}

function hexOrColor(c: string): string {
  return c;
}

// ─── Generated CSS string ──────────────────────────────────────────────────────
export function generateCss(style: ButtonStyle): string {
  const c = composeStyle(style, 'export');
  const radius = style.radius >= 999 ? '9999px' : `${style.radius}px`;
  const lines = [
  '.primary-button {',
  '  position: relative;',
  '  isolation: isolate;',
  '  overflow: hidden;',
  `  color: ${style.textColor};`,
  `  border-radius: ${radius};`,
  `  padding: ${style.paddingY}px ${style.paddingX}px;`,
  `  font-size: ${style.fontSize}px;`,
  `  font-weight: ${style.fontWeight};`,
  `  background: ${c.background};`,
  `  border: ${c.border};`,
  `  box-shadow: ${c.boxShadow || 'none'};`,
  `  opacity: ${Number((Math.max(0, Math.min(100, style.fillOpacity ?? 100)) / 100).toFixed(3))};`];

  if (c.backdropFilter) {
    // NOTE (docs §10): do NOT hand-write -webkit-backdrop-filter — Lightning CSS
    // dedupes and drops the standard property. Emit ONLY the standard one; the
    // build adds prefixes when needed.
    lines.push(`  backdrop-filter: ${c.backdropFilter};`);
  }
  // Root filter — texture displacement and/or "show behind" drop-shadow (docs §2/§8).
  const rootFilters: string[] = [];
  if (c.texture) rootFilters.push(`url(#${c.texture.filterId})`);
  if (c.dropShadowFilter) rootFilters.push(c.dropShadowFilter);
  if (rootFilters.length) {
    lines.push(`  filter: ${rootFilters.join(' ')};`);
  }
  lines.push(
    '  transition: transform 150ms ease, box-shadow 150ms ease, filter 150ms ease, opacity 150ms ease;'
  );
  lines.push('  cursor: pointer;');
  lines.push('}');

  // Glass highlight overlay (docs §6 — ::before light gradient).
  if (c.glassHighlight) {
    lines.push('');
    lines.push('.primary-button::before {');
    lines.push('  content: "";');
    lines.push('  position: absolute;');
    lines.push('  inset: 0;');
    lines.push('  border-radius: inherit;');
    lines.push(`  background: ${c.glassHighlight};`);
    lines.push('  pointer-events: none;');
    lines.push('  z-index: 1;');
    lines.push('}');
  }

  // Noise / texture grain overlay (docs §7 — ::after with feTurbulence data URI).
  if (c.noise) {
    lines.push('');
    lines.push('.primary-button::after {');
    lines.push('  content: "";');
    lines.push('  position: absolute;');
    lines.push('  inset: 0;');
    lines.push('  border-radius: inherit;');
    lines.push('  pointer-events: none;');
    lines.push(`  opacity: ${c.noise.opacity};`);
    lines.push(`  mix-blend-mode: ${c.noise.blend};`);
    if (c.noise.tint) {
      lines.push(`  background-color: ${c.noise.tint};`);
    }
    lines.push(`  background-image: ${c.noise.dataUri};`);
    lines.push(`  background-size: ${c.noise.tile}px ${c.noise.tile}px;`);
    lines.push('  z-index: 2;');
    lines.push('}');
  }

  // Backdrop-filter fallback for unsupporting browsers (docs §5/§10).
  if (c.backdropFilter) {
    lines.push('');
    lines.push('@supports not (backdrop-filter: blur(1px)) {');
    lines.push('  .primary-button { opacity: 1; }');
    lines.push('}');
  }

  // Texture filter definition (docs §8) — render once in the DOM.
  if (c.texture) {
    lines.push('');
    lines.push('/* Add this SVG once in your markup for the texture filter: */');
    lines.push('/*');
    lines.push(
      '<svg width="0" height="0" style="position:absolute" aria-hidden>'
    );
    lines.push(`  <filter id="${c.texture.filterId}">`);
    lines.push(
      `    <feTurbulence type="fractalNoise" baseFrequency="${c.texture.baseFrequency}" numOctaves="2" seed="3" />`
    );
    lines.push(
      `    <feDisplacementMap in="SourceGraphic" scale="${c.texture.scale}" />`
    );
    lines.push('  </filter>');
    lines.push('</svg>');
    lines.push('*/');
  }

  // Interactive states — mirror the preview simulation exactly.
  lines.push('');
  lines.push('.primary-button:hover {');
  lines.push('  transform: translateY(-1px);');
  lines.push('  filter: brightness(1.06);');
  lines.push('}');
  lines.push('');
  lines.push('.primary-button:active {');
  lines.push('  transform: translateY(1px) scale(0.99);');
  lines.push('  filter: brightness(0.96);');
  lines.push('}');
  lines.push('');
  lines.push('.primary-button:focus-visible {');
  lines.push('  outline: none;');
  lines.push(
    `  box-shadow: ${c.boxShadow || 'none'}${
    c.boxShadow ? ', ' : ''}0 0 0 2px var(--button-focus-ring, ${
    style.baseColor});`
  );
  lines.push('}');
  lines.push('');
  lines.push('.primary-button:disabled,');
  lines.push('.primary-button[aria-disabled="true"] {');
  lines.push('  opacity: 0.5;');
  lines.push('  filter: saturate(0.8);');
  lines.push('  cursor: not-allowed;');
  lines.push('}');
  return lines.join('\n');
}

// ─── Generated React component string ──────────────────────────────────────────
function toJsxTextLiteral(text: string): string {
  return JSON.stringify(text);
}

export function generateComponent(style: ButtonStyle): string {
  const c = composeStyle(style, 'export');
  const label = toJsxTextLiteral(style.label);

  if (c.texture) {
    return [
      "import React from 'react'",
      '',
      'export function PrimaryButton() {',
      '  return (',
      '    <>',
      '      <svg width="0" height="0" style={{ position: \'absolute\' }} aria-hidden>',
      `        <filter id="${c.texture.filterId}">`,
      `          <feTurbulence type="fractalNoise" baseFrequency="${c.texture.baseFrequency}" numOctaves={2} seed={3} />`,
      `          <feDisplacementMap in="SourceGraphic" scale={${c.texture.scale}} />`,
      '        </filter>',
      '      </svg>',
      `      <button className="primary-button">{${label}}</button>`,
      '    </>',
      '  )',
      '}',
      '',
      '/* Pair with the generated .primary-button CSS. */'
    ].join('\n');
  }

  return [
    "import React from 'react'",
    '',
    'export function PrimaryButton() {',
    '  return (',
    `    <button className="primary-button">{${label}}</button>`,
    '  )',
    '}',
    '',
    '/* Pair with the generated .primary-button CSS. */'
  ].join('\n');
}
