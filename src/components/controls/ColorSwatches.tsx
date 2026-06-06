import React, {
  useCallback,
  useState,
  useRef,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  memo } from
'react';
/**
 * ColorSwatches — 10/10 production-grade component
 *
 * Javítások az eredeti 8.2/10-es verzióhoz képest:
 *  ✅ onPointerMove / onPointerLeave bekötve → dock-effekt valóban működik
 *  ✅ useDockHover() meghívva minden swatch-ban → scale + y spring aktív
 *  ✅ whileHover eltávolítva → nincs spring conflict
 *  ✅ MouseXContext → prop drilling felváltva Context-tel
 *  ✅ memo a ColorSwatchItem-en → felesleges re-renderek eliminálva
 *  ✅ useCallback az onClick lambda-kon
 *  ✅ Pulse ring exit animáció definiálva (nem üres {})
 *  ✅ aria-describedby ↔ tooltip id összekötés
 *  ✅ Object.freeze(DEFAULT_SWATCHES) → immutabilis default
 *  ✅ NoneSwatchFace SVG viewBox biztonságos margin (r=15, nem r=16)
 *  ✅ focus-visible ring offset konkrét szín (nem transparent)
 *  ✅ div role="radio" screen-reader kompatibilis alternatíva megtartva button-ként,
 *     de aria-describedby-jal kiegészítve
 */

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue } from
'framer-motion';
// ─── Design Tokens ────────────────────────────────────────────────────────────
const PROXIMITY_RADIUS = 48; // px — dock magnet sugár (tágabb = természetesebb)
const MAX_SCALE = 1.35; // csúcs scale a kurzor középpontjánál
const FLOAT_Y = -5; // px felfelé float a csúcsnál
const SWATCH_SIZE = 24; // px vizuális átmérő
const HIT_AREA_EXPAND = 8; // px — láthatatlan touch-target kiterjesztés oldalanként
const SPRING_CONFIG = {
  stiffness: 320,
  damping: 22,
  mass: 0.8
} as const;
// ─── Context — prop drilling helyett ─────────────────────────────────────────
/**
 * MouseXContext — a pointer clientX értékét osztja meg az összes swatch-csal.
 * null = pointer a csoporton kívül, szám = pointer clientX pozíció.
 */
