import React, { useCallback, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Link2Off } from 'lucide-react';
import { cn } from '../../lib/utils';
// ─── Types ────────────────────────────────────────────────────────────────────
interface LockButtonProps {
  isLocked: boolean;
  onChange: (locked: boolean) => void;
  disabled?: boolean;
  /** Button size in px — icon scales proportionally at 50% of size */
  size?: number;
}
// ─── Animation constants (hoisted — defined once, never on render) ────────────
const ICON_VARIANTS = {
  initial: {
    scale: 0.55,
    filter: 'blur(5px)',
    opacity: 0
  },
  animate: {
    scale: 1,
    filter: 'blur(0px)',
    opacity: 1
  },
  exit: {
    scale: 0.55,
    filter: 'blur(5px)',
    opacity: 0
  }
} as const;
const ICON_TRANSITION = {
  type: 'spring',
  stiffness: 320,
  damping: 22
} as const;
const BUTTON_VARIANTS = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.06
  },
  tap: {
    scale: 0.91
  },
  pressed: {
    scale: 0.95
  }
} as const;
const BUTTON_TRANSITION = {
  type: 'spring',
  stiffness: 400,
  damping: 24
} as const;
// ─── Component ────────────────────────────────────────────────────────────────
export function LockButton({
  isLocked,
  onChange,
  disabled = false,
  size = 28
}: LockButtonProps) {
  // Icon scales at 50 % of button size, clamped between 12–18 px
  const iconSize = Math.max(12, Math.min(18, Math.round(size * 0.5)));
  const Icon = isLocked ? Link : Link2Off;
  const label = isLocked ?
  'Ratio locked — click to unlink' :
  'Ratio unlocked — click to link';
  const handleClick = useCallback(() => {
    if (!disabled) onChange(!isLocked);
  }, [disabled, isLocked, onChange]);
  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isLocked}
      aria-label={label}
      title={label}
      data-state={isLocked ? 'locked' : 'unlocked'}
      // Framer motion gestures
      variants={BUTTON_VARIANTS}
      initial="rest"
      animate={isLocked ? 'pressed' : 'rest'}
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      transition={BUTTON_TRANSITION}
      style={{
        width: size,
        height: size
      }}
      className={cn(
        // Base
        'relative flex items-center justify-center rounded-[var(--r-sm)] border',
        'transition-[color,background-color,border-color,box-shadow,opacity] duration-200',
        // Focus ring
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-transparent',
        // State: locked
        isLocked && [
        'bg-[rgba(255,255,255,0.09)]',
        'border-[var(--accent,rgba(255,255,255,0.25))]',
        'text-[var(--accent,var(--text-hi))]',
        'shadow-[0_0_0_1px_var(--accent,rgba(255,255,255,0.15)),0_2px_8px_rgba(0,0,0,0.35)]'],

        // State: unlocked
        !isLocked && [
        'bg-transparent border-transparent',
        'text-[var(--text-lo)]',
        'hover:text-[var(--text-mid)] hover:bg-[rgba(255,255,255,0.04)]'],

        // Disabled
        disabled && 'cursor-not-allowed opacity-40 pointer-events-none'
      )}>
      
      {/*
        * Relative wrapper keeps AnimatePresence children absolutely positioned
        * so they don't shift the button's layout during the swap animation.
        */}
      <span
        aria-hidden="true"
        style={{
          width: iconSize,
          height: iconSize
        }}
        className="relative flex items-center justify-center">
        
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isLocked ? 'locked' : 'unlocked'}
            variants={ICON_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={ICON_TRANSITION}
            className="absolute flex items-center justify-center">
            
            <Icon size={iconSize} strokeWidth={2.5} />
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>);

}