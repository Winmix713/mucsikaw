# Figma effektusok implementálása React weboldalon
## Áttekintés
Ez a dokumentum azt mutatja be, hogyan érdemes a Figma-ban definiált effektusokat (Glass, Drop shadow, Inner shadow, Background blur, Layer blur, Noise, Texture) frontend szinten leképezni egy modern React/Next.js alapú webes UI-ban. A fókusz a CSS‑en (és Tailwind utility‑ken), a renderelési sorrenden és a teljesítményen van, nem egy konkrét UI library-n.[^1][^2][^3]
## Figma effektusok vs. web technológiák
| Figma effekt | Web technológia / CSS property | Megjegyzés |
| --- | --- | --- |
| Drop shadow | `box-shadow` | Többszörös shadow támogatott, inset‑tel inner shadow‑t is lehet emulálni.[^4][^2] |
| Inner shadow | `box-shadow: inset ...` + pseudo‑element | Nincs külön property; inset vagy ::before/::after kell.[^4][^5] |
| Layer blur | `filter: blur(...)` | Közvetlenül az elem pixeleire hat.[^6][^7] |
| Background blur | `backdrop-filter: blur(...)` (+ `-webkit-backdrop-filter`) | A háttérre hat, az elemnek átlátszónak kell lennie.[^8][^9][^10] |
| Glass (Liquid Glass) | `backdrop-filter` + fél‑transparent `background` + több `box-shadow`, border | Lényegében egy speciális background blur + lighting/shadow kombináció, az Apple glassmorphism stílusához hasonlóan.[^11][^12][^13] |
| Noise | SVG/PNG noise overlay pseudo‑element, vagy CSS `background-image` | Figma noise realtime generált; weben tipikusan tiled asset vagy SVG filter.[^14][^15][^16] |
| Texture | PNG/SVG maszk vagy background, esetleg SVG filter | Edge‑distressed hatásához maszkolt texture vagy clip‑path kell.[^14][^12] |
## Alap komponens‑architektúra React-ben
A legjobb, ha az effektusokat kis, jól újrahasznosítható styled komponensekbe / util osztályokba szervezed:

- "primitive" effekt komponensek: `<GlassPanel>`, `<BlurOverlay>`, `<NoiseLayer>`, `<ShadowBox>` stb.
- Ezek csak a layout gyerekeket renderelik, a vizuális rétegezést CSS-sel oldják.
- A konkrét UI elemek (Card, Modal, Navbar) csak kompozícióval használják ezeket.

Példa TypeScript + CSS Modules megközelítésre egy generikus `EffectLayer` esetén:

```tsx
// GlassPanel.tsx
import type { ReactNode, HTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./effects.module.css";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  depth?: "sm" | "md" | "lg"; // Figma Depth / Blur erősség mapping
  frosted?: boolean; // Figma Frost
}

export function GlassPanel({
  children,
  className,
  depth = "md",
  frosted = true,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={clsx(
        styles.glassBase,
        frosted && styles.glassFrosted,
        styles[`glassDepth-${depth}`],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
```

A Figma paramétereket (Depth, Frost, Dispersion, stb.) egyszerű enum / token szintre érdemes redukálni, nem célszerű egy az egyben numeric sliderként átvenni.[^1]
## Glass / Background blur implementálása
### CSS alapok
A glassmorphismhez szükséges:

- fél‑transparent háttér (`background: rgba(...)`),
- `backdrop-filter: blur(...)` (és `-webkit-backdrop-filter` Safari miatt),
- finom `box-shadow` és border, esetleg gradient border, hogy a depth érződjön.[^11][^9][^10][^13]

```css
/* effects.module.css */
.glassBase {
  position: relative;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.35); /* dark glass */
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.65), /* mély drop shadow */
    0 0 0 1px rgba(255, 255, 255, 0.06); /* light outline */
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.glassFrosted {
  background-image:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.04)
    );
}

.glassDepth-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glassDepth-md {
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.glassDepth-lg {
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
}
```

