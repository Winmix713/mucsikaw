import React, { useEffect, useMemo, useRef, forwardRef, memo } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Easing } from
'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
/* -------------------------------------------------------------------------- */
/*  Utilities                                                                  */
/* -------------------------------------------------------------------------- */
function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
/** Stable JSON for memoization. Sorts keys to avoid order-dependent misses. */
function stableStringify(value: unknown): string {
  if (value === undefined) return '';
  return JSON.stringify(value, (_k, v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v as Record<string, unknown>).
      sort().
      reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = (v as Record<string, unknown>)[key];
        return acc;
      }, {});
    }
    return v;
  });
}
/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */
type CharacterKind = 'digit' | 'separator' | 'sign' | 'symbol' | 'unit';
type Trend = 'up' | 'down' | 'flat';
interface CharacterSlotData {
  char: string;
  kind: CharacterKind;
  /** Stable, position-based key (from the right) so digits animate in place. */
  slotKey: string;
}
/* -------------------------------------------------------------------------- */
/*  Variants (cva)                                                             */
/* -------------------------------------------------------------------------- */
const badgeVariants = cva(
  cn(
    'relative inline-flex select-none items-center justify-end overflow-visible',
    'border isolate',
    'border-[color:var(--ab-border,rgba(255,255,255,0.08))]',
    'bg-[color:var(--ab-bg,rgba(15,23,42,0.72))]',
    'text-[color:var(--ab-fg,#f8fafc)]',
    'shadow-[var(--ab-shadow,inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24))]',
    'supports-[backdrop-filter]:backdrop-blur-md',
    'transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ab-ring,rgba(148,163,184,0.6))] focus-visible:ring-offset-0',
    'contrast-more:border-current contrast-more:bg-black contrast-more:text-white'
  ),
  {
    variants: {
      size: {
        sm: 'h-7 rounded-[10px] ps-2.5 pe-2.5 gap-1.5 text-[13px]',
        md: 'h-8 rounded-[12px] ps-3 pe-3 gap-2 text-[14px]',
        lg: 'h-10 rounded-[14px] ps-3.5 pe-3.5 gap-2.5 text-[15px]'
      },
      status: {
        idle: '[--ab-dot:rgba(255,255,255,0.45)] [--ab-glow:transparent]',
        info: '[--ab-dot:var(--ab-info,#3b82f6)] [--ab-glow:color-mix(in_oklab,var(--ab-info,#3b82f6)_55%,transparent)]',
        success:
        '[--ab-dot:var(--ab-success,#22c55e)] [--ab-glow:color-mix(in_oklab,var(--ab-success,#22c55e)_50%,transparent)]',
        warning:
        '[--ab-dot:var(--ab-warning,#f59e0b)] [--ab-glow:color-mix(in_oklab,var(--ab-warning,#f59e0b)_50%,transparent)]',
        danger:
        '[--ab-dot:var(--ab-danger,#ef4444)] [--ab-glow:color-mix(in_oklab,var(--ab-danger,#ef4444)_55%,transparent)]'
      },
      tone: {
        solid: '',
        soft: 'bg-[color:var(--ab-bg-soft,rgba(30,41,59,0.55))]',
        outline: 'bg-transparent'
      }
    },
    defaultVariants: {
      size: 'md',
      status: 'idle',
      tone: 'solid'
    }
  }
);
const dotVariants = cva(
  'shrink-0 rounded-full bg-[color:var(--ab-dot)] shadow-[0_0_0_0_var(--ab-glow)]',
  {
    variants: {
      size: {
        sm: 'size-1.5',
        md: 'size-2',
        lg: 'size-2.5'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);
const unitVariants = cva(
  'shrink-0 font-sans font-medium uppercase tracking-[0.14em] text-[color:var(--ab-fg-muted,rgba(255,255,255,0.68))]',
  {
    variants: {
      size: {
        sm: 'text-[10px]',
        md: 'text-[10px]',
        lg: 'text-[11px]'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);
const valueVariants = cva(
  'grid items-center justify-end font-mono tabular-nums leading-none tracking-[-0.02em]',
  {
    variants: {
      size: {
        sm: 'text-[13px]',
        md: 'text-[14px]',
        lg: 'text-[15px]'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);
/* -------------------------------------------------------------------------- */
/*  Easing & motion                                                            */
/* -------------------------------------------------------------------------- */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] satisfies Easing;
/* -------------------------------------------------------------------------- */
/*  Formatting                                                                 */
/* -------------------------------------------------------------------------- */
function mapPartType(type: Intl.NumberFormatPart['type']): CharacterKind {
  if (type === 'integer' || type === 'fraction') return 'digit';
  if (type === 'minusSign' || type === 'plusSign') return 'sign';
  if (type === 'group' || type === 'decimal' || type === 'literal')
  return 'separator';
  if (type === 'unit' || type === 'currency' || type === 'percentSign')
  return 'unit';
  return 'symbol';
}
/**
 * Build position-stable slot keys: indexed FROM THE RIGHT so a digit at the
 * ones place always shares the same key, enabling smooth in-place transitions
 * across value changes regardless of length.
 */
function buildCharacterSlots(
formatter: Intl.NumberFormat,
value: number)
: CharacterSlotData[] {
  const parts = formatter.formatToParts(value);
  const chars: Array<{
    char: string;
    kind: CharacterKind;
  }> = [];
  for (const part of parts) {
    const kind = mapPartType(part.type);
    for (const ch of part.value)
    chars.push({
      char: ch,
      kind
    });
  }
  const decimalIndex = chars.findIndex((c) => c.char === '.' || c.char === ',');
  return chars.map((c, i) => {
    // Key relative to decimal point (or end), kind-tagged to prevent collisions.
    const anchor = decimalIndex === -1 ? chars.length : decimalIndex;
    const offset = i - anchor;
    return {
      ...c,
      slotKey: `${c.kind}@${offset}`
    };
  });
}
/** Width template using widest tabular figure ("8") so layout never shifts. */
function buildWidthTemplate(
formatter: Intl.NumberFormat,
value: number,
maxDigits?: number)
: string {
  const formatted = formatter.format(value);
  if (!maxDigits || maxDigits <= 0) return formatted;
  const safe = Math.max(1, Math.min(maxDigits, 15));
  const parts = formatter.formatToParts(value);
  return parts.
  map((p) => {
    if (p.type === 'integer')
    return '8'.repeat(Math.max(safe, p.value.length));
    if (p.type === 'fraction') return '8'.repeat(p.value.length);
    return p.value;
  }).
  join('');
}
/* -------------------------------------------------------------------------- */
/*  Character slot                                                             */
/* -------------------------------------------------------------------------- */
interface CharacterSlotProps {
  char: string;
  kind: CharacterKind;
  direction: 1 | -1;
  reducedMotion: boolean;
}
const CharacterSlot = memo(function CharacterSlot({
  char,
  kind,
  direction,
  reducedMotion
}: CharacterSlotProps) {
  const widthClass =
  kind === 'digit' ?
  'min-w-[0.62ch]' :
  kind === 'sign' ?
  'min-w-[0.5ch]' :
  kind === 'separator' ?
  'min-w-[0.28ch]' :
  'min-w-[0.5ch]';
  const enterY = reducedMotion ? 0 : direction === 1 ? '28%' : '-28%';
  const exitY = reducedMotion ? 0 : direction === 1 ? '-28%' : '28%';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid h-[1em] place-items-center overflow-hidden',
        widthClass
      )}>
      
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={{
            y: enterY,
            opacity: 0,
            scale: reducedMotion ? 1 : 0.96
          }}
          animate={{
            y: '0%',
            opacity: 1,
            scale: 1
          }}
          exit={{
            y: exitY,
            opacity: 0,
            scale: reducedMotion ? 1 : 0.96
          }}
          transition={
          reducedMotion ?
          {
            duration: 0.12,
            ease: 'linear'
          } :
          {
            duration: 0.42,
            ease: EASE_OUT_EXPO
          }
          }
          className="col-start-1 row-start-1 will-change-transform">
          
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      </AnimatePresence>
    </span>);

});
/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */
type BadgeVariantProps = VariantProps<typeof badgeVariants>;
export interface AnimatedBadgeProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  BadgeVariantProps {
  /** Numeric value to display. Non-finite values fall back to 0 with a dev warning. */
  value: number;
  /** Optional unit label (e.g. "ms", "%", "USD"). Ignored when `formatOptions.style` already renders a unit. */
  unit?: string;
  /** BCP-47 locale or list. Defaults to runtime locale. */
  locale?: string | string[];
  /** Forwarded to `Intl.NumberFormat`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Pulsing halo on the status dot. Disabled under reduced motion. */
  pulse?: boolean;
  /** Reserve width for this many integer digits (anti-jump). 1–15. */
  maxDigits?: number;
  /** Show a small ▲/▼ trend indicator next to the value. */
  showTrend?: boolean;
  /** Loading skeleton state. */
  isLoading?: boolean;
  /** Accessible label. Defaults to "<formattedValue> <unit>". */
  ariaLabel?: string;
}
/**
 * AnimatedBadge — premium animated numeric badge.
 *
 * @example
 * <AnimatedBadge value={1234.56} unit="ms" status="success" pulse showTrend />
 */
export const AnimatedBadge = forwardRef<HTMLDivElement, AnimatedBadgeProps>(
  function AnimatedBadge(
  {
    value,
    unit,
    status,
    size,
    tone,
    locale,
    formatOptions,
    pulse = false,
    maxDigits,
    showTrend = false,
    isLoading = false,
    ariaLabel,
    className,
    ...rest
  },
  ref)
  {
    const prefersReducedMotion = useReducedMotion();
    const reducedMotion = Boolean(prefersReducedMotion);
    // Validate value with a single dev-only warning per bad value.
    const safeValue = useMemo(() => {
      if (Number.isFinite(value)) return value;
      // Vite/browser-safe dev guard — avoids `process is not defined` ReferenceError.
      const isDev =
      typeof import.meta !== 'undefined' && (import.meta as any).env ?
      Boolean((import.meta as any).env.DEV) :
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV !== 'production';
      if (isDev) {
        // eslint-disable-next-line no-console
        console.warn(
          `[AnimatedBadge] non-finite value received: ${String(value)} — using 0`
        );
      }
      return 0;
    }, [value]);
    const previousValue = usePrevious(safeValue);
    const trend: Trend =
    previousValue === undefined || previousValue === safeValue ?
    'flat' :
    safeValue > previousValue ?
    'up' :
    'down';
    const direction: 1 | -1 = trend === 'down' ? -1 : 1;
    const localeKey = Array.isArray(locale) ? locale.join('|') : locale ?? '';
    const optionsKey = useMemo(
      () => stableStringify(formatOptions),
      [formatOptions]
    );
    const formatter = useMemo(
      () => new Intl.NumberFormat(locale, formatOptions),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [localeKey, optionsKey]
    );
    const formattedValue = useMemo(
      () => formatter.format(safeValue),
      [formatter, safeValue]
    );
    const slots = useMemo(
      () => buildCharacterSlots(formatter, safeValue),
      [formatter, safeValue]
    );
    const widthTemplate = useMemo(
      () => buildWidthTemplate(formatter, safeValue, maxDigits),
      [formatter, safeValue, maxDigits]
    );
    const label = ariaLabel ?? [formattedValue, unit].filter(Boolean).join(' ');
    const trendGlyph = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•';
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={label}
        aria-busy={isLoading || undefined}
        data-status={status ?? 'idle'}
        data-trend={trend}
        dir="auto"
        className={cn(
          badgeVariants({
            size,
            status,
            tone
          }),
          className
        )}
        {...rest}>
        
        {/* Top sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent)]" />
        

        {/* Status dot + halo */}
        <span className="relative me-auto inline-flex items-center justify-center">
          {pulse && !reducedMotion && status && status !== 'idle' ?
          <motion.span
            aria-hidden="true"
            className={cn(
              dotVariants({
                size
              }),
              'absolute inset-0 bg-[color:var(--ab-dot)]'
            )}
            initial={{
              scale: 1,
              opacity: 0.55
            }}
            animate={{
              scale: 2.2,
              opacity: 0
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeOut'
            }} /> :

          null}
          <span
            aria-hidden="true"
            className={cn(
              dotVariants({
                size
              })
            )} />
          
        </span>

        {/* Loading skeleton */}
        {isLoading ?
        <span
          aria-hidden="true"
          className={cn(
            'relative z-10 inline-block h-[0.9em] w-[3.5ch] overflow-hidden rounded-md',
            'bg-[color:var(--ab-skeleton,rgba(255,255,255,0.12))]'
          )}>
          
            {!reducedMotion ?
          <motion.span
            className="absolute inset-y-0 -left-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
            animate={{
              x: ['0%', '300%']
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'linear'
            }} /> :

          null}
          </span> :

        <>
            {/* Trend glyph */}
            {showTrend ?
          <AnimatePresence initial={false} mode="popLayout">
                <motion.span
              key={trend}
              aria-hidden="true"
              initial={
              reducedMotion ?
              {
                opacity: 0
              } :
              {
                opacity: 0,
                y: direction === 1 ? 6 : -6
              }
              }
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={
              reducedMotion ?
              {
                opacity: 0
              } :
              {
                opacity: 0,
                y: direction === 1 ? -6 : 6
              }
              }
              transition={{
                duration: 0.28,
                ease: EASE_OUT_EXPO
              }}
              className={cn(
                'relative z-10 text-[0.72em] leading-none',
                trend === 'up' && 'text-[color:var(--ab-success,#22c55e)]',
                trend === 'down' && 'text-[color:var(--ab-danger,#ef4444)]',
                trend === 'flat' &&
                'text-[color:var(--ab-fg-muted,rgba(255,255,255,0.55))]'
              )}>
              
                  {trendGlyph}
                </motion.span>
              </AnimatePresence> :
          null}

            {/* Animated value */}
            <span
            aria-hidden="true"
            className={cn(
              valueVariants({
                size
              })
            )}>
            
              {/* Width reservation (invisible, widest figure) */}
              <span className="invisible col-start-1 row-start-1 whitespace-pre">
                {widthTemplate}
              </span>
              <span className="col-start-1 row-start-1 flex items-center justify-end">
                {slots.map((slot) =>
              <CharacterSlot
                key={slot.slotKey}
                char={slot.char}
                kind={slot.kind}
                direction={direction}
                reducedMotion={reducedMotion} />

              )}
              </span>
            </span>

            {/* Unit */}
            {unit ?
          <span
            aria-hidden="true"
            className={cn(
              unitVariants({
                size
              })
            )}>
            
                {unit}
              </span> :
          null}
          </>
        }

        {/* SR-only canonical text (keeps live region accurate even with aria-hidden visual layer) */}
        <span className="sr-only">{label}</span>
      </div>);

  }
);
AnimatedBadge.displayName = 'AnimatedBadge';
export default AnimatedBadge;