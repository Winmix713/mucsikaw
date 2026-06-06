import React, { useCallback, useRef } from 'react';
import { clsx } from 'clsx';
interface LightDirectionPadProps {
  /** Angle in degrees. 0 = right, positive clockwise. */
  angle: number;
  onChange: (angle: number) => void;
  size?: number;
  ariaLabel?: string;
  className?: string;
}
/**
 * Square pad with a draggable dot indicating light direction.
 * The dot sits on a circle; its position maps to `angle`.
 */
export function LightDirectionPad({
  angle,
  onChange,
  size = 56,
  ariaLabel = 'Light direction',
  className
}: LightDirectionPadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const setFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const deg = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
      onChange(deg);
    },
    [onChange]
  );
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
      setFromPoint(e.clientX, e.clientY);
    },
    [setFromPoint]
  );
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      setFromPoint(e.clientX, e.clientY);
    },
    [setFromPoint]
  );
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragging.current = false;
    },
    []
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const stepKey: Record<string, number> = {
        ArrowRight: 5,
        ArrowUp: -5,
        ArrowLeft: -5,
        ArrowDown: 5
      };
      if (e.key in stepKey) {
        e.preventDefault();
        onChange(angle + stepKey[e.key]);
      }
    },
    [angle, onChange]
  );
  const rad = angle * Math.PI / 180;
  // dot on a circle inset from edges
  const r = 0.34; // fraction of size
  const dotX = 50 + Math.cos(rad) * r * 100;
  const dotY = 50 + Math.sin(rad) * r * 100;
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuenow={angle}
      aria-valuemin={-180}
      aria-valuemax={180}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{
        width: size,
        height: size
      }}
      className={clsx(
        'relative shrink-0 cursor-pointer rounded-[var(--r-md,10px)]',
        'border border-[var(--border-subtle,rgba(255,255,255,0.12))]',
        'bg-[rgba(0,0,0,0.4)] outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
        className
      )}>
      
      <span
        aria-hidden="true"
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{
          left: `${dotX}%`,
          top: `${dotY}%`
        }} />
      
    </div>);

}