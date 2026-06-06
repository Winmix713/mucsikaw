# Figma effektek React-ben — fejlesztői dokumentáció
# Figma effects in React — developer guide

> Kétnyelvű referencia / Bilingual reference (HU leírás + EN technical terms & code).
> Stack: **React + TypeScript + plain CSS / CSS Modules**. Tailwind-mentes példák, de a
> végén a projekt-specifikus Tailwind v4 / Lightning CSS gotcha-kat is összefoglaljuk.

A dokumentum lefedi a Figma 7 effektjét:

| Figma effect | CSS primary | Limit / layer |
|---|---|---|
| Drop shadow | `box-shadow`, `filter: drop-shadow()`, `text-shadow` | max 8 / layer |
| Inner shadow | `box-shadow inset` | max 8 / layer |
| Layer blur | `filter: blur()` | 1 / layer |
| Background blur | `backdrop-filter: blur()` | 1 / layer |
| Glass | `backdrop-filter` + highlight + border layers | 1 / layer |
| Noise | SVG `<feTurbulence>` data-URI or PNG tile | 2 / layer |
| Texture | SVG `<feTurbulence>` + `<feDisplacementMap>` + mask | 1 / layer |

---

## 1. Bevezető — Figma → CSS mental model

Figma egy *layer tree*-t renderel, ahol minden layerre több effekt rakható egy adott
sorrendben. Webhez ezt React-ben **stacking context**-tel modellezzük: a komponens
`position: relative`, és az effektek vagy magán az elemen, vagy `::before` / `::after`
pszeudo-elemeken / dedikált overlay div-eken ülnek.

Two rules to remember:

1. **Egy DOM elem ≠ egy Figma layer.** Egy komplex Figma layer (pl. glass + noise +
   inner shadow) gyakran 2–4 egymásra rakott DOM réteget igényel.
2. **Render order számít.** A `box-shadow`, `filter`, `backdrop-filter` nem
   kommutatív — a sorrend megváltoztatása vizuálisan más eredményt ad.

### Figma render order → CSS megfeleltetés

Figma egy layerre (top → bottom):

```
Layer blur, noise, texture
Stroke paints
Inner shadow
Fill paints
Drop shadow
Background blur, glass
```

CSS megfelelő (top → bottom a DOM/pseudo stack-ben):

```
::after        →  noise / texture / layer blur overlay
border         →  stroke
box-shadow inset → inner shadow
background     →  fill
box-shadow     →  drop shadow
::before       →  backdrop-filter (glass / background blur)
```

---

## 2. Drop shadow

**HU.** Árnyék a layer mögött, mélységérzet és fókusz keltésére. Figma paraméterek:
`X`, `Y`, `Blur`, `Spread`, `Color`, `Show behind transparent areas`.
**EN.** A shadow cast behind the layer. Maps 1:1 to CSS `box-shadow` for boxes and
`text-shadow` for text. For SVG/PNG with transparency use `filter: drop-shadow()`.

### Figma → CSS

| Figma | CSS (`box-shadow`) |
|---|---|
| X | offset-x |
| Y | offset-y |
| Blur | blur-radius |
| Spread | spread-radius |
| Color (with opacity) | color |
| Show behind transparent areas | use `filter: drop-shadow()` instead |

### CSS Module

```css
/* DropShadow.module.css */
.shadow {
  box-shadow:
    0 4px 8px 0 rgb(0 0 0 / 0.12),
    0 12px 32px -4px rgb(0 0 0 / 0.18);
}

/* Több drop shadow Figma-stílusban — vesszővel elválasztva, max 8 */
.shadowStacked {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.08),
    0 4px 8px rgb(0 0 0 / 0.08),
    0 16px 32px rgb(0 0 0 / 0.10);
}

/* "Show behind transparent areas" — csak filter: drop-shadow() követi az alpha-t */
.transparentAware {
  filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.25));
}
```

### React component

