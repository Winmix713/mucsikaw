import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { Preset, Appearance } from './types';
import { getTokens } from './theme';
interface PresetBarProps {
  presets: Preset[];
  appearance: Appearance;
  accent: string;
  onApply: (preset: Preset) => void;
  onDelete?: (index: number) => void;
}
export function PresetBar({
  presets,
  appearance,
  accent,
  onApply,
  onDelete
}: PresetBarProps) {
  const t = getTokens(appearance, accent);
  return (
    <section
      aria-label="Saved presets"
      className="rounded-[16px] border p-4"
      style={{
        borderColor: t.border,
        background: t.panelSoft
      }}>
      
      <h3
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{
          color: t.textMid
        }}>
        
        Presets
      </h3>
      <div className="flex flex-wrap gap-2.5">
        {presets.length === 0 &&
        <p
          className="text-[12px]"
          style={{
            color: t.textLo
          }}>
          
            No saved presets yet.
          </p>
        }
        {presets.map((preset, i) =>
        <motion.div
          key={`${preset.name}-${i}`}
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 0.18,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="group relative">
          
            <button
            type="button"
            onClick={() => onApply(preset)}
            className="flex items-center gap-2.5 rounded-[12px] border py-2 pl-2 pr-3 text-left transition-colors"
            style={{
              borderColor: t.border,
              background: t.surface
            }}>
            
              <span
              aria-hidden="true"
              className="h-7 w-7 shrink-0 rounded-[8px]"
              style={{
                background: preset.swatch,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)'
              }} />
            
              <span
              className="text-[12.5px] font-medium"
              style={{
                color: t.textHi
              }}>
              
                {preset.name}
              </span>
            </button>
            {onDelete && !preset.builtIn &&
          <button
            type="button"
            aria-label={`Delete ${preset.name}`}
            onClick={() => onDelete(i)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            style={{
              background: appearance === 'light' ? '#0a0a0c' : '#ffffff',
              color: appearance === 'light' ? '#ffffff' : '#0a0a0c'
            }}>
            
                <Trash2 size={11} />
              </button>
          }
          </motion.div>
        )}
      </div>
    </section>);

}