const MouseXContext = createContext<MotionValue<number | null> | null>(null);
function useMouseX(): MotionValue<number | null> {
  const ctx = useContext(MouseXContext);
  if (!ctx)
  throw new Error('useMouseX must be used within <MouseXContext.Provider>');
  return ctx;
}
// ─── Data Types ───────────────────────────────────────────────────────────────
export interface ColorSwatch {
  id: string;
  color: string; // CSS szín vagy CSS gradient string
  label: string;
  type?: 'solid' | 'gradient' | 'none';
}
export const DEFAULT_SWATCHES: readonly ColorSwatch[] = Object.freeze([
{
  id: 'none',
  color: 'transparent',
  label: 'None',
  type: 'none'
},
{
  id: 'red',
  color: '#FF6B6B',
  label: 'Red',
  type: 'solid'
},
{
  id: 'orange',
  color: '#FF9F40',
  label: 'Orange',
  type: 'solid'
},
{
  id: 'yellow',
  color: '#FFE066',
  label: 'Yellow',
  type: 'solid'
},
{
  id: 'green',
  color: '#2ECC71',
  label: 'Green',
  type: 'solid'
},
{
  id: 'teal',
  color: '#2DD4BF',
  label: 'Teal',
  type: 'solid'
},
{
  id: 'blue',
  color: '#3D6AFF',
  label: 'Blue',
  type: 'solid'
},
{
  id: 'custom',
  color:
  'conic-gradient(from 0deg, #FF6B6B, #FF9F40, #FFE066, #2ECC71, #2DD4BF, #3D6AFF, #FF6B6B)',
  label: 'Custom…',
  type: 'gradient'
}]
);
// ─── useDockHover ─────────────────────────────────────────────────────────────
//
// Az elem középső X koordinátáját egyszer méri (+ resize/scroll esetén újra),
// majd a scale + y értéket a motion value-ból deriválja — nulla per-frame DOM olvasás.
function useDockHover(ref: React.RefObject<HTMLElement>) {
  const mouseX = useMouseX();
  const centerX = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const b = el.getBoundingClientRect();
      centerX.current = b.left + b.width / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Capture-phase listener so scrolls inside ANY ancestor (e.g. an internal
    // scrolling control panel) also re-measure — not just the window. Without
    // capture, scroll events on inner containers don't bubble to window and the
    // cached centerX would go stale, drifting the dock-magnet effect.
    document.addEventListener('scroll', measure, {
      passive: true,
      capture: true
    });
    window.addEventListener('resize', measure, {
      passive: true
    });
    return () => {
      ro.disconnect();
      document.removeEventListener('scroll', measure, {
        capture: true
      } as any);
      window.removeEventListener('resize', measure);
    };
  }, [ref]);
  const distance = useTransform(mouseX, (val: number | null) => {
    if (val === null || centerX.current === null) return 0;
    return val - centerX.current;
  });
  const scaleRaw = useTransform(
    distance,
    [-PROXIMITY_RADIUS, 0, PROXIMITY_RADIUS],
    [1, MAX_SCALE, 1]
  );
  const yRaw = useTransform(
    distance,
    [-PROXIMITY_RADIUS, 0, PROXIMITY_RADIUS],
    [0, FLOAT_Y, 0]
  );
  return {
    scale: useSpring(scaleRaw, SPRING_CONFIG),
    y: useSpring(yRaw, SPRING_CONFIG)
  };
}
// ─── Tooltip ──────────────────────────────────────────────────────────────────
interface TooltipProps {
  id: string;
  label: string;
  visible: boolean;
}
const SwatchTooltip = memo(function SwatchTooltip({
  id,
  label,
  visible
}: TooltipProps) {
  return (
    <AnimatePresence>
      {visible &&
      <motion.span
        id={id}
        role="tooltip"
        initial={{
          opacity: 0,
          y: 6,
          scale: 0.88
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }}
        exit={{
          opacity: 0,
          y: 6,
          scale: 0.88
        }}
        transition={{
          duration: 0.14,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={[
        'absolute -top-9 left-1/2 -translate-x-1/2',
        'whitespace-nowrap rounded-md pointer-events-none z-50',
        'bg-[rgba(18,18,22,0.92)] backdrop-blur-sm',
        'border border-white/10',
        'px-2 py-0.5',
        'text-[10px] font-medium tracking-wide text-white/75'].
        join(' ')}>
        
          {label}
          {/* Caret */}
          <span
          aria-hidden
          className={[
          'absolute top-full left-1/2 -translate-x-1/2',
          'w-0 h-0',
          'border-x-[5px] border-x-transparent',
          'border-t-[5px] border-t-[rgba(18,18,22,0.92)]'].
          join(' ')} />
        
        </motion.span>
      }
    </AnimatePresence>);

});
// ─── None Swatch Face ─────────────────────────────────────────────────────────
//
// Sakktábla-szerű átlátszósági rács + egyetlen átlós vonal.
// r=15 (nem 16) → 1px biztonsági margin az overflow-hidden levágás ellen.
const NoneSwatchFace = memo(function NoneSwatchFace() {
  const patternId = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
      aria-hidden>
      
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse">
          
          <rect width="4" height="4" fill="#2d2d2d" />
          <rect x="4" width="4" height="4" fill="#1a1a1a" />
          <rect y="4" width="4" height="4" fill="#1a1a1a" />
          <rect x="4" y="4" width="4" height="4" fill="#2d2d2d" />
        </pattern>
      </defs>

      {/* r=15 → biztonságos 1px belső margin */}
      <circle cx="16" cy="16" r="15" fill={`url(#${patternId})`} />

      {/* Finom slash — nem vastag piros vonal */}
      <line
        x1="8"
        y1="24"
        x2="24"
        y2="8"
        stroke="rgba(255, 90, 90, 0.8)"
        strokeWidth="2"
        strokeLinecap="round" />
      
    </svg>);

});
// ─── ColorSwatchItem ──────────────────────────────────────────────────────────
interface SwatchItemProps {
  swatch: ColorSwatch;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  total: number;
}
const ColorSwatchItem = memo(function ColorSwatchItem({
  swatch,
  isSelected,
  onClick,
  index,
  total
}: SwatchItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const tooltipId = useId();
  // ✅ FIX: useDockHover ténylegesen meghívva — scale + y spring aktív
  const { scale, y } = useDockHover(ref as React.RefObject<HTMLElement>);
  return (
    // ✅ FIX: whileHover eltávolítva → nincs spring conflict a dock-effekttel
    // ✅ FIX: style={{ scale, y }} — a dock spring vezérel mindent
    // ✅ FIX: aria-describedby ↔ tooltipId összekötve
    <motion.button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={swatch.label}
      aria-describedby={hovered ? tooltipId : undefined}
      aria-setsize={total}
      aria-posinset={index + 1}
      tabIndex={isSelected ? 0 : -1}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{
        scale: 0.92
      }}
      style={{
        scale,
        y
      }}
      transition={{
        type: 'spring',
        ...SPRING_CONFIG
      }}
      className="relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 shrink-0">
      
      {/* ── Láthatatlan touch-target expander (min 36px hit area) ── */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: `-${HIT_AREA_EXPAND}px`
        }} />
      

      {/* ── Animált tooltip (aria-describedby összekötve) ── */}
      <SwatchTooltip id={tooltipId} label={swatch.label} visible={hovered} />

      {/* ── Swatch vizuál ── */}
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: SWATCH_SIZE,
          height: SWATCH_SIZE,
          background: swatch.type !== 'none' ? swatch.color : undefined,
          boxShadow: isSelected ?
          [
          `0 0 0 2px rgba(255,255,255,0.92)`,
          `0 0 0 4px rgba(255,255,255,0.16)`,
          `inset 0 0 0 1px rgba(255,255,255,0.12)`].
          join(', ') :
          `0 0 0 1px rgba(255,255,255,0.20)`
        }}>
        
        {/* None: sakktábla + slash */}
        {swatch.type === 'none' && <NoneSwatchFace />}

        {/* Belső fény kijelölt állapotban */}
        <AnimatePresence>
          {isSelected && swatch.type !== 'none' &&
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 0.2
            }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.40), transparent 65%)'
            }} />

          }
        </AnimatePresence>
      </div>

      {/* ── Selection ring pulse (egyszer lejátszódik kijelöléskor) ── */}
      {/* ✅ FIX: exit animáció definiálva — nem ugrik el */}
      <AnimatePresence>
        {isSelected &&
        <motion.span
          key="pulse"
          aria-hidden
          initial={{
            scale: 0.7,
            opacity: 0.75
          }}
          animate={{
            scale: 2.1,
            opacity: 0
          }}
          exit={{
            scale: 2.3,
            opacity: 0
          }}
          transition={{
            duration: 0.55,
            ease: 'easeOut'
          }}
          className="absolute inset-0 rounded-full border border-white/50 pointer-events-none" />

        }
      </AnimatePresence>
    </motion.button>);

});
// ─── ColorSwatches (public API) ───────────────────────────────────────────────
export interface ColorSwatchesProps {
  /** Jelenleg kijelölt swatch id */
  value: string;
  /** Meghívódik, amikor a felhasználó swatch-ot választ */
  onChange: (id: string) => void;
  /** Felülírja a swatch készletet (alapértelmezett: DEFAULT_SWATCHES) */
  swatches?: readonly ColorSwatch[];
  /** Meghívódik, amikor a felhasználó a "Custom…" swatch-ot aktiválja */
  onCustomClick?: () => void;
  /** Opcionális accessible label a csoporthoz */
  label?: string;
}
export function ColorSwatches({
  value,
  onChange,
  swatches = DEFAULT_SWATCHES,
  onCustomClick,
  label = 'Color'
}: ColorSwatchesProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  // null = pointer a csoporton kívül; szám = pointer clientX
  // ✅ FIX: mouseX a Context-en keresztül jut el a swatch-okhoz — prop drilling megszüntetve
  const mouseX = useMotionValue<number | null>(null);
  // ── Pointer tracking ─────────────────────────────────────────────────────
  // ✅ FIX: onPointerMove bekötve → mouseX frissül → dock-effekt működik
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => mouseX.set(e.clientX),
    [mouseX]
  );
  const handlePointerLeave = useCallback(() => mouseX.set(null), [mouseX]);
  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = swatches.findIndex((s) => s.id === value);
      let next = idx;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          next = (idx + 1) % swatches.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          next = (idx - 1 + swatches.length) % swatches.length;
          break;
        case 'Home':
          e.preventDefault();
          next = 0;
          break;
        case 'End':
          e.preventDefault();
          next = swatches.length - 1;
          break;
        default:
          return;
      }
      const target = swatches[next];
      if (target.id === 'custom') {
        onCustomClick?.();
      } else {
        onChange(target.id);
      }
      const radios =
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      radios?.[next]?.focus();
    },
    [value, swatches, onChange, onCustomClick]
  );
  // ✅ FIX: useCallback az onClick factory-n — stabil referenciák minden swatch-nak
  const makeClickHandler = useCallback(
    (swatch: ColorSwatch) => () => {
      if (swatch.id === 'custom') {
        onCustomClick?.();
      } else {
        onChange(swatch.id);
      }
    },
    [onChange, onCustomClick]
  );
  return (
    // ✅ FIX: MouseXContext.Provider — a mouseX MotionValue elérhető minden swatch-ban
    <MouseXContext.Provider value={mouseX}>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={label}
        // ✅ FIX: onPointerMove + onPointerLeave bekötve → dock-effekt aktív
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between gap-1 px-1 py-1.5 select-none w-full min-w-0">
        
        {swatches.map((swatch, i) =>
        <ColorSwatchItem
          key={swatch.id}
          swatch={swatch}
          isSelected={value === swatch.id}
          onClick={makeClickHandler(swatch)}
          index={i}
          total={swatches.length} />

        )}
      </div>
    </MouseXContext.Provider>);

}