```tsx
// DropShadow.tsx
import type { CSSProperties, PropsWithChildren } from "react";

export type DropShadowProps = {
  x?: number;
  y?: number;
  blur?: number;
  spread?: number;
  color?: string;        // rgba / hex
  showBehindTransparent?: boolean;
};

export function DropShadow({
  x = 0, y = 4, blur = 8, spread = 0,
  color = "rgb(0 0 0 / 0.12)",
  showBehindTransparent = false,
  children,
}: PropsWithChildren<DropShadowProps>) {
  const shadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  const style: CSSProperties = showBehindTransparent
    ? { filter: `drop-shadow(${x}px ${y}px ${blur}px ${color})` }
    : { boxShadow: shadow };
  return <div style={style}>{children}</div>;
}
```

### Gyakori hibák / pitfalls

- `box-shadow` **nem** követi az átlátszó pixeleket — PNG/SVG ikonhoz mindig
  `filter: drop-shadow()`.
- `filter: drop-shadow()` nem támogat `spread` paramétert.
- Szövegnél `text-shadow` (nincs spread, nincs inset).

---

## 3. Inner shadow

**HU.** Befelé eső árnyék — mélyedés, „pressed" gomb állapot, szövegbe vájt hatás.
**EN.** `box-shadow` with the `inset` keyword. Stays inside the element's border-box.

### CSS Module

```css
/* InnerShadow.module.css */
.inner {
  box-shadow: inset 0 2px 4px rgb(0 0 0 / 0.20);
}

.pressed {
  box-shadow:
    inset 0 1px 2px rgb(0 0 0 / 0.30),
    inset 0 4px 12px rgb(0 0 0 / 0.15);
}

/* Inner shadow szövegre — text-shadow + background-clip: text trükk */
.engraved {
  color: transparent;
  background: #222;
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 2px 1px rgb(255 255 255 / 0.5);
}
```

### React

```tsx
export type InnerShadowProps = {
  x?: number; y?: number; blur?: number; spread?: number; color?: string;
};

export function InnerShadow({
  x = 0, y = 2, blur = 4, spread = 0,
  color = "rgb(0 0 0 / 0.2)",
  children,
}: React.PropsWithChildren<InnerShadowProps>) {
  return (
    <div style={{ boxShadow: `inset ${x}px ${y}px ${blur}px ${spread}px ${color}` }}>
      {children}
    </div>
  );
}
```

### Megjegyzések

- Inner shadow **csak akkor látszik**, ha az elemnek van háttere (`background`) —
  különben nincs mire vetülnie.
- Nem támogatja a „show behind transparent areas" beállítást (a Figma sem).

---

## 4. Layer blur

**HU.** Az egész layert (és tartalmát) elmossa. `filter: blur()`.
**EN.** Blurs the layer and its content. Two variants: **uniform** (single `blur()`)
and **progressive** (mask + gradient to fade blur strength across the layer).

### Uniform layer blur

```css
.blur {
  filter: blur(8px);
}
```

### Progressive layer blur

Egy igazi progressive blurhoz két réteget rakunk egymásra: a tiszta verzió alá tesszük
az elmosottat, és a felső layert mask-image gradiens-szel maszkoljuk.

```css
/* ProgressiveBlur.module.css */
.wrap { position: relative; }

.layer,
.layer img {
  display: block;
  width: 100%;
  height: 100%;
}

.blurred {
  position: absolute;
  inset: 0;
  filter: blur(16px);
  /* Felülről lefelé erősödő blur: alul látszik a blur, felül nem */
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
}
```

```tsx
export function ProgressiveBlur({
  src, amount = 16,
}: { src: string; amount?: number }) {
  return (
    <div className={styles.wrap}>
      <img className={styles.layer} src={src} alt="" />
      <div
        className={styles.blurred}
        style={{ filter: `blur(${amount}px)`, backgroundImage: `url(${src})`,
                 backgroundSize: "cover" }}
      />
    </div>
  );
}
```

### Gotcha

- `filter: blur()` **új stacking context**-et hoz létre — a `z-index` szabályok
  másképp viselkednek a blur-ölt elemen belül.
- A blur a layer szélén túlnyúlik — `overflow: hidden` a szülőn levágja.

---

## 5. Background blur

**HU.** A layer *mögötti* tartalmat mossa el (frosted glass alapja). `backdrop-filter`.
**EN.** Blurs what's *behind* the element. Requires the element's background fill to
have opacity < 100% to be visible — otherwise the fill covers the blur.

