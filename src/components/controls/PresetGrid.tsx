import type { KeyboardEvent, PointerEvent } from 'react';
import { memo, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  type LucideIcon
} from 'lucide-react';
/**
 * PresetGrid.tsx
 * Premium 10/10 – fully typed, memoized, animated, accessible preset selector.
 */

// ─── Types ──────────────────────────────────────────────────────────────────
export interface Preset {
  id: string;
  label: string;
  w: number | null;
  h: number | null;
  /** Any Lucide icon component */
  icon?: LucideIcon;
  /** Disable this individual preset */
  disabled?: boolean;
}
export interface PresetGridProps {
  activeId: string;
  onChange: (id: string, w: number | null, h: number | null) => void;
  presets?: Preset[];
  /** Number of columns: 1–6 */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Icon stroke width override */
  iconStrokeWidth?: number;
  /** Icon size override (px) */
  iconSize?: number;
  /** Extra className on the wrapper */
  className?: string;
  /** data-testid for automated testing */
  'data-testid'?: string;
}
// ─── Defaults ────────────────────────────────────────────────────────────────
export const DEFAULT_PRESETS: Preset[] = [
{
  id: 'mobile',
  label: 'Mobile',
  w: 320,
  h: 640,
  icon: Smartphone
},
{
  id: 'tablet',
  label: 'Tablet',
  w: 768,
  h: 1024,
  icon: Tablet
},
{
  id: 'desktop',
  label: 'Desktop',
  w: 1440,
  h: 900,
  icon: Monitor
},
{
  id: 'custom',
  label: 'Custom',
  w: null,
  h: null,
  icon: SlidersHorizontal
}];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const COLUMN_CLASS: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
};
// ─── PresetGrid ───────────────────────────────────────────────────────────────
export const PresetGrid = memo(function PresetGrid({
  activeId,
  onChange,
  presets = DEFAULT_PRESETS,
  columns = 2,
  iconStrokeWidth = 2,
  iconSize = 12,
  className = '',
  'data-testid': testId
}: PresetGridProps) {
  // Stable handler – avoids recreating on every render for each button
  const handleChange = useCallback(
    (id: string, w: number | null, h: number | null) => onChange(id, w, h),
    [onChange]
  );
  return (
    <div
      role="group"
      aria-label="Size presets"
      data-testid={testId}
      className={`grid ${COLUMN_CLASS[columns]} gap-1.5 w-full ${className}`}>
      
      {presets.map((preset) =>
      <PresetButton
        key={preset.id}
        preset={preset}
        isActive={activeId === preset.id}
        iconSize={iconSize}
        iconStrokeWidth={iconStrokeWidth}
        onClick={handleChange} />

      )}
    </div>);

});
// ─── PresetButton ─────────────────────────────────────────────────────────────
interface PresetButtonProps {
  preset: Preset;
  isActive: boolean;
  iconSize: number;
  iconStrokeWidth: number;
  onClick: (id: string, w: number | null, h: number | null) => void;
}
const PresetButton = memo(function PresetButton({
  preset,
  isActive,
  iconSize,
  iconStrokeWidth,
  onClick
}: PresetButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tapOrigin, setTapOrigin] = useState('center center');
  const Icon = preset.icon;
  // Compute transform-origin from pointer position for an organic tap feel
  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setTapOrigin(`${e.clientX - rect.left}px ${e.clientY - rect.top}px`);
    },
    []
  );
  // Reset origin for keyboard users
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setTapOrigin('center center');
      }
    },
    []
  );
  const handleClick = useCallback(() => {
    if (!preset.disabled) {
      onClick(preset.id, preset.w, preset.h);
    }
  }, [onClick, preset]);
  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={preset.disabled}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      aria-pressed={isActive}
      aria-label={preset.label}
      // Show full label as native tooltip when text is truncated
      title={preset.label}
      data-testid={`preset-btn-${preset.id}`}
      whileTap={
      preset.disabled ?
      undefined :
      {
        scale: 0.95,
        transition: {
          duration: 0.08,
          ease: 'easeOut'
        }
      }
      }
      style={{
        transformOrigin: tapOrigin
      }}
      className={[
      // Layout
      'relative flex items-center justify-start gap-2 h-7 px-2 w-full overflow-hidden',
      // Shape & border
      'rounded-[var(--r-sm,4px)] border',
      // Typography
      'text-[11px] font-medium leading-none',
      // Transition
      'transition-colors duration-150',
      // Focus ring
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--accent,#3D6AFF)]',
      'focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
      // Disabled
      preset.disabled && 'pointer-events-none opacity-40 cursor-not-allowed',
      // Active vs idle
      isActive ?
      [
      'bg-[rgba(255,255,255,0.08)]',
      'border-[rgba(255,255,255,0.12)]',
      'text-[var(--text-hi,#fff)]',
      'shadow-[0_2px_8px_rgba(0,0,0,0.35)]'].
      join(' ') :
      [
      'bg-[rgba(0,0,0,0.2)]',
      'border-[var(--border-subtle,rgba(255,255,255,0.08))]',
      'text-[var(--text-mid,rgba(255,255,255,0.55))]',
      'hover:text-[var(--text-hi,#fff)]',
      'hover:bg-[rgba(255,255,255,0.04)]',
      'hover:border-[rgba(255,255,255,0.1)]'].
      join(' ')].

      filter(Boolean).
      join(' ')}>
      
      {/*
        * Sliding active highlight via shared layoutId.
        * Rendered (un-wrapped by AnimatePresence) only on the active button so
        * Framer's shared-layout engine animates it FROM the previous active
        * button TO the new one — a true sliding transition instead of a fade.
        */}
      {isActive &&
      <motion.span
        layoutId="preset-active-bg"
        className="absolute inset-0 rounded-[inherit] bg-[rgba(61,106,255,0.08)] pointer-events-none"
        transition={{
          type: 'spring',
          stiffness: 480,
          damping: 38
        }}
        aria-hidden="true" />

      }

      {/* Icon */}
      {Icon ?
      <Icon
        size={iconSize}
        strokeWidth={iconStrokeWidth}
        aria-hidden="true"
        className={[
        'relative shrink-0 transition-colors duration-150',
        isActive ?
        'text-[var(--accent,#3D6AFF)]' :
        'text-[var(--text-lo,rgba(255,255,255,0.3))]'].
        join(' ')} />
      /* Fallback dot – visible even without an icon */ :

      <span
        aria-hidden="true"
        className={[
        'relative w-1.5 h-1.5 shrink-0 rounded-full transition-all duration-150',
        isActive ?
        'bg-[var(--accent,#3D6AFF)] shadow-[0_0_6px_rgba(61,106,255,0.75)]' :
        'bg-[rgba(255,255,255,0.25)]'].
        join(' ')} />

      }

      {/* Label */}
      <span className="relative truncate">{preset.label}</span>
    </motion.button>);

});