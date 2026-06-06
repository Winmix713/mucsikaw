import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings2, AlertTriangle, X } from 'lucide-react';
import type { ButtonStyle, Appearance } from './types';
import { composeStyle, toReactStyle, stateOverrides } from './css';
import type { PreviewState } from './css';
import { getTokens } from './theme';
import { SegmentedControl } from '../controls/SegmentedControl';
interface PreviewStageProps {
  style: ButtonStyle;
  appearance: Appearance;
  accent: string;
  onOpenSettings?: () => void;
}
const STATE_OPTIONS: {
  value: PreviewState;
  label: string;
}[] = [
{
  value: 'default',
  label: 'Default'
},
{
  value: 'hover',
  label: 'Hover'
},
{
  value: 'active',
  label: 'Active'
},
{
  value: 'focus',
  label: 'Focus'
},
{
  value: 'disabled',
  label: 'Disabled'
}];

export function PreviewStage({
  style,
  appearance,
  accent,
  onOpenSettings
}: PreviewStageProps) {
  const t = getTokens(appearance, accent);
  const composed = composeStyle(style, 'preview');
  const reactStyle = toReactStyle(style, 'preview');
  const [warnDismissed, setWarnDismissed] = useState(false);
  const [previewState, setPreviewState] = useState<PreviewState>('default');
  // Reset the dismissal whenever a layer-blur is freshly toggled on.
  useEffect(() => {
    if (!composed.hasLayerBlur) setWarnDismissed(false);
  }, [composed.hasLayerBlur]);
  const showWarning = composed.hasLayerBlur && !warnDismissed;
  const isDisabled = previewState === 'disabled';
  const overrides = stateOverrides(style, previewState, accent);
  // When simulating a state, suppress interactive gesture animation so the
  // static simulation reads cleanly. 'default' keeps the live, playful gestures.
  const interactive = previewState === 'default';
  return (
    <section
      aria-label="Live preview"
      className="relative overflow-hidden rounded-[20px] border"
      style={{
        borderColor: t.border,
        background: t.stage,
        minHeight: 360
      }}>
      
      {/* Texture displacement filter definition (docs §8) — rendered once */}
      {composed.texture &&
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="pointer-events-none absolute">
        
          <filter id={composed.texture.filterId}>
            <feTurbulence
            type="fractalNoise"
            baseFrequency={composed.texture.baseFrequency}
            numOctaves={2}
            seed={3} />
          
            <feDisplacementMap
            in="SourceGraphic"
            scale={composed.texture.scale} />
          
          </filter>
        </svg>
      }

      {/* Dot-grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${t.stageDots} 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
          maskImage:
          'radial-gradient(ellipse 75% 70% at 50% 45%, #000 30%, transparent 100%)',
          WebkitMaskImage:
          'radial-gradient(ellipse 75% 70% at 50% 45%, #000 30%, transparent 100%)'
        }} />
      

      {/* Atmosphere glow tinted by accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 55% at 50% 42%, ${accent}22, transparent 70%)`
        }} />
      

      {/* Gear button */}
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Preview settings"
        className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-[11px] border transition-colors"
        style={{
          borderColor: t.border,
          background: t.surface,
          color: t.textMid
        }}>
        
        <Settings2 size={15} />
      </button>

      {/* Warning banner */}
      <AnimatePresence>
        {showWarning &&
        <motion.div
          initial={{
            opacity: 0,
            y: -8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: -8
          }}
          transition={{
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          role="alert"
          className="absolute inset-x-3.5 top-3.5 z-10 mr-12 flex items-start gap-2.5 rounded-[12px] border px-3 py-2.5"
          style={{
            borderColor: 'rgba(245,158,11,0.35)',
            background:
            appearance === 'light' ?
            'rgba(245,158,11,0.10)' :
            'rgba(245,158,11,0.12)'
          }}>
          
            <AlertTriangle
            size={14}
            className="mt-0.5 shrink-0"
            style={{
              color: '#f59e0b'
            }} />
          
            <p
            className="text-[12px] leading-snug"
            style={{
              color: appearance === 'light' ? '#92660b' : '#fbbf24'
            }}>
            
              Layer blur can reduce text clarity. Prefer background blur for
              glass styles.
            </p>
            <button
            type="button"
            aria-label="Dismiss warning"
            onClick={() => setWarnDismissed(true)}
            className="ml-auto shrink-0 rounded-md p-0.5 transition-opacity hover:opacity-70"
            style={{
              color: '#f59e0b'
            }}>
            
              <X size={13} />
            </button>
          </motion.div>
        }
      </AnimatePresence>

      {/* The live button */}
      <div className="relative z-10 flex min-h-[300px] items-center justify-center p-10">
        <motion.button
          type="button"
          layout
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
          whileHover={
          interactive ?
          {
            scale: 1.025,
            y: -1
          } :
          undefined
          }
          whileTap={
          interactive ?
          {
            scale: 0.975
          } :
          undefined
          }
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 28
          }}
          className="relative isolate select-none overflow-hidden outline-none"
          style={{
            ...reactStyle,
            ...overrides,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition:
            'transform 150ms ease, box-shadow 150ms ease, filter 150ms ease, opacity 150ms ease'
          }}>
          
          {/* Glass light highlight (docs §6) or generic auto sheen */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: 'inherit',
              zIndex: 1,
              background:
              composed.glassHighlight ??
              'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 42%, transparent 60%)'
            }} />
          
          {/* Noise / texture grain overlay (docs §7 — params-driven feTurbulence) */}
          {composed.noise &&
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: 'inherit',
              zIndex: 2,
              opacity: composed.noise.opacity,
              mixBlendMode: composed.noise.blend,
              backgroundColor: composed.noise.tint ?? undefined,
              backgroundImage: composed.noise.dataUri,
              backgroundSize: `${composed.noise.tile}px ${composed.noise.tile}px`
            }} />

          }
          <span className="relative z-10 whitespace-nowrap">{style.label}</span>
        </motion.button>
      </div>

      {/* State preview toggle */}
      <div className="relative z-10 mx-auto mb-5 w-full max-w-[420px] px-4">
        <SegmentedControl
          ariaLabel="Preview button state"
          value={previewState}
          options={STATE_OPTIONS}
          onChange={setPreviewState} />
        
      </div>
    </section>);

}