### CSS Module

```css
/* BackgroundBlur.module.css */
.bg {
  /* MUST: fill opacity < 100% */
  background: rgb(255 255 255 / 0.3);
  backdrop-filter: blur(16px) saturate(140%);
  /* NE írj kézzel -webkit-backdrop-filter-t! Lásd 9. szekció. */
}

/* Progressive background blur — mask gradient */
.progressive {
  background: rgb(255 255 255 / 0.001); /* majdnem 0, de nem 0 */
  backdrop-filter: blur(20px);
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
}

/* Fallback olyan böngészőknek, amik nem támogatják */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .bg { background: rgb(255 255 255 / 0.85); }
}
```

### React

```tsx
export function BackgroundBlur({
  blur = 16, saturate = 140, tint = "rgb(255 255 255 / 0.3)",
  children,
}: React.PropsWithChildren<{ blur?: number; saturate?: number; tint?: string }>) {
  return (
    <div
      style={{
        background: tint,
        backdropFilter: `blur(${blur}px) saturate(${saturate}%)`,
      }}
    >
      {children}
    </div>
  );
}
```

### Pitfalls

- `fill-opacity: 100%` → semmi nem látszik. Tartsd 0.10–0.99 közt.
- Egy elemen csak **egy** background blur — több réteg nem összegződik.
- Drága effekt — kerüld scrollozó listák minden elemén, használj `contain: paint`-ot.

---

## 6. Glass

**HU.** A Figma 26-os glass effekt (Apple Liquid Glass) több vizuális réteget egyesít:
frost (background blur), highlight (világítás iránya/intenzitása), depth (domború él),
refraction / dispersion (kromatikus szóródás a peremen). Webhez ezt 3–4 réteggel
modellezzük: backdrop blur + radial/linear gradient highlight + inset border + opcionális
chromatic split a `::before` / `::after` rétegen.
**EN.** Compose: backdrop-filter (frost) + linear-gradient highlight (light angle/intensity)
+ inset border ring (depth) + optional chromatic edge via duplicated `::before` with
slight hue offsets and `mix-blend-mode`.

### Figma paraméter → CSS

| Figma | CSS approximation |
|---|---|
| Frost | `backdrop-filter: blur(Npx)` |
| Light angle | gradient angle on highlight overlay |
| Light intensity | gradient stop alpha |
| Depth | inset `box-shadow` (top highlight + bottom shadow) + border-radius |
| Dispersion | duplicated edge layers with hue-rotate + `mix-blend-mode: screen` |
| Refraction | inset highlight + slight `backdrop-filter: blur(...) contrast(...)` |
| Splay | gradient spread (longer color stops) |

### CSS Module

```css
/* GlassPanel.module.css */
.glass {
  position: relative;
  isolation: isolate;       /* saját stacking context */
  border-radius: 24px;
  background: rgb(255 255 255 / 0.18);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgb(255 255 255 / 0.35);
  /* depth: belső felső highlight + belső alsó árnyék */
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.6),
    inset 0 -1px 0 rgb(0 0 0 / 0.15),
    0 8px 32px rgb(0 0 0 / 0.18);
  overflow: hidden;
}

/* Light highlight — light angle ≈ 135deg */
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgb(255 255 255 / 0.45) 0%,
    rgb(255 255 255 / 0.05) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}

/* Dispersion — chromatic edge (opcionális) */
.glass::after {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgb(255 100 100 / 0.4),
    rgb(100 200 255 / 0.4)
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  mix-blend-mode: screen;
}

.glass > * { position: relative; z-index: 2; }
```

### React

```tsx
import styles from "./GlassPanel.module.css";

export type GlassPanelProps = {
  frost?: number;        // backdrop blur px
  lightAngle?: number;   // deg
  lightIntensity?: number; // 0..1
  depth?: number;        // 0..1
  dispersion?: number;   // 0..1
};

export function GlassPanel({
  frost = 24, lightAngle = 135, lightIntensity = 0.45,
  depth = 1, dispersion = 0.4,
  children,
}: React.PropsWithChildren<GlassPanelProps>) {
  return (
    <div
      className={styles.glass}
      style={{
        backdropFilter: `blur(${frost}px) saturate(160%)`,
        ["--light-angle" as any]: `${lightAngle}deg`,
        ["--light-alpha" as any]: lightIntensity,
        ["--depth-alpha" as any]: depth * 0.6,
        ["--dispersion-alpha" as any]: dispersion,
      }}
    >
      {children}
    </div>
  );
}
```

