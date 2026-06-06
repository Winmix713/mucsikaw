import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Appearance } from './types';
import { getTokens } from './theme';
interface SavePresetModalProps {
  open: boolean;
  appearance: Appearance;
  accent: string;
  swatch: string;
  onClose: () => void;
  onSave: (name: string) => void;
}
export function SavePresetModal({
  open,
  appearance,
  accent,
  swatch,
  onClose,
  onSave
}: SavePresetModalProps) {
  const t = getTokens(appearance, accent);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setName('');
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };
  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
          duration: 0.18
        }}>
        
          <div
          className="absolute inset-0"
          style={{
            background: 'rgba(2,2,4,0.62)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Save preset"
          initial={{
            opacity: 0,
            y: 14,
            scale: 0.97
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.98
          }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative w-full max-w-[400px] overflow-hidden rounded-[18px] border p-5"
          style={{
            borderColor: t.border,
            background: t.panel,
            boxShadow: t.shadowPanel
          }}>
          
            <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors"
            style={{
              color: t.textMid,
              background: t.surface
            }}>
            
              <X size={15} />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <span
              aria-hidden="true"
              className="h-10 w-10 shrink-0 rounded-[10px]"
              style={{
                background: swatch,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)'
              }} />
            
              <div>
                <h2
                className="text-[16px] font-semibold tracking-[-0.01em]"
                style={{
                  color: t.textHi
                }}>
                
                  Save preset
                </h2>
                <p
                className="text-[12.5px]"
                style={{
                  color: t.textMid
                }}>
                
                  Store this button style for quick reuse.
                </p>
              </div>
            </div>

            <label
            htmlFor="preset-name"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em]"
            style={{
              color: t.textMid
            }}>
            
              Preset name
            </label>
            <input
            ref={inputRef}
            id="preset-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            placeholder="e.g. Aurora Glow"
            className="w-full rounded-[11px] border px-3.5 py-2.5 text-[14px] outline-none transition-colors"
            style={{
              borderColor: t.border,
              background: t.surface,
              color: t.textHi
            }} />
          

            <div className="mt-5 flex justify-end gap-2.5">
              <button
              type="button"
              onClick={onClose}
              className="rounded-[11px] border px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                borderColor: t.border,
                background: t.surface,
                color: t.textHi
              }}>
              
                Cancel
              </button>
              <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="rounded-[11px] px-4 py-2 text-[13px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: accent
              }}>
              
                Save preset
              </button>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}