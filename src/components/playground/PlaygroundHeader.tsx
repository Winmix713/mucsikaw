import React, { Component } from 'react';
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
  icon: React.ReactNode;
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
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.92, y: 0 }}
      aria-label={label}
      title={label}
      className={[
      'flex h-9 items-center justify-center gap-2 rounded-[11px] border text-[12.5px] font-medium transition-all duration-200',
      iconOnly ? 'w-9' : 'px-3.5',
      disabled ? 'cursor-not-allowed opacity-40' : 'hover:shadow-md'].
      join(' ')}
      style={
      primary ?
      {
        borderColor: 'transparent',
        background: accent,
        color: '#ffffff',
        boxShadow: disabled ? undefined : `0 8px 24px ${accent}33`
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
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        <motion.span
          className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium backdrop-blur-sm"
          style={{
            borderColor: t.border,
            background: `${t.surface}cc`,
            color: t.textMid
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}>

          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live visual editor
        </motion.span>
        <div>
          <motion.h1
            className="text-[28px] font-semibold leading-tight tracking-[-0.02em]"
            style={{
              color: t.textHi
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}>

            Button Playground
          </motion.h1>
          <motion.p
            className="mt-2 text-[13px]"
            style={{
              color: t.textMid
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}>

            Design advanced buttons live — glass, depth, blur, noise — then copy
            or export production-ready CSS.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center gap-3 rounded-2xl border p-3 backdrop-blur-md"
        style={{
          borderColor: t.border,
          background: `${t.surface}80`
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
          <ActionButton
            label="Save preset"
            icon={<Save size={14} />}
            onClick={onSavePreset}
            primary
            appearance={appearance}
            accent={accent} />
        </motion.div>

        <div
          className="h-6 w-px"
          style={{
            background: `${t.border}66`
          }}
          aria-hidden="true" />

        <div className="flex items-center gap-2">
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
        </div>

        <div
          className="h-6 w-px"
          style={{
            background: `${t.border}66`
          }}
          aria-hidden="true" />

        <div className="flex items-center gap-2">
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
        </div>

        <div
          className="h-6 w-px"
          style={{
            background: `${t.border}66`
          }}
          aria-hidden="true" />

        <div className="flex items-center gap-1">
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
      </motion.div>
    </header>);

}