Ez a setup gyakorlatilag megegyezik a glassmorphism generátorok által javasolt mintákkal.[^17][^13]
### Renderelési megkötések
- A `backdrop-filter` csak akkor látszik, ha az elem háttere legalább részben átlátszó.[^9][^10]
- Safari továbbra is megköveteli a `-webkit-backdrop-filter` prefixet.[^11][^9]
- Régebbi böngészőkben fallbackként érdemes egy sima, kevésbé áttetsző háttérszínt + klasszikus `box-shadow`‑t használni (feature detection: `@supports (backdrop-filter: blur(1px)) { ... }`).[^18][^9]

```css
.glassBase {
  background: rgba(15, 23, 42, 0.80); /* fallback */
}

@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .glassBase {
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }
}
```
## Drop shadow és Inner shadow
### Drop shadow (külső árnyék)
Drop shadow Figma‑ból közvetlenül lefordítható `box-shadow`‑ra; a szintaxis: `box-shadow: offset-x offset-y blur-radius spread-radius color`.[^4][^2]

```css
.shadow-soft {
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.shadow-elevated {
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.04);
}
```

Több árnyékot vesszővel elválasztva lehet megadni, ahogy Figma is enged több drop shadow‑t egy layeren.[^2][^4]
### Inner shadow
Inner shadowhoz két irány van:

1. Egyszerűbb: `box-shadow: inset ...` – ekkor az árnyék az elem belsejére vetül.[^4][^2]
2. Precízebb: ::before/::after pseudo‑elementtel, külön border‑radiusszal, maszkokkal.

```css
.inner-shadow-sm {
  box-shadow: inset 0 1px 3px rgba(15, 23, 42, 0.75);
}

.inner-shadow-strong {
  box-shadow:
    inset 0 2px 6px rgba(15, 23, 42, 0.75),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12);
}
```

Ha a Figma makettben a belső árnyék csak egy részre vonatkozik (pl. top edge), érdemes pseudo‑elementet használni:

```css
.inner-shadow-top {
  position: relative;
}

.inner-shadow-top::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 12px 24px rgba(15, 23, 42, 0.85);
  pointer-events: none;
}
```

Ez a minta jól emulálja a Figma "Position" sliderrel beállított inner shadow‑t.[^1][^2]
## Layer blur vs. Background blur
### Layer blur → `filter: blur()`
Layer blur esetén az elem saját pixelei mosódnak el; ez lényegében a CSS `filter: blur()` függvénynek felel meg.[^6][^7]

```css
.blur-layer-sm {
  filter: blur(4px);
}

.blur-layer-lg {
  filter: blur(16px);
}
```

A `filter` végigmegy az elem gyerekein is, ezért szöveg is mosódik – ez megfelel a Figma "Layer blur" viselkedésének.[^7][^6]
### Background blur → `backdrop-filter: blur()`
Background blur esetén a mögöttes tartalom mosódik, nem a saját tartalom.[^8][^9]

```css
.blur-bg-base {
  background-color: rgba(15, 23, 42, 0.3); /* fontos: részben átlátszó */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

A Figma‑hoz hasonlóan itt is csak egy background blur alkalmazható elemként; több overlay‑t kompozícióval (több div) kell megoldani.[^1][^9]
## Noise
### Asset‑alapú noise overlay
A legstabilabb megoldás egy seamless PNG vagy SVG grain/noise pattern, ami pseudo‑elementként layer‑ként ráül a komponensre.[^14][^15][^16]

```css
.noise {
  position: relative;
}

.noise::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image: url("/textures/noise-light.png");
  background-size: 160px 160px; /* Figma Noise size approx */
  mix-blend-mode: soft-light;
  opacity: 0.35; /* Figma Density / Opacity */
}
```

- `background-size` nagyjából a Figma "Noise size" paraméterének felel meg.[^16]
- `opacity` és `mix-blend-mode` (pl. `soft-light`, `overlay`, `multiply`) a Density és Color intenzitását emulálja.[^14][^16]
### SVG alapú, CSS‑ben inlined noise
Ha nem akarsz assetet, inline SVG filterrel is generálhatsz noise‑t, de ez bonyolultabb és browser‑függő.[^16][^6]

```css
.noise-svg::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg ... fractalNoise ...%3C/svg%3E");
  mix-blend-mode: soft-light;
  opacity: 0.3;
}
```

A tényleges SVG stringet generálhatod build scriptből vagy egy online generatorból; a lényeg, hogy seamless pattern legyen.[^16]
## Texture (edge distress)
A Figma Texture effect az object kontúrját "rongyolja" meg; weben ez tipikusan maszkolt texture vagy alpha‑maszkos PNG.[^14][^12]

Egy praktikus minta glass kártyához:

```css
.texture-edge {
  position: relative;
}