### Limitációk (Figma docs szerint, webre is érvényesek)

- **Glass és background-blur ugyanazon az elemen → konfliktus.** A web is ugyanúgy:
  két `backdrop-filter` nem rétegződik értelmesen — vagy az egyik vagy a másik
  layeren legyen.
- **Glass nem renderelhető SVG export-ba** — webhez nem releváns, de ha SVG-be
  exportálsz Figmából, az elveszik. Webnél DOM rétegekkel kell rekonstruálni.
- **Nincs environmental reflection** — sem Figmában, sem CSS-ben (csak WebGL/Three.js-szel).
- **Fill 100% opacity-vel → glass eltűnik.** Mint a background blur.

---

## 7. Noise

**HU.** Random pixel-textúra, filmes szemcsézettség. Két fő megközelítés:
**(a)** SVG `<feTurbulence>` data-URI háttérként (vektoros, skálázható), vagy
**(b)** PNG noise tile (gyorsabb render, fix felbontás).
**EN.** Grain overlay. Prefer inline SVG turbulence — no asset, scalable, tweakable.

### (a) SVG turbulence — data URI

```css
/* Noise.module.css */
.noise {
  position: relative;
}
.noise::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;                /* density / intensity */
  mix-blend-mode: overlay;      /* Mono / Duo: multiply | Multi: overlay */
  background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>\
<filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>\
<feColorMatrix type='saturate' values='0'/>\
</filter>\
<rect width='100%' height='100%' filter='url(%23n)'/>\
</svg>");
  background-size: 160px 160px;
}
```

### Figma paraméterek → SVG paraméterek

| Figma | SVG / CSS |
|---|---|
| Noise size (X/Y) | `baseFrequency` (kisebb = nagyobb szemcse), `background-size` |
| Density | `opacity` az overlay-en |
| Mono | `feColorMatrix saturate=0` (szürke) |
| Duo | `feColorMatrix` + két szín között (`feComponentTransfer`) |
| Multi | `feColorMatrix` nélkül (RGB random) |
| Color (Mono/Duo) | overlay `background-color` + `mix-blend-mode: multiply` |

### React

```tsx
export function NoiseLayer({
  density = 0.15, size = 160, mode = "mono",
}: { density?: number; size?: number; mode?: "mono" | "duo" | "multi" }) {
  const saturate = mode === "multi" ? "" : `<feColorMatrix type='saturate' values='0'/>`;
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>${saturate}</filter>` +
    `<rect width='100%' height='100%' filter='url(%23n)'/></svg>`
  );
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: density,
        mixBlendMode: mode === "mono" ? "multiply" : "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
