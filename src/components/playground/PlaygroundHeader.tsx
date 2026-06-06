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
  RotateCcw,
  PanelLeft,
  Search,
  ChevronRight,
  Sun,
  Settings } from
'lucide-react';
import type { Appearance } from './types';
import { getTokens } from './theme';
import { useTheme } from '../theme/hooks';
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
  onToggleTheme?: () => void;
  onToggleSidebar?: () => void;
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
function IconButton({
  label,
  icon,
  onClick,
  disabled,
  appearance,
  accent,
  withBg = false
}: ActionButtonProps & { withBg?: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      aria-label={label}
      title={label}
      className={[
      'inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors',
      disabled ? 'cursor-not-allowed opacity-40' : 'hover:text-neutral-100'
      ].join(' ')}
      style={disabled ? { opacity: 0.4 } : {}}>

      {icon}
    </motion.button>);
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
      'inline-flex items-center justify-center gap-1.5 rounded-md px-2 text-[13px] font-normal transition-all duration-200',
      iconOnly ? 'h-7 w-7' : 'h-7',
      disabled ? 'cursor-not-allowed text-neutral-600' : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-100'
      ].join(' ')}>

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
  onReset,
  onToggleTheme,
  onToggleSidebar
}: PlaygroundHeaderProps) {
  const { mode, toggleMode } = useTheme();
  const t = getTokens(appearance, accent);

  return (
    <header
      data-testid="aura-header"
      style={{ minHeight: '96px' }}
      className="aura-head relative isolate flex w-full items-center gap-2 overflow-hidden rounded-[12px] border border-white/[0.06] bg-[#0a0a0a] px-2.5 text-neutral-200">

      {/* Left section: Sidebar + Search */}
      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          aria-label="Open sidebar"
          title="Open sidebar"
          onClick={onToggleSidebar}
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
          whileTap={{ scale: 0.92 }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-neutral-100">
          <PanelLeft size={15} />
        </motion.button>

        <span className="mx-1 h-4 w-px bg-white/[0.08]" />

        <motion.button
          type="button"
          className="group inline-flex h-7 items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 text-[12.5px] text-neutral-400 transition-colors hover:border-white/10 hover:text-neutral-200"
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
          whileTap={{ scale: 0.92 }}>
          <Search size={13} />
          <span>Search</span>
          <kbd className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03] px-1 font-mono text-[10px] text-neutral-500">
            K
          </kbd>
        </motion.button>
      </div>

      {/* Center: Breadcrumb */}
      <nav aria-label="Breadcrumb" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ol className="flex items-center gap-1.5 text-[13px] text-neutral-500">
          <li className="text-neutral-300 transition-colors hover:text-white">
            <a href="#" className="no-underline">Components</a>
          </li>
          <li aria-hidden="true" className="text-neutral-600">
            <ChevronRight size={12} />
          </li>
          <li className="text-neutral-300 transition-colors hover:text-white">
            <a href="#" className="no-underline">Button</a>
          </li>
        </ol>
      </nav>

      {/* Right section: Actions */}
      <div className="ml-auto flex items-center gap-0.5">
        <ActionButton
          label="Copy prompt"
          icon={<Copy size={13} />}
          onClick={onCopyCss}
          appearance={appearance}
          accent={accent} />

        <ActionButton
          label="Copy code"
          icon={<Code2 size={13} />}
          onClick={onCopyComponent}
          appearance={appearance}
          accent={accent} />

        <ActionButton
          label="View code"
          icon={<FileDown size={13} />}
          onClick={onDownloadComponent}
          appearance={appearance}
          accent={accent} />

        <span className="mx-1 h-4 w-px bg-white/[0.08]" />

        <IconButton
          label="Toggle theme"
          icon={<Sun size={14} />}
          onClick={onToggleTheme || toggleMode}
          appearance={appearance}
          accent={accent} />

        <IconButton
          label="Settings"
          icon={<Settings size={14} />}
          onClick={() => {}}
          appearance={appearance}
          accent={accent} />
      </div>
    </header>
  );

}