.texture-edge::before {
  content: "";
  position: absolute;
  inset: -4px; /* Figma Radius */
  border-radius: inherit;
  background-image: url("/textures/edge-distress.png");
  background-size: cover;
  mix-blend-mode: soft-light;
  opacity: 0.5;
  pointer-events: none;
}

.texture-edge.texture-clip::before {
  inset: 0; /* Clip to shape */
}
```

Ha precízen a shape‑re akarod vágni (Clip to shape), modern böngészőkben `mask-image`/`-webkit-mask-image`‑et is használhatsz:[^12]

```css
.texture-mask::before {
  mask-image: url("/textures/edge-mask.png");
  mask-size: cover;
  mask-repeat: no-repeat;
}
```

Ez jól modellezi a Figma Radius és Clip to shape paramétereket: az `inset` és mask segítségével kontrollálod, meddig nyúlhat túl a layeren.[^1][^12]
## Effekt rétegezés és render order
Figma: layer esetén a sorrend nagyjából: Layer blur / Noise / Texture → Stroke → Inner shadow → Fill → Drop shadow → Background blur / Glass. Weben ennek analógja:[^1]

1. HTML struktúrával szeparálod a "belső" tartalmat és a dekorációs layereket.
2. CSS‑ben pseudo‑elementekkel rendeled a drop / inner shadow, noise, texture, sheen stb. rétegeket.

Példa egy összetett glass cardra:

```tsx
export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card">
      {children}
    </div>
  );
}
```

```css
.glass-card {
  position: relative;
  border-radius: 24px;
  padding: 24px;
  background: rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Inner highlight (Glass refraction edge) */
.glass-card::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.32);
  opacity: 0.65;
  mix-blend-mode: screen;
  pointer-events: none;
}