```

### (b) PNG tile alternatíva

```css
.noisePng {
  background-image: url("/noise-256.png");
  background-repeat: repeat;
}
```

Cserébe ~5–20 kB asset, de gyorsabb render, animálható (`background-position` shift)
flicker-szerű grain mozgáshoz.

---

## 8. Texture

**HU.** Az **él** torzítása — „rough edge" effekt. SVG-ben `<feTurbulence>` +
`<feDisplacementMap>` képezi le a Figma textúrát: a turbulencia generál egy noise
mintát, a displacement map ennek alapján tolja el az elem pixeleit.
**EN.** Edge roughening via SVG displacement filter. Combine with `mask-image` to
clip the texture to the shape (Figma's "Clip to shape" toggle).

### CSS + inline SVG filter

A `feDisplacementMap` csak SVG `<filter>`-rel működik, ezt a DOM-ban egy hidden
`<svg>` definiálja, és `filter: url(#id)`-vel hivatkozzuk.

```tsx
// TextureFilter.tsx — egyszer rendereld a layout gyökerében
export function TextureFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <filter id="rough-edge">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="12" />
      </filter>
    </svg>
  );
}
```

```css
/* Texture.module.css */
.textured {
  filter: url(#rough-edge);
}

/* "Clip to shape" — maszkold a textúrát az eredeti alakra */
.clipped {
  -webkit-mask-image: linear-gradient(#000, #000);
          mask-image: linear-gradient(#000, #000);
}
```

### Figma paraméter → SVG attr

| Figma | SVG |
|---|---|
| Size (X/Y) | `baseFrequency` (X Y külön értékkel: `"0.02 0.05"`) |
| Radius | `scale` a `<feDisplacementMap>`-en |
| Clip to shape | `mask-image` / `overflow: hidden` |

### React komponens

```tsx
export function TextureLayer({
  size = 0.02, radius = 12, seed = 3, clip = true,
  children,
}: React.PropsWithChildren<{
  size?: number; radius?: number; seed?: number; clip?: boolean;
}>) {
  const id = React.useId();
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={size} numOctaves={2} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={radius} />
        </filter>
      </svg>
      <div style={{ filter: `url(#${id})`, overflow: clip ? "hidden" : "visible" }}>
        {children}
      </div>
    </>
  );
}
```

### Pitfalls

- `feDisplacementMap` költséges nagy felületen — kerüld `100vw × 100vh` panelen.
- Safarin a `feTurbulence` `seed` változtatása animációhoz repaint-et csinál.
- Drop shadow + texture: ha a texture **clipped**, a drop shadow a textúrált sziluettel
  rendelhető (Figma viselkedés) — webnél ezt `filter: drop-shadow()` + `filter: url(#tex)`
  kombóval kapod.

---

## 9. Render order kombinálása több effekttel

Egy „Figma-szerű" összetett layer DOM-szerkezete:

```tsx
<div className={styles.layer}>            {/* drop-shadow + border */}
  <div className={styles.backdrop} />     {/* ::before — backdrop-filter (glass/blur) */}
  <div className={styles.fill}>           {/* background paint */}
    {children}                            {/* tartalom */}
  </div>
  <div className={styles.innerShadow} />  {/* inset box-shadow overlay */}
  <div className={styles.noise} />        {/* ::after — noise / texture / layer blur */}
</div>
```

### Render-order tábla

| Z-index | Figma layer slot | DOM technika |
|---|---|---|
| -1 / `::before` | Background blur / Glass | `backdrop-filter` on overlay |
| 0 | Fill paints | `background` on `.fill` |
| 0 (inset) | Inner shadow | `box-shadow: inset` |
| 0 (stroke) | Stroke paints | `border` / outline |
| +1 / `::after` | Noise, texture | overlay div with `pointer-events: none` |
| outside | Drop shadow | `box-shadow` (no inset) on root |
| outside | Layer blur | `filter: blur()` on root |

### Glass + background blur konfliktus

Mind a kettő `backdrop-filter`-rel valósul meg, és **egy elem `backdrop-filter`-je
nem stackelhető**. Webes megoldás: tedd külön DOM rétegre — pl. a parent elem ad
egy background blurt, a child egy glass overlay-t (saját `backdrop-filter`-rel és
átlátszó háttérrel). Fordítva (background-blur child glass parent fölött) Figmában
sem renderel — a webnél is ugyanez a vizuális anomália.

---

## 10. Performance & gotchas

### Backdrop-filter performance

- Triggerelhet kompozit-réteget — `will-change: backdrop-filter` segít, de memóriát eszik.
- `contain: paint` a szülőn limitálja az újrarajzolást.
- **Soha** ne rakj `backdrop-filter`-t scrollozó lista minden elemére (mobil → drop frames).

### Lightning CSS / Tailwind v4 figyelmeztetés (projekt-specifikus)

Ez a projekt Lightning CSS-szel buildel. **Ne írj kézzel `-webkit-backdrop-filter`-t**
a CSS-be:

```css
/* WRONG — Lightning CSS dedupe-ol, a STANDARD property elveszik, Chrome semmit nem mutat */
.glass {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* RIGHT — csak a standard property, a build prefixel ha kell */
.glass {
  backdrop-filter: blur(24px);
}
```

Ugyanez vonatkozik az összes `-webkit-`, `-moz-`, `-ms-` prefixre.

### Fallback nem támogató böngészőkre

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgb(255 255 255 / 0.85); } /* opálos fallback */
}
```

### SVG noise vs. PNG noise

| | SVG `<feTurbulence>` | PNG tile |
|---|---|---|
| Asset | 0 (inline) | 5–20 kB |
| Skálázás | vektoros | pixeles |
| Render | minden frame számolás (de cache-elt) | bitmap copy (gyors) |
| Animálható | seed változtatás újraszámol | `background-position` shift olcsó |
| Mobilon | lassabb nagy felületen | ajánlott |

Ökölszabály: **< 400×400 px** felületre SVG, fölötte PNG.

### Stacking context csapdák

- `filter`, `backdrop-filter`, `mix-blend-mode`, `isolation: isolate`,
  `transform`, `opacity < 1` → mindegyik új stacking context-et hoz létre.
- Glass / shadow overlay-eknél tedd `pointer-events: none`-t, különben elnyelik
  a kattintásokat.

---

## 11. Reusable primitives — TypeScript interface referencia

A designer↔dev átadáshoz tartsd meg a Figma paraméter-neveket a props-ban:

```ts
// effects/types.ts
export interface DropShadowParams {
  x: number; y: number; blur: number; spread: number;
  color: string; showBehindTransparent?: boolean;
}

