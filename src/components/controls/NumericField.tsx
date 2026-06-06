import React, { useCallback, useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';
import { BoxIcon } from 'lucide-react';
interface NumericFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Short leading label inside the box (e.g. "X", "Y") */
  prefix?: string;
  /** Leading glyph icon (e.g. Grid / Sun) */
  icon?: BoxIcon;
  /** Trailing unit suffix (e.g. "°", "%") */
  suffix?: string;
  ariaLabel: string;
  className?: string;
}
function clamp(v: number, min?: number, max?: number) {
  if (min != null) v = Math.max(min, v);
  if (max != null) v = Math.min(max, v);
  return v;
}
export function NumericField({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  icon: Icon,
  suffix,
  ariaLabel,
  className
}: NumericFieldProps) {
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);
  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);
  const commit = useCallback(
    (raw: string) => {
      const n = parseFloat(raw);
      if (Number.isNaN(n)) {
        setDraft(String(value));
        return;
      }
      const next = clamp(n, min, max);
      onChange(next);
      setDraft(String(next));
    },
    [onChange, value, min, max]
  );
  const bump = useCallback(
    (dir: 1 | -1) => {
      const next = clamp((parseFloat(draft) || 0) + dir * step, min, max);
      onChange(next);
      setDraft(String(next));
    },
    [draft, step, min, max, onChange]
  );
  return (
    <div
      className={clsx(
        'flex h-8 items-center gap-1.5 px-2.5',
        'rounded-[var(--r-md,10px)] border border-[var(--border-subtle,rgba(255,255,255,0.12))]',
        'bg-[rgba(0,0,0,0.35)]',
        'focus-within:border-[var(--accent)] transition-colors',
        className
      )}>
      
      {prefix &&
      <span className="shrink-0 text-[12px] font-medium text-[var(--text-lo,rgba(255,255,255,0.4))]">
          {prefix}
        </span>
      }
      {Icon &&
      <Icon
        size={13}
        className="shrink-0 text-[var(--text-lo,rgba(255,255,255,0.4))]"
        aria-hidden="true" />

      }
      <input
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={(e) => {
          focused.current = false;
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();else
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            bump(1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            bump(-1);
          }
        }}
        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-[var(--text-hi,rgba(255,255,255,0.92))] outline-none" />
      
      {suffix &&
      <span className="shrink-0 text-[12px] text-[var(--text-lo,rgba(255,255,255,0.4))]">
          {suffix}
        </span>
      }
    </div>);

}