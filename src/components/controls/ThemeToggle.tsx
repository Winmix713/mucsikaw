import type { ComponentType, KeyboardEvent } from 'react';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, type LucideProps } from 'lucide-react';
import { clsx } from 'clsx';
// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark';
interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  className?: string;
  /** Render icons only (compact variant) — hides the text labels. */
  iconOnly?: boolean;
}
// ─── Config ───────────────────────────────────────────────────────────────────
interface ThemeOption {
  id: Theme;
  label: string;
  Icon: ComponentType<LucideProps>;
}
const OPTIONS: ThemeOption[] = [
{
  id: 'light',
  label: 'Light',
  Icon: Sun
},
{
  id: 'dark',
  label: 'Dark',
  Icon: Moon
}];

// ─── ThemeOptionButton ────────────────────────────────────────────────────────
interface ThemeOptionButtonProps {
  option: ThemeOption;
  isActive: boolean;
  onSelect: (id: Theme) => void;
  iconOnly?: boolean;
}
function ThemeOptionButton({
  option,
  isActive,
  onSelect,
  iconOnly
}: ThemeOptionButtonProps) {
  const { id, label, Icon } = option;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      aria-label={`${label} theme`}
      title={iconOnly ? `${label} theme` : undefined}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(id)}
      className={clsx(
        'flex-1 flex items-center justify-center gap-1.5 h-7',
        'rounded-[var(--r-sm)] text-[11px] font-medium relative',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-transparent',
        isActive ?
        [
        'text-[var(--text-hi)]',
        'bg-[rgba(255,255,255,0.08)]',
        'border border-[rgba(255,255,255,0.05)]',
        'shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'] :

        [
        'text-[var(--text-lo)] hover:text-[var(--text-mid)]',
        'border border-transparent']

      )}>
      
      {/* Icon container — both icons always in DOM for true cross-fade */}
      <span className="relative w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">
        {/* Inactive icon (fades out) */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isActive ? 0 : 1,
            scale: isActive ? 0.6 : 1,
            filter: isActive ? 'blur(4px)' : 'blur(0px)'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 22
          }}>
          
          <Icon size={14} strokeWidth={2.5} />
        </motion.span>

        {/* Active icon (fades in) */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.6,
            filter: isActive ? 'blur(0px)' : 'blur(4px)'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 22
          }}>
          
          <Icon size={14} strokeWidth={2.5} />
        </motion.span>
      </span>

      {!iconOnly && label}
    </button>);

}
// ─── ThemeToggle ──────────────────────────────────────────────────────────────
export function ThemeToggle({
  theme,
  onChange,
  className,
  iconOnly
}: ThemeToggleProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        onChange(theme === 'light' ? 'dark' : 'light');
      }
      if (e.key === 'Home') {
        e.preventDefault();
        onChange('light');
      }
      if (e.key === 'End') {
        e.preventDefault();
        onChange('dark');
      }
    },
    [theme, onChange]
  );
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={handleKeyDown}
      className={clsx(
        'flex items-center gap-1 w-full p-0.5',
        'bg-[rgba(0,0,0,0.2)] rounded-[var(--r-md)]',
        'border border-[var(--border-subtle)]',
        'shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]',
        className
      )}>
      
      {OPTIONS.map((opt) =>
      <ThemeOptionButton
        key={opt.id}
        option={opt}
        isActive={theme === opt.id}
        onSelect={onChange}
        iconOnly={iconOnly} />

      )}
    </div>);

}