export interface InnerShadowParams {
  x: number; y: number; blur: number; spread: number; color: string;
}

export interface LayerBlurParams {
  amount: number;          // px
  progressive?: { from: number; to: number; angle: number };
}

export interface BackgroundBlurParams {
  amount: number;          // px
  saturate?: number;       // %
  tint?: string;
  progressive?: { from: number; to: number; angle: number };
}

export interface GlassParams {
  frost: number;           // 0..100 px
  lightAngle: number;      // deg
  lightIntensity: number;  // 0..1
  depth: number;           // 0..1
  dispersion: number;      // 0..1
  splay: number;           // 0..1
  refraction: number;      // 0..1
}

export interface NoiseParams {
  colors: "mono" | "duo" | "multi";
  sizeX: number; sizeY: number;
  density: number;         // 0..1
  color?: string;          // mono/duo
  color2?: string;         // duo
  opacity?: number;        // multi
}

export interface TextureParams {
  sizeX: number; sizeY: number;
  radius: number;
  clipToShape: boolean;
}
```

Ajánlott komponens-API:

```tsx
<EffectStack
  effects={[
    { type: "backgroundBlur", amount: 20, tint: "rgb(255 255 255 / 0.2)" },
    { type: "innerShadow", x: 0, y: 1, blur: 0, spread: 0, color: "rgb(255 255 255 / 0.5)" },
    { type: "dropShadow", x: 0, y: 8, blur: 32, spread: 0, color: "rgb(0 0 0 / 0.2)" },
    { type: "noise", colors: "mono", sizeX: 160, sizeY: 160, density: 0.08 },
  ]}
>
  <Card />
</EffectStack>
```

Egy `EffectStack` belsőleg a render-order táblát követve rakja egymásra a rétegeket
(`::before` a backdrop-filter-eknek, `::after` a noise/texture-nek, `box-shadow`-okat
összefűzi vesszővel, drop shadow-okat együtt rakja, stb.).

---

## Hivatkozások / References

- Figma — Apply effects to layers: <https://help.figma.com/hc/en-us/articles/360041488473>
- MDN — `box-shadow`: <https://developer.mozilla.org/docs/Web/CSS/box-shadow>
- MDN — `backdrop-filter`: <https://developer.mozilla.org/docs/Web/CSS/backdrop-filter>
- MDN — `filter` (incl. `drop-shadow`, `blur`, `url()`): <https://developer.mozilla.org/docs/Web/CSS/filter>
- MDN — SVG `<feTurbulence>`: <https://developer.mozilla.org/docs/Web/SVG/Element/feTurbulence>
- MDN — SVG `<feDisplacementMap>`: <https://developer.mozilla.org/docs/Web/SVG/Element/feDisplacementMap>
- CSS-Tricks — backdrop-filter: <https://css-tricks.com/the-backdrop-filter-css-property/>
