/**
 * surface.ts — Declarative, class-based surface recipes.
 *
 * Every recipe references theme CSS variables only, so a single surface
 * string adapts across light/dark automatically. Premium glassmorphism:
 * soft borders, layered highlights, inset light, subtle elevation.
 */

/** Join class fragments, dropping falsy values. */
export function cx(
...values: Array<string | false | null | undefined>)
: string {
  return values.filter(Boolean).join(' ');
}

/** Compose a base surface recipe with extra classes. */
export function surface(
recipe: string,
...extra: Array<string | false | null | undefined>)
: string {
  return cx(recipe, ...extra);
}

const GLASS_BLUR = 'supports-[backdrop-filter]:backdrop-blur-md';

export const SURFACES = {
  /** Top-level premium card / panel. */
  card: cx(
    'relative rounded-[var(--r-xl)] border',
    'border-[var(--border-panel)] bg-[var(--bg-card)]',
    'shadow-[var(--sh-card)]',
    GLASS_BLUR
  ),

  /** Inner panel / section within a card. */
  panel: cx(
    'relative rounded-[var(--r-lg)] border',
    'border-[var(--border-subtle)] bg-[var(--bg-glass)]',
    'shadow-[var(--sh-ctrl)]',
    GLASS_BLUR
  ),

  /** Interactive control surface (rows, inputs, buttons). */
  control: cx(
    'relative rounded-[var(--r-md)] border',
    'border-[var(--border-subtle)] bg-[var(--bg-glass)]',
    'shadow-[var(--sh-ctrl)] transition-[border-color,box-shadow,background-color]',
    'hover:shadow-[var(--sh-ctrl-hover)] hover:border-[var(--border-mid)]',
    GLASS_BLUR
  ),

  /** Compact metric / value badge. */
  badge: cx(
    'relative inline-flex items-center rounded-[var(--r-md)] border',
    'border-[var(--border-subtle)] bg-[var(--bg-badge)]',
    'text-[var(--text-hi)] shadow-[var(--sh-ctrl)]',
    GLASS_BLUR
  ),

  /** Floating tooltip surface. */
  tooltip: cx(
    'rounded-[var(--r-sm)] border border-[var(--border-mid)]',
    'bg-[var(--bg-card)] text-[var(--text-hi)]',
    'shadow-[var(--sh-ctrl)]',
    'supports-[backdrop-filter]:backdrop-blur-sm'
  ),

  /** Segmented control track. */
  segmented: cx(
    'rounded-[var(--r-md)] border border-[var(--border-subtle)]',
    'bg-[var(--bg-stepper)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]'
  ),

  /** Floating overlay / popover / modal surface. */
  floating: cx(
    'rounded-[var(--r-lg)] border border-[var(--border-mid)]',
    'bg-[var(--bg-card)] text-[var(--text-hi)] shadow-[var(--sh-card)]',
    GLASS_BLUR
  ),

  /** Slider track. */
  sliderTrack: cx(
    'relative h-2.5 rounded-[var(--r-pill)]',
    'bg-[var(--bg-glass)] border border-[var(--border-subtle)]',
    'shadow-[inset_0_1px_2px_rgba(0,0,0,0.22)]'
  ),

  /** Slider thumb. */
  sliderThumb: cx(
    'rounded-full bg-[var(--bg-thumb)]',
    'border border-[var(--border-mid)] shadow-[var(--sh-thumb)]'
  ),

  /** Toggle switch track. */
  switch: cx(
    'rounded-[var(--r-pill)] border border-[var(--border-subtle)]',
    'bg-[var(--bg-stepper)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]',
    'transition-colors'
  )
} as const;

export type SurfaceName = keyof typeof SURFACES;

/** Top inner-light highlight overlay (place as an absolute child). */
export const HIGHLIGHT_TOP =
'pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,var(--hl-top),transparent_42%)]';

/** Accent ring focus styles (visible only on keyboard focus). */
export const ACCENT_FOCUS_RING =
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]';