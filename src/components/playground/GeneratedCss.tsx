import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import type { ButtonStyle, Appearance } from './types';
import { generateCss } from './css';
import { getTokens } from './theme';
interface GeneratedCssProps {
  style: ButtonStyle;
  appearance: Appearance;
  accent: string;
  onCopy: (text: string) => void;
}
export function GeneratedCss({
  style,
  appearance,
  accent,
  onCopy
}: GeneratedCssProps) {
  const t = getTokens(appearance, accent);
  const css = useMemo(() => generateCss(style), [style]);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy(css);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <section
      aria-label="Generated CSS"
      className="overflow-hidden rounded-[16px] border"
      style={{
        borderColor: t.border,
        background: t.panelSoft
      }}>
      
      <header
        className="flex items-center justify-between border-b px-4 py-3"
        style={{
          borderColor: t.border
        }}>
        
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{
            color: t.textMid
          }}>
          
          Generated CSS
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-[9px] border px-2.5 py-1.5 text-[12px] font-medium transition-colors"
          style={{
            borderColor: t.border,
            background: t.surface,
            color: t.textHi
          }}>
          
          <motion.span
            key={copied ? 'check' : 'copy'}
            initial={{
              scale: 0.7,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              duration: 0.16
            }}
            className="flex items-center">
            
            {copied ?
            <Check
              size={13}
              style={{
                color: '#22c55e'
              }} /> :


            <Copy size={13} />
            }
          </motion.span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </header>
      <pre
        className="max-h-[260px] overflow-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed"
        style={{
          color: t.textHi
        }}>
        
        <code>{css}</code>
      </pre>
    </section>);

}