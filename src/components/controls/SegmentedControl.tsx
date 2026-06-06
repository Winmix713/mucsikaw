import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}
interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel = 'Options',
  className
}: SegmentedControlProps<T>) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = options.findIndex((o) => o.value === value);
      if (idx === -1) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        onChange(options[(idx + 1) % options.length].value);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onChange(options[(idx - 1 + options.length) % options.length].value);
      }
    },
    [options, value, onChange]
  );
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={clsx(
        'flex w-full items-center gap-1 p-0.5',
        'rounded-[var(--r-md,10px)] border border-[var(--border-subtle,rgba(255,255,255,0.08))]',
        'bg-[rgba(0,0,0,0.25)]',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
        className
      )}>
      
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'relative flex-1 h-7 rounded-[var(--r-sm,7px)] text-[12px] font-medium',
              'transition-colors duration-200 outline-none',
              'focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
              active ?
              'text-[var(--text-hi,#fff)]' :
              'text-[var(--text-lo,rgba(255,255,255,0.4))] hover:text-[var(--text-mid,rgba(255,255,255,0.6))]'
            )}>
            
            {active &&
            <motion.span
              layoutId={`seg-${ariaLabel}`}
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 38
              }}
              className="absolute inset-0 rounded-[var(--r-sm,7px)] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.06)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              aria-hidden="true" />

            }
            <span className="relative">{opt.label}</span>
          </button>);

      })}
    </div>);

}