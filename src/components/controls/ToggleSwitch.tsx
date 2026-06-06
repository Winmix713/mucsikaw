import React, { useCallback, useId, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
// ─── Types ────────────────────────────────────────────────────────────────────
type SwitchSize = 'sm' | 'md' | 'lg';
interface ToggleSwitchProps {
  /** Controlled checked state */
  checked: boolean;
  /** Called with the new value when the user toggles */
  onChange: (checked: boolean) => void;
  /** Visible label rendered beside the switch */
  label?: string;
  /** Position of the label relative to the switch */
  labelPosition?: 'left' | 'right';
  /** Disables interaction and dims the control */
  disabled?: boolean;
  /** Size variant */
  size?: SwitchSize;
  /**
   * Accessible label for the button.
   * Falls back to `label` if omitted.
   * Required when no visible `label` is provided.
   */
  ariaLabel?: string;
  /** Additional class names for the root wrapper */
  className?: string;
}
// ─── Size tokens ──────────────────────────────────────────────────────────────
const SIZE_MAP = {
  sm: {
    track: 'w-7 h-[18px]',
    knob: 14,
    knobOffset: 2,
    travel: 13,
    checkSize: 8,
    labelText: 'text-sm'
  },
  md: {
    track: 'w-9 h-[22px]',
    knob: 18,
    knobOffset: 2,
    travel: 17,
    checkSize: 10,
    labelText: 'text-sm'
  },
  lg: {
    track: 'w-11 h-[26px]',
    knob: 22,
    knobOffset: 2,
    travel: 21,
    checkSize: 12,
    labelText: 'text-base'
  }
} satisfies Record<
  SwitchSize,
  {
    track: string;
    knob: number;
    knobOffset: number;
    travel: number;
    checkSize: number;
    labelText: string;
  }>;

// ─── Spring config ────────────────────────────────────────────────────────────
const SPRING = {
  type: 'spring',
  stiffness: 500,
  damping: 30
} as const;
const FADE = {
  duration: 0.2,
  ease: 'easeOut'
} as const;
// ─── Component ────────────────────────────────────────────────────────────────
export function ToggleSwitch({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'md',
  ariaLabel,
  className
}: ToggleSwitchProps) {
  const uid = useId();
  const labelId = label ? `toggle-label-${uid}` : undefined;
  const dims = SIZE_MAP[size];
  const handleToggle = useCallback(() => {
    if (!disabled) onChange(!checked);
  }, [checked, disabled, onChange]);
  const resolvedAriaLabel = ariaLabel ?? label;
  const switchEl =
  <button
    type="button"
    role="switch"
    id={`toggle-btn-${uid}`}
    aria-checked={checked}
    aria-labelledby={labelId}
    aria-label={labelId ? undefined : resolvedAriaLabel}
    aria-disabled={disabled || undefined}
    disabled={disabled}
    onClick={handleToggle}
    className={clsx(
      // Base layout
      'relative flex shrink-0 items-center rounded-full border',
      'transition-colors duration-300',
      dims.track,
      // State colors
      checked ?
      'bg-[var(--accent)] border-[var(--accent)]' :
      'bg-[rgba(0,0,0,0.15)] border-[var(--border-subtle)]',
      // Disabled
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      // Focus ring
      'focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
      'focus-visible:ring-offset-[var(--bg-surface)]'
    )}>
    
      {/* Knob */}
      <motion.span
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: dims.knobOffset,
        width: dims.knob,
        height: dims.knob,
        willChange: 'transform'
      }}
      className="bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.25)] flex items-center justify-center"
      animate={{
        x: checked ? dims.travel : 0
      }}
      transition={SPRING}>
      
        {/* Check icon */}
        <AnimatePresence mode="wait">
          {checked &&
        <motion.svg
          key="check"
          width={dims.checkSize}
          height={dims.checkSize}
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          initial={{
            opacity: 0,
            scale: 0.6
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.6
          }}
          transition={FADE}>
          
              <motion.path
            d="M2 5L4 7L8 3"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0
            }}
            animate={{
              pathLength: 1
            }}
            exit={{
              pathLength: 0
            }}
            transition={FADE} />
          
            </motion.svg>
        }
        </AnimatePresence>
      </motion.span>
    </button>;

  if (!label) {
    return <div className={clsx('inline-flex', className)}>{switchEl}</div>;
  }
  const labelEl =
  <label
    id={labelId}
    htmlFor={`toggle-btn-${uid}`}
    className={clsx(
      dims.labelText,
      'select-none leading-none',
      'text-[var(--text-hi)]',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    )}>
    
      {label}
    </label>;

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      {labelPosition === 'left' && labelEl}
      {switchEl}
      {labelPosition === 'right' && labelEl}
    </div>);

}