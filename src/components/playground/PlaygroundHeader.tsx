import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Copy,
  Code2,
  Download,
  FileDown,
  Undo2,
  Redo2,
  RotateCcw } from
'lucide-react';
import type { Appearance } from './types';
import { getTokens } from './theme';
interface PlaygroundHeaderProps {
  appearance: Appearance;
  accent: string;
  canUndo: boolean;
  canRedo: boolean;
  onSavePreset: () => void;
  onCopyCss: () => void;
  onCopyComponent: () => void;
  onDownloadCss: () => void;
  onDownloadComponent: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
}
interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  appearance: Appearance;
  accent: string;
  iconOnly?: boolean;
}
function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  primary,
  appearance,
  accent,
  iconOnly
}: ActionButtonProps) {
  const t = getTokens(appearance, accent);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={
      disabled ?
      undefined :
      {
        scale: 0.95
      }
      }
      aria-label={label}
      title={label}
      className={[
      'flex h-9 items-center justify-center gap-2 rounded-[11px] border text-[12.5px] font-medium transition-colors',
      iconOnly ? 'w-9' : 'px-3.5',
      disabled ? 'cursor-not-allowed opacity-40' : ''].
      join(' ')}
      style={
      primary ?
      {
        borderColor: 'transparent',
        background: accent,
        color: '#ffffff'
      } :
      {
        borderColor: t.border,
        background: t.surface,
        color: t.textHi
      }
      }>
      
      {icon}
      {!iconOnly && <span>{label}</span>}
    </motion.button>);

}
export function PlaygroundHeader({
  appearance,
  accent,
  canUndo,
  canRedo,
  onSavePreset,
  onCopyCss,
  onCopyComponent,
  onDownloadCss,
  onDownloadComponent,
  onUndo,
  onRedo,
  onReset
}: PlaygroundHeaderProps) {
  const t = getTokens(appearance, accent);
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-3">
        <span
          className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium"
          style={{
            borderColor: t.border,
            background: t.surface,
            color: t.textMid
          }}>
          
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live visual editor
        </span>
        <div>
          <h1
            className="text-[26px] font-semibold leading-tight tracking-[-0.02em]"
            style={{
              color: t.textHi
            }}>
            
            Button Playground
          </h1>
          <p
            className="mt-1 text-[13px]"
            style={{
              color: t.textMid
            }}>
            
            Design advanced buttons live — glass, depth, blur, noise — then copy
            or export production-ready CSS.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          label="Save preset"
          icon={<Save size={14} />}
          onClick={onSavePreset}
          primary
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Copy CSS"
          icon={<Copy size={14} />}
          onClick={onCopyCss}
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Copy Component"
          icon={<Code2 size={14} />}
          onClick={onCopyComponent}
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Download CSS"
          icon={<Download size={14} />}
          onClick={onDownloadCss}
          iconOnly
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Download Component"
          icon={<FileDown size={14} />}
          onClick={onDownloadComponent}
          iconOnly
          appearance={appearance}
          accent={accent} />
        
        <div
          className="mx-0.5 h-6 w-px"
          style={{
            background: t.border
          }}
          aria-hidden="true" />
        
        <ActionButton
          label="Undo"
          icon={<Undo2 size={14} />}
          onClick={onUndo}
          disabled={!canUndo}
          iconOnly
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Redo"
          icon={<Redo2 size={14} />}
          onClick={onRedo}
          disabled={!canRedo}
          iconOnly
          appearance={appearance}
          accent={accent} />
        
        <ActionButton
          label="Reset to defaults"
          icon={<RotateCcw size={14} />}
          onClick={onReset}
          iconOnly
          appearance={appearance}
          accent={accent} />
        
      </div>
    </header>);

}