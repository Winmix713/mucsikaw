/**
 * motion.ts — Reusable motion presets tuned for a premium feel.
 *
 * Springs are crisp and refined (never cheap-bouncy). Easings use the
 * signature [0.16, 1, 0.3, 1] expo-out curve already present in the system.
 * All presets are framer-motion compatible.
 */

import type { Transition, Variants } from 'framer-motion';

/** Signature expo-out easing used across the system. */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

/** Spring presets — tuned, controlled, minimal overshoot. */
export const SPRINGS = {
  /** Snappy UI feedback (thumbs, toggles, dock magnets). */
  crisp: { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  /** Soft settle for surfaces / panels. */
  soft: { type: 'spring', stiffness: 260, damping: 28 } as Transition,
  /** Gentle, slightly weighted for larger elements. */
  gentle: { type: 'spring', stiffness: 180, damping: 26 } as Transition
} as const;

/** Duration-based transitions. */
export const DURATIONS = {
  fast: { duration: 0.14, ease: EASE_PREMIUM } as Transition,
  base: { duration: 0.22, ease: EASE_PREMIUM } as Transition,
  slow: { duration: 0.42, ease: EASE_PREMIUM } as Transition
} as const;

/** Interaction gesture presets (use with whileHover / whileTap). */
export const MOTION = {
  hover: { scale: 1.02, y: -1 },
  hoverSubtle: { y: -1 },
  press: { scale: 0.97 },
  pressFirm: { scale: 0.94 }
} as const;

/** Variant presets for AnimatePresence-driven elements. */
export const VARIANTS: Record<string, Variants> = {
  tooltip: {
    hidden: { opacity: 0, y: 6, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1 }
  },
  badge: {
    hidden: { opacity: 0, y: '26%', scale: 0.96 },
    visible: { opacity: 1, y: '0%', scale: 1 },
    exit: { opacity: 0, y: '-26%', scale: 0.96 }
  },
  modal: {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 6 }
  },
  toggle: {
    off: { x: 0 },
    on: { x: '100%' }
  }
};

export const TRANSITIONS = {
  tooltip: DURATIONS.fast,
  badge: DURATIONS.slow,
  slider: DURATIONS.fast,
  modal: SPRINGS.soft,
  toggle: SPRINGS.crisp,
  hover: SPRINGS.crisp
} as const;

/** Reduced-motion-safe transition: collapse to a quick crossfade. */
export function reduceTransition(
reduced: boolean | null,
transition: Transition)
: Transition {
  return reduced ? { duration: 0.12, ease: 'linear' } : transition;
}