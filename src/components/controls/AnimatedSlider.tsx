import {
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { cn } from '../../lib/utils';
import { AnimatedBadge } from './AnimatedBadge';
// ─── Types ────────────────────────────────────────────────────────────────────
export type SliderVariant =
'accent' |
'amber' |
'success' |
'warning' |
'danger' |
'purple' |
'pink';
export type DotColor = 'pulse' | 'mid' | 'full';
export interface AnimatedSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  variant?: SliderVariant;
  dotColor?: DotColor;
  showTicks?: boolean;
  tickCount?: number;
  showTooltip?: boolean;
  label?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
// ─── Variant config (single source of truth) ─────────────────────────────────
const VARIANT_CONFIG: Record<
  SliderVariant,
  {
    fill: string;
    focus: string;
    dot: string;
    glow: string;
  }> =
{
  accent: {
    fill: 'bg-[var(--accent)]',
    focus: 'focus-visible:ring-[var(--accent)]',
    dot: 'bg-[var(--accent)]',
    glow: 'shadow-[0_0_8px_var(--accent)]'
  },
  amber: {
    fill: 'bg-[var(--amber)]',
    focus: 'focus-visible:ring-[var(--amber)]',
    dot: 'bg-[var(--amber)]',
    glow: 'shadow-[0_0_8px_var(--amber)]'
  },
  success: {
    fill: 'bg-emerald-500',
    focus: 'focus-visible:ring-emerald-500',
    dot: 'bg-emerald-500',
    glow: 'shadow-[0_0_8px_#10b981]'
  },
  warning: {
    fill: 'bg-yellow-500',
    focus: 'focus-visible:ring-yellow-500',
    dot: 'bg-yellow-500',
    glow: 'shadow-[0_0_8px_#eab308]'
  },
  danger: {
    fill: 'bg-red-500',
    focus: 'focus-visible:ring-red-500',
    dot: 'bg-red-500',
    glow: 'shadow-[0_0_8px_#ef4444]'
  },
  purple: {
    fill: 'bg-violet-500',
    focus: 'focus-visible:ring-violet-500',
    dot: 'bg-violet-500',
    glow: 'shadow-[0_0_8px_#8b5cf6]'
  },
  pink: {
    fill: 'bg-pink-500',
    focus: 'focus-visible:ring-pink-500',
    dot: 'bg-pink-500',
    glow: 'shadow-[0_0_8px_#ec4899]'
  }
};
// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function safePercentage(value: number, min: number, max: number): number {
  const range = Math.max(1, max - min);
  return clamp((value - min) / range * 100, 0, 100);
}
function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}
// ─── SliderTrack ──────────────────────────────────────────────────────────────
// Invisible oversized hit area wraps the visible track for a larger touch target.
interface SliderTrackProps {
  children: React.ReactNode;
  trackRef: React.RefObject<HTMLDivElement>;
  disabled: boolean;
}
const SliderTrack = memo(function SliderTrack({
  children,
  trackRef,
  disabled
}: SliderTrackProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex items-center',
        'py-3',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}>
      
      <div
        ref={trackRef}
        role="presentation"
        className={cn(
          'relative w-full h-[3px] rounded-full',
          'bg-[rgba(255,255,255,0.08)]',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
          'group-hover:bg-[rgba(255,255,255,0.11)]',
          'transition-colors duration-200',
          disabled ? 'opacity-50' : ''
        )}>
        
        {children}
      </div>
    </div>);

});
// ─── SliderFill ───────────────────────────────────────────────────────────────
interface SliderFillProps {
  percentage: number;
  variant: SliderVariant;
  disabled: boolean;
}
const SliderFill = memo(function SliderFill({
  percentage,
  variant,
  disabled
}: SliderFillProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute left-0 top-0 bottom-0 rounded-full',
        VARIANT_CONFIG[variant].fill,
        'will-change-[width]',
        'transition-[width] duration-[60ms] ease-out',
        disabled ? 'opacity-40' : 'opacity-100'
      )}
      style={{
        width: `${percentage}%`
      }} />);


});
// ─── SliderThumb ──────────────────────────────────────────────────────────────
interface SliderThumbProps {
  percentage: number;
  isDragging: boolean;
  isFocused: boolean;
  variant: SliderVariant;
  disabled: boolean;
}
const SliderThumb = memo(function SliderThumb({
  percentage,
  isDragging,
  isFocused,
  variant,
  disabled
}: SliderThumbProps) {
  const active = isDragging || isFocused;
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute top-1/2 pointer-events-none',
        'w-[14px] h-[14px] rounded-full',
        'bg-white',
        'border border-[rgba(255,255,255,0.18)]',
        'transition-[transform,box-shadow] duration-[80ms]',
        'will-change-transform',
        active && !disabled ? VARIANT_CONFIG[variant].glow : '',
        disabled ? 'opacity-40' : ''
      )}
      style={{
        left: `${percentage}%`,
        transform: `translate(-50%, -50%) scale(${isDragging ? 1.25 : isFocused ? 1.1 : 1})`,
        transitionTimingFunction: isDragging ?
        'cubic-bezier(0.34, 1.56, 0.64, 1)' :
        'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow:
        active && !disabled ?
        undefined :
        '0 1px 3px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.12)'
      }} />);


});
// ─── SliderTooltip ────────────────────────────────────────────────────────────
interface SliderTooltipProps {
  value: number;
  unit: string;
  percentage: number;
  visible: boolean;
}
const SliderTooltip = memo(function SliderTooltip({
  value,
  unit,
  percentage,
  visible
}: SliderTooltipProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute pointer-events-none z-10',
        '-top-9',
        'flex items-center justify-center',
        'min-w-[38px] px-2 py-[3px] rounded-md',
        'bg-[rgba(30,30,30,0.85)] backdrop-blur-md',
        'text-[10px] font-medium text-white/90 tabular-nums',
        'border border-[rgba(255,255,255,0.08)]',
        'transition-[opacity,transform] duration-150',
        visible ?
        'opacity-100 translate-y-0' :
        'opacity-0 translate-y-1 pointer-events-none'
      )}
      style={{
        left: `${percentage}%`,
        transform: `translateX(-50%) translateY(${visible ? '0' : '4px'})`
      }}>
      
      {value}
      {unit}
    </div>);

});
// ─── SliderTicks ──────────────────────────────────────────────────────────────
interface SliderTicksProps {
  tickCount: number;
  min: number;
  max: number;
  unit: string;
}
const SliderTicks = memo(function SliderTicks({
  tickCount,
  min,
  max,
  unit
}: SliderTicksProps) {
  const ticks = useMemo(() => {
    const count = Math.max(2, tickCount);
    return Array.from(
      {
        length: count
      },
      (_, i) => {
        const pct = i / (count - 1) * 100;
        const val = Math.round(min + i / (count - 1) * (max - min));
        return {
          pct,
          val
        };
      }
    );
  }, [tickCount, min, max]);
  return (
    <div
      aria-hidden="true"
      className="relative w-full select-none pointer-events-none"
      style={{
        height: '20px'
      }}>
      
      {ticks.map(({ pct, val }) =>
      <div
        key={pct}
        className="absolute flex flex-col items-center gap-px"
        style={{
          left: `${pct}%`,
          transform: 'translateX(-50%)',
          top: 0
        }}>
        
          <div className="w-px h-[5px] bg-[rgba(255,255,255,0.12)]" />
          <span className="text-[8px] leading-none text-[var(--text-lo)] font-medium tabular-nums">
            {val}
            {unit}
          </span>
        </div>
      )}
    </div>);

});
// ─── MinMaxLabels ─────────────────────────────────────────────────────────────
interface MinMaxLabelsProps {
  min: number;
  max: number;
  unit: string;
}
const MinMaxLabels = memo(function MinMaxLabels({
  min,
  max,
  unit
}: MinMaxLabelsProps) {
  return (
    <div
      aria-hidden="true"
      className="flex justify-between mt-0.5 text-[8px] text-[var(--text-lo)] font-medium select-none pointer-events-none tabular-nums">
      
      <span>
        {min}
        {unit}
      </span>
      <span>
        {max}
        {unit}
      </span>
    </div>);

});
// ─── Value badge ──────────────────────────────────────────────────────────────
// Each slider variant maps to a CSS color used to tint the standalone
// AnimatedBadge's status dot — keeping the readout color-coordinated with the
// fill without duplicating any badge logic.
const VARIANT_BADGE_COLOR: Record<SliderVariant, string> = {
  accent: 'var(--accent)',
  amber: 'var(--amber, #f59e0b)',
  success: '#10b981',
  warning: '#eab308',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899'
};
// Thin adapter: maps the slider's value/unit/variant/dotColor to the shared
// AnimatedBadge component (status/tone/size + CSS-var driven colors).
const SliderBadge = memo(function SliderBadge({
  value,
  unit,
  dotColor,
  variant





}: {value: number;unit: string;dotColor: DotColor;variant: SliderVariant;}) {
  return (
    <div
      className="flex shrink-0 justify-end"
      style={{
        minWidth: '58px'
      }}>
      
      <AnimatedBadge
        value={value}
        unit={unit || undefined}
        size="sm"
        tone="soft"
        status="info"
        pulse={dotColor === 'pulse'}
        style={
        {
          ['--ab-info' as string]: VARIANT_BADGE_COLOR[variant]
        } as React.CSSProperties
        } />
      
    </div>);

});
// ─── AnimatedSlider (main) ────────────────────────────────────────────────────
export const AnimatedSlider = memo(function AnimatedSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  unit = 'px',
  variant = 'accent',
  dotColor = 'mid',
  showTicks = false,
  tickCount = 5,
  showTooltip = true,
  label,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby
}: AnimatedSliderProps) {
  const uid = useId();
  const labelId = `slider-label-${uid}`;
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRootRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const percentage = useMemo(
    () => safePercentage(value, min, max),
    [value, min, max]
  );
  // ── Value from pointer position ───────────────────────────────────────────
  const calcValue = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + pos * Math.max(1, max - min);
      return clamp(roundToStep(raw, step), min, max);
    },
    [min, max, step, value]
  );
  // ── Pointer capture drag ──────────────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      onChange(calcValue(e.clientX));
    },
    [disabled, calcValue, onChange]
  );
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      onChange(calcValue(e.clientX));
    },
    [isDragging, disabled, calcValue, onChange]
  );
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      setIsDragging(false);
    },
    []
  );
  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const range = Math.max(1, max - min);
      const largeStep = Math.max(step, Math.round(range / 10));
      const delta: Record<string, number> = {
        ArrowRight: step,
        ArrowUp: step,
        ArrowLeft: -step,
        ArrowDown: -step,
        PageUp: largeStep,
        PageDown: -largeStep,
        Home: min - value,
        End: max - value
      };
      if (!(e.key in delta)) return;
      e.preventDefault();
      const next = clamp(roundToStep(value + delta[e.key], step), min, max);
      if (next !== value) onChange(next);
    },
    [disabled, min, max, step, value, onChange]
  );
  // ── ARIA resolution ───────────────────────────────────────────────────────
  const resolvedAriaLabel =
  ariaLabel ?? (label ? undefined : `Slider ${min}–${max} ${unit}`);
  const resolvedAriaLabelledby = ariaLabelledby ?? (label ? labelId : undefined);
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* ── Label row ─────────────────────────────────────────────────── */}
      {label &&
      <label
        id={labelId}
        className="text-[11px] font-medium text-[var(--text-lo)] select-none mb-0.5">
        
          {label}
        </label>
      }

      <div className="flex items-center gap-3 w-full group">
        {/* ── Slider root — holds ARIA, keyboard, pointer capture ────── */}
        <div
          ref={sliderRootRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedAriaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled}
          aria-orientation="horizontal"
          className={cn(
            'flex-1 flex flex-col justify-center relative outline-none rounded-sm',
            'focus-visible:ring-2 focus-visible:ring-offset-2',
            VARIANT_CONFIG[variant].focus,
            'focus-visible:ring-offset-[var(--bg-base,#000)]',
            disabled ? 'pointer-events-none' : ''
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}>
          
          {/* Track + fill + thumb + tooltip */}
          <SliderTrack trackRef={trackRef} disabled={disabled}>
            <SliderFill
              percentage={percentage}
              variant={variant}
              disabled={disabled} />
            
            <SliderThumb
              percentage={percentage}
              isDragging={isDragging}
              isFocused={isFocused}
              variant={variant}
              disabled={disabled} />
            
            {showTooltip &&
            <SliderTooltip
              value={value}
              unit={unit}
              percentage={percentage}
              visible={isDragging || isFocused} />

            }
          </SliderTrack>

          {/* Tick labels or min/max labels */}
          {showTicks ?
          <SliderTicks
            tickCount={tickCount}
            min={min}
            max={max}
            unit={unit} /> :


          <MinMaxLabels min={min} max={max} unit={unit} />
          }
        </div>

        {/* ── Value badge ───────────────────────────────────────────────── */}
        <SliderBadge
          value={value}
          unit={unit}
          dotColor={dotColor}
          variant={variant} />
        
      </div>
    </div>);

});
export default AnimatedSlider;