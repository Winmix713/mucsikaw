import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
  Component } from
'react';
import { motion, useAnimate } from 'framer-motion';
import { cn } from '../../lib/utils';
// ─── Types ────────────────────────────────────────────────────────────────────
interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  unit?: string;
  /** Must be > 0. Supports decimals (e.g. 0.5, 0.1). */
  step?: number;
  disabled?: boolean;
}
// ─── Hold-to-repeat config ────────────────────────────────────────────────────
/** Delay before auto-repeat begins (ms) */
const HOLD_DELAY = 380;
/** Interval between repeated steps (ms) */
const HOLD_INTERVAL = 60;
// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}
/**
 * Round a float to the same decimal precision as `step` to avoid
 * floating-point drift (e.g. 0.1 + 0.2 = 0.30000000000000004).
 */
function roundToStep(val: number, step: number): number {
  const decimals = (step.toString().split('.')[1] ?? '').length;
  return parseFloat(val.toFixed(decimals));
}
// ─── Component ────────────────────────────────────────────────────────────────
export function Stepper({
  value,
  min,
  max,
  onChange,
  unit = 'px',
  step = 1,
  disabled = false
}: StepperProps) {
  // Guard: step must be positive to avoid infinite loops
  const safeStep = step > 0 ? step : 1;
  const [inputValue, setInputValue] = useState(value.toString());
  const [isError, setIsError] = useState(false);
  const isFocusedRef = useRef(false);
  const shakeTokenRef = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Always-fresh mirror of the committed value. The hold-to-repeat interval
  // reads/advances THIS ref instead of the `value` prop captured in its
  // closure — otherwise every tick would re-commit the same start value and
  // the number would never progress.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  const [scope, animate] = useAnimate();
  // ── Sync external value → input, but only when the field is not focused.
  // Without this guard, typing "12" would snap back to "1" mid-keystroke
  // if the parent re-renders faster than the user types.
  useEffect(() => {
    if (!isFocusedRef.current) {
      setInputValue(value.toString());
    }
  }, [value]);
  // ── Shake animation with race-safe token ──────────────────────────────────
  const triggerShake = useCallback(() => {
    const token = ++shakeTokenRef.current;
    setIsError(true);
    animate(scope.current, {
      x: [0, -6, 6, -5, 5, -3, 0],
      transition: {
        duration: 0.38,
        ease: [0.36, 0.07, 0.19, 0.97]
      }
    }).then(() => {
      if (shakeTokenRef.current === token) setIsError(false);
    });
  }, [animate, scope]);
  // ── Core commit ───────────────────────────────────────────────────────────
  const handleCommit = useCallback(
    (raw: number) => {
      const rounded = roundToStep(raw, safeStep);
      if (rounded < min || rounded > max) {
        triggerShake();
        const clamped = clamp(rounded, min, max);
        valueRef.current = clamped;
        onChange(clamped);
        setInputValue(clamped.toString());
      } else {
        valueRef.current = rounded;
        onChange(rounded);
        setInputValue(rounded.toString());
      }
    },
    [min, max, safeStep, onChange, triggerShake]
  );
  // ── Input handlers ────────────────────────────────────────────────────────
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);
  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
  }, []);
  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      setInputValue(value.toString());
    } else {
      handleCommit(parsed);
    }
  }, [inputValue, value, handleCommit]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleCommit(value + safeStep);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleCommit(value - safeStep);
      }
    },
    [value, safeStep, handleCommit]
  );
  // ── Hold-to-repeat ────────────────────────────────────────────────────────
  const clearHold = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
  }, []);
  const startHold = useCallback(
    (direction: 1 | -1) => {
      // Fire once immediately, then begin auto-repeat after HOLD_DELAY.
      // Each step advances from valueRef.current (kept fresh by handleCommit),
      // so the value actually progresses on every tick.
      handleCommit(valueRef.current + direction * safeStep);
      holdTimerRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(() => {
          const next = valueRef.current + direction * safeStep;
          // Stop auto-repeat once we've hit a bound (avoids endless shake).
          if (next < min || next > max) {
            clearHold();
            return;
          }
          handleCommit(next);
        }, HOLD_INTERVAL);
      }, HOLD_DELAY);
    },
    [safeStep, min, max, handleCommit, clearHold]
  );
  // Clean up hold on unmount
  useEffect(() => clearHold, [clearHold]);
  // ── Progress bar ──────────────────────────────────────────────────────────
  const range = max - min;
  const percentage = range > 0 ? (value - min) / range * 100 : 0;
  // ── Labels ────────────────────────────────────────────────────────────────
  const decrementLabel = `Decrease by ${safeStep}`;
  const incrementLabel = `Increase by ${safeStep}`;
  return (
    <div className="flex items-center gap-2 w-full">
      {/* Shake wrapper — scoped to avoid animating the unit badge */}
      <motion.div
        ref={scope}
        className={cn(
          'flex-1 flex items-center h-7',
          'bg-[rgba(0,0,0,0.2)] rounded-[var(--r-sm)]',
          'border border-[var(--border-subtle)] relative overflow-hidden',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
          disabled && 'opacity-50 pointer-events-none'
        )}>
        
        {/* Progress fill */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute left-0 top-0 bottom-0 opacity-[0.18]',
            'transition-[width,background-color] duration-150 ease-out',
            isError ? 'bg-red-500' : 'bg-[var(--violet)]'
          )}
          style={{
            width: `${percentage}%`
          }} />
        

        {/* Decrement */}
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={disabled || value <= min}
          onPointerDown={() => startHold(-1)}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          className={cn(
            'w-7 h-full flex items-center justify-center z-10',
            'text-[var(--text-mid)] transition-colors duration-150',
            'hover:text-[var(--text-hi)] hover:bg-[rgba(255,255,255,0.05)]',
            'disabled:opacity-40 disabled:hover:bg-transparent',
            'select-none'
          )}>
          
          <span aria-hidden="true" className="text-[13px] leading-none">
            −
          </span>
        </button>

        {/* Separator */}
        <div
          aria-hidden="true"
          className="w-px h-3.5 bg-[var(--border-mid)] z-10 shrink-0" />
        

        {/* Input — role="spinbutton" activates full ARIA spinbutton semantics */}
        <input
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-label={`Value in ${unit}`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled}
          value={inputValue}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 min-w-[44px] w-full h-full z-10 px-1',
            'bg-transparent text-center outline-none',
            'text-[12px] font-mono text-[var(--text-hi)]',
            'transition-colors duration-150',
            isError && 'text-red-400'
          )} />
        

        {/* Separator */}
        <div
          aria-hidden="true"
          className="w-px h-3.5 bg-[var(--border-mid)] z-10 shrink-0" />
        

        {/* Increment */}
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={disabled || value >= max}
          onPointerDown={() => startHold(1)}
          onPointerUp={clearHold}
          onPointerLeave={clearHold}
          className={cn(
            'w-7 h-full flex items-center justify-center z-10',
            'text-[var(--text-mid)] transition-colors duration-150',
            'hover:text-[var(--text-hi)] hover:bg-[rgba(255,255,255,0.05)]',
            'disabled:opacity-40 disabled:hover:bg-transparent',
            'select-none'
          )}>
          
          <span aria-hidden="true" className="text-[13px] leading-none">
            +
          </span>
        </button>
      </motion.div>

      <UnitBadge unit={unit} />
    </div>);

}
// ─── UnitBadge ────────────────────────────────────────────────────────────────
// Exported so it can be reused independently (e.g. read-only value displays).
// Memoized so it never re-renders on Stepper value changes.
export const UnitBadge = memo(function UnitBadge({ unit }: {unit: string;}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex items-center justify-center h-6 px-1.5 shrink-0',
        'bg-[var(--bg-badge)] rounded-[var(--r-sm)]',
        'border border-[var(--border-subtle)]',
        'text-[10px] font-medium text-[var(--text-lo)]',
        'uppercase tracking-wider select-none'
      )}>
      
      {unit}
    </div>);

});