/* Noise layer */
.glass-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("/textures/noise-light.png");
  background-size: 160px 160px;
  mix-blend-mode: soft-light;
  opacity: 0.35;
  pointer-events: none;
}
```

Itt a pseudo‑elementek segítségével közelíted a Figma Glass refraction / Frost / Splay hatásait: a ::before adja a refrakciós highlightot, a ::after a noise‑t, a fő elem pedig a blur + shadowt.[^8][^11][^12]
## Tailwind CSS példák
Ha Tailwindet használsz, az effektusok nagy része pure utility‑vel megoldható, csak néhány custom class kell noise/texture‑re.[^3]

```tsx
export function GlassCardTW({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 
                 shadow-[0_24px_60px_rgba(15,23,42,0.65)] 
                 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/35 opacity-70 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[url('/textures/noise-light.png')] bg-[length:160px_160px] mix-blend-soft-light opacity-40" />
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}
```

A `backdrop-blur-2xl` utility közvetlenül `backdrop-filter: blur(var(--blur-2xl))`‑re fordul, a theme‑ben a blur értékek testreszabhatók.[^3]
## Teljesítmény és accessibility szempontok
- A `backdrop-filter` és nagy `filter: blur()` értékek drágák; nagy listákban vagy animált layereken érdemes csökkenteni a blur radiusot vagy statikus fallbacket használni.[^8][^6]
- Noise/texture overlay PNG‑t erősen tömörítve, kicsi méretben (pl. 256×256) érdemes tartani, ismétlődő (repeat) patternként, így a GPU cache jól kihasználható.[^14][^15]
- Kontraszt: a glass UI‑k hajlamosak túl alacsony kontrasztra; érdemes WCAG kontraszt checkert használni, illetve sötétebb text‑shadow + háttérréteg kombinációval növelni az olvashatóságot.[^11]
## Összefoglaló mapping Figma → CSS
- **Glass**: `background: rgba(...)` + `backdrop-filter: blur(...)` + finom gradient + több `box-shadow` és inner highlight pseudo‑element.
- **Drop shadow**: `box-shadow` (több shadow vesszővel), spread = Figma Spread, blur = Figma Blur.
- **Inner shadow**: `box-shadow: inset ...` vagy pseudo‑element, ha csak részleges edge‑re kell.
- **Layer blur**: `filter: blur(...)` az elemre.
- **Background blur**: `backdrop-filter: blur(...)` + áttetsző háttér.
- **Noise**: PNG/SVG overlay pseudo‑element `mix-blend-mode` + `opacity` tuning.
- **Texture**: edge distress PNG/SVG overlay, esetleg `mask-image` / `clip-path` használatával.

Ezekből a primitívekből a React komponensekbe szervezett, design‑system szintű építőkockák segítségével konzisztensen tudod visszaadni a Figma‑ban definiált Liquid Glass és egyéb effektusokat production‑ready minőségben.

---

## References

1. [Apply effects to layers – Figma Learn - Help Center](https://help.figma.com/hc/en-us/articles/360041488473-Apply-effects-to-layers) - Before you start Who can use this feature Available on any plan Anyone with can edit access to a fil...

2. [box-shadow CSS property - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow) - The box-shadow CSS property adds shadow effects around an element's frame. You can set multiple effe...

3. [backdrop-filter: blur() - Tailwind CSS](https://tailwindcss.com/docs/backdrop-filter-blur) - Utilities for applying backdrop blur filters to an element.

4. [CSS Box Shadow - W3Schools](https://www.w3schools.com/css/css3_shadows_box.asp) - Add a Blur Effect to the Shadow. The blur parameter defines the blur radius of the shadow. The highe...

5. [CSS: box-shadow on four sides with blur effect - Stack Overflow](https://stackoverflow.com/questions/50517261/css-box-shadow-on-four-sides-with-blur-effect) - The box-shadow property syntax is the fallowing ... box-shadow : horizontal offset | vertical offset...

6. [CSS filter effects - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Filter_effects) - The properties in the CSS filter effects module let you define a way of processing an element's rend...

7. [blur() CSS function - MDN Web Docs - Mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/filter-function/blur) - Specifies the radius of the blur. It defines the value of the standard deviation to the Gaussian fun...

8. [The backdrop-filter CSS property | CSS-Tricks](https://css-tricks.com/the-backdrop-filter-css-property/) - I had never heard of the backdrop-filter property until yesterday, but after a couple of hours messi...

9. [backdrop-filter - CSS: Cascading Style Sheets - MDN Web Docs](https://mdn2.netlify.app/en-us/docs/web/css/backdrop-filter/) - The backdrop-filter CSS property lets you apply graphical effects such as blurring or color shifting...

10. [CSS backdrop-filter property - W3Schools](https://www.w3schools.com/cssref/css3_pr_backdrop-filter.php) - W3Schools offers free online tutorials, references and exercises in all the major languages of the w...

11. [How to Create a Glassmorphism Effect with Pure CSS](https://dev.to/drprime01/how-to-create-a-glassmorphism-effect-with-pure-css-eca) - Glassmorphism is a new design trend that started in 2021 after many developers complained about the....

12. [Glassmorphism CSS Tips - Creating Gradient Borders with a Blurred ...](https://goodcode.us/blog/glassmorphism-css-tips-creating-gradient-borders-with-a-blurred-background) - Learn how to create stunning gradient borders in CSS that support transparency, rounded corners, and...

13. [Glassmorphism background - css - Stack Overflow](https://stackoverflow.com/questions/71356595/glassmorphism-background) - The effect is called, I believe, glassmorphism. It is generally achieved using backdrop-filter. You ...

14. [Translating texture effects into CSS?](https://www.reddit.com/r/FigmaDesign/comments/1l9frxy/translating_texture_effects_into_css/) - Translating texture effects into CSS?

15. [Noise & Texture | Figma](https://www.figma.com/community/plugin/1138854718618193875/noise-texture) - A Figma plugin to dynamically generate seamless tiled noise, textures, patterns, gradients, and more...

16. [How to add a noise effect](https://www.reddit.com/r/css/comments/1jiyvwd/how_to_add_a_noise_effect/) - How to add a noise effect

17. [Glassmorphism CSS Effect Generator - Glass CSS](https://css.glass) - Copy and paste this Glassmorphism CSS snippet into your frontend project for an amazing CSS glass ef...

18. [CSS: Workaround to backdrop-filter?](https://stackoverflow.com/questions/38145368/css-workaround-to-backdrop-filter) - backdrop-filter is a recent CSS feature, that is not yet available in modern browsers (at least as o...

