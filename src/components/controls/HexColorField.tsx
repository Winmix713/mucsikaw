import { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
interface HexColorFieldProps {
  color: string;
  opacity: number;
  onColorChange: (hex: string) => void;
  onOpacityChange: (opacity: number) => void;
  label?: string;
  className?: string;
}
function normalizeHex(raw: string): string | null {
  const h = raw.replace('#', '').trim();
  if (/^[0-9a-fA-F]{6}$/.test(h)) return `#${h.toLowerCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(h))
  return `#${h.
  split('').
  map((c) => c + c).
  join('').
  toLowerCase()}`;
  return null;
}
export function HexColorField({
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  label = 'Color',
  className
}: HexColorFieldProps) {
  const [hexDraft, setHexDraft] = useState(color.replace('#', ''));
  const [opDraft, setOpDraft] = useState(String(opacity));
  const hexFocused = useRef(false);
  const opFocused = useRef(false);
  useEffect(() => {
    if (!hexFocused.current) setHexDraft(color.replace('#', ''));
  }, [color]);
  useEffect(() => {
    if (!opFocused.current) setOpDraft(String(opacity));
  }, [opacity]);
  const commitHex = useCallback(
    (raw: string) => {
      const n = normalizeHex(raw);
      if (n) {
        onColorChange(n);
        setHexDraft(n.replace('#', ''));
      } else {
        setHexDraft(color.replace('#', ''));
      }
    },
    [onColorChange, color]
  );
  const commitOpacity = useCallback(
    (raw: string) => {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) {
        const clamped = Math.max(0, Math.min(100, n));
        onOpacityChange(clamped);
        setOpDraft(String(clamped));
      } else {
        setOpDraft(String(opacity));
      }
    },
    [onOpacityChange, opacity]
  );
  return (
    <div className={clsx('flex items-center gap-1.5', className)}>
      {/* swatch + hex */}
      <div className="flex h-8 flex-1 items-center gap-2 rounded-[var(--r-md,10px)] border border-[var(--border-subtle,rgba(255,255,255,0.12))] bg-[rgba(0,0,0,0.35)] px-2">
        <label className="relative h-4 w-4 shrink-0 cursor-pointer overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.2)]">
          <span
            className="absolute inset-0"
            style={{
              background: color
            }}
            aria-hidden="true" />
          
          <input
            type="color"
            value={color}
            aria-label={`${label} swatch`}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0" />
          
        </label>
        <input
          type="text"
          aria-label={`${label} hex`}
          value={hexDraft}
          onFocus={() => {
            hexFocused.current = true;
          }}
          onBlur={(e) => {
            hexFocused.current = false;
            commitHex(e.target.value);
          }}
          onChange={(e) => setHexDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[12px] uppercase text-[var(--text-hi,rgba(255,255,255,0.92))] outline-none" />
        
      </div>
      {/* opacity */}
      <div className="flex h-8 w-[64px] items-center gap-1 rounded-[var(--r-md,10px)] border border-[var(--border-subtle,rgba(255,255,255,0.12))] bg-[rgba(0,0,0,0.35)] px-2">
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} opacity`}
          value={opDraft}
          onFocus={() => {
            opFocused.current = true;
          }}
          onBlur={(e) => {
            opFocused.current = false;
            commitOpacity(e.target.value);
          }}
          onChange={(e) => setOpDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-[var(--text-hi,rgba(255,255,255,0.92))] outline-none" />
        
        <span className="shrink-0 text-[12px] text-[var(--text-lo,rgba(255,255,255,0.4))]">
          %
        </span>
      </div>
    </div>);

}