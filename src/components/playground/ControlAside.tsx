import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Droplet,
  Plus,
  Minus,
  Grid2x2,
  Maximize2,
  ChevronDown,
  CircleDashed,
  SlidersHorizontal,
  Square,
  Layers,
  Sparkles,
  Check,
  BoxIcon,
  type LucideIcon
} from 'lucide-react';
import { SegmentedControl } from '../controls/SegmentedControl';
import {
  ButtonStyle,
  Appearance,
  EffectKind,
  Effect,
  GlassEffect,
  DropShadowEffect,
  InnerShadowEffect,
  BackgroundBlurEffect,
  TextureEffect,
  NoiseEffect } from
'./types';
import { getTokens } from './theme';
interface ControlAsideProps {
  style: ButtonStyle;
  appearance: Appearance;
  accent: string;
  onAppearanceChange: (a: Appearance) => void;
  onUpdate: (patch: Partial<ButtonStyle>, coalesce?: boolean) => void;
  onUpdateEffect: (
  kind: EffectKind,
  patch: Partial<Effect>,
  coalesce?: boolean)
  => void;
}
type Tokens = ReturnType<typeof getTokens>;
/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                          */
/* -------------------------------------------------------------------------- */
function IconButton({
  label,
  onClick,
  active,
  t,
  children






}: {label: string;onClick?: () => void;active?: boolean;t: Tokens;children: React.ReactNode;}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        color: active ? t.textHi : t.textMid,
        background: active ? 'rgba(255,255,255,0.08)' : 'transparent'
      }}
      onMouseEnter={(e) =>
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
      }
      onMouseLeave={(e) =>
      e.currentTarget.style.background = active ?
      'rgba(255,255,255,0.08)' :
      'transparent'
      }>
      
      {children}
    </button>);

}
function EyeToggle({
  visible,
  onChange,
  label,
  t





}: {visible: boolean;onChange: (v: boolean) => void;label: string;t: Tokens;}) {
  return (
    <IconButton
      label={`${label}: ${visible ? 'visible' : 'hidden'}`}
      onClick={() => onChange(!visible)}
      t={t}>
      
      {visible ? <Eye size={14} /> : <EyeOff size={14} />}
    </IconButton>);

}
function SectionHeader({
  title,
  t,
  trailing




}: {title: string;t: Tokens;trailing?: React.ReactNode;}) {
  return (
    <div className="flex items-center justify-between px-4 pb-2.5 pt-3.5">
      <h3
        className="text-[12px] font-semibold tracking-[-0.01em]"
        style={{
          color: t.textHi
        }}>
        
        {title}
      </h3>
      {trailing ?
      <div className="flex items-center gap-0.5">{trailing}</div> :
      null}
    </div>);

}
function FieldBox({
  label,
  t,
  children




}: {label?: string;t: Tokens;children: React.ReactNode;}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      {label ?
      <span
        className="select-none text-[10px] font-medium"
        style={{
          color: t.textLo
        }}>
        
          {label}
        </span> :
      null}
      <div
        className="flex h-7 items-center gap-1.5 rounded-[6px] border px-2"
        style={{
          borderColor: t.border,
          background: 'rgba(0,0,0,0.22)'
        }}>
        
        {children}
      </div>
    </div>);

}
function NumberCell({
  value,
  onChange,
  min,
  max,
  step = 1,
  glyph,
  suffix,
  prefix,
  ariaLabel,
  t











}: {value: number;onChange: (v: number) => void;min: number;max: number;step?: number;glyph?: React.ReactNode;suffix?: string;prefix?: string;ariaLabel: string;t: Tokens;}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const round = (v: number) => {
    const d = (step.toString().split('.')[1] ?? '').length;
    return parseFloat(v.toFixed(d));
  };
  return (
    <>
      {glyph ?
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          color: t.textLo
        }}
        aria-hidden="true">
        
          {glyph}
        </span> :
      null}
      {prefix ?
      <span
        className="shrink-0 text-[11px] font-medium"
        style={{
          color: t.textLo
        }}
        aria-hidden="true">
        
          {prefix}
        </span> :
      null}
      <input
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        value={value}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.-]/g, '');
          const n = parseFloat(raw);
          if (!Number.isNaN(n)) onChange(clamp(round(n)));else
          if (raw === '' || raw === '-') onChange(min);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(clamp(round(value + step)));
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(clamp(round(value - step)));
          }
        }}
        className="min-w-0 flex-1 bg-transparent font-mono text-[12px] tabular-nums outline-none"
        style={{
          color: t.textHi
        }} />
      
      {suffix ?
      <span
        className="shrink-0 text-[11px] font-medium"
        style={{
          color: t.textLo
        }}
        aria-hidden="true">
        
          {suffix}
        </span> :
      null}
    </>);

}
function Divider({ t }: {t: Tokens;}) {
  return (
    <div
      className="h-px w-full"
      style={{
        background: t.border
      }} />);


}
// Compact color + hex + opacity field (used standalone inside effect panels).
function ColorField({
  color,
  opacity,
  onColorChange,
  onOpacityChange,
  label,
  t







}: {color: string;opacity: number;onColorChange: (hex: string) => void;onOpacityChange: (v: number) => void;label: string;t: Tokens;}) {
  const hex = color.replace('#', '').toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-[6px] border px-2"
        style={{
          borderColor: t.border,
          background: 'rgba(0,0,0,0.22)'
        }}>
        
        <label className="relative flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[3px]">
          <span
            className="absolute inset-0 rounded-[3px]"
            style={{
              background: color,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
            }} />
          
          <input
            type="color"
            aria-label={`${label} color`}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0" />
          
        </label>
        <input
          type="text"
          aria-label={`${label} hex`}
          value={hex}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
            if (v.length === 6) onColorChange(`#${v}`);
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tabular-nums outline-none"
          style={{
            color: t.textHi
          }} />
        
      </div>
      <div
        className="flex h-7 w-[64px] shrink-0 items-center gap-1 rounded-[6px] border px-2"
        style={{
          borderColor: t.border,
          background: 'rgba(0,0,0,0.22)'
        }}>
        
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} opacity`}
          value={opacity}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
            if (!Number.isNaN(n)) onOpacityChange(Math.max(0, Math.min(100, n)));else
            if (e.target.value === '') onOpacityChange(0);
          }}
          className="min-w-0 flex-1 bg-transparent text-right font-mono text-[11px] tabular-nums outline-none"
          style={{
            color: t.textHi
          }} />
        
        <span
          className="shrink-0 text-[11px]"
          style={{
            color: t.textLo
          }}
          aria-hidden="true">
          
          %
        </span>
      </div>
    </div>);

}
// Fill / Stroke top row: swatch + hex + opacity + eye + minus.
function ColorLayerRow({
  color,
  opacity,
  visible,
  onColorChange,
  onOpacityChange,
  onVisibleChange,
  onRemove,
  label,
  t










}: {color: string;opacity: number;visible: boolean;onColorChange: (hex: string) => void;onOpacityChange: (v: number) => void;onVisibleChange: (v: boolean) => void;onRemove?: () => void;label: string;t: Tokens;}) {
  const hex = color.replace('#', '').toUpperCase();
  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      <div
        className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded-[6px] border px-2"
        style={{
          borderColor: t.border,
          background: 'rgba(0,0,0,0.22)'
        }}>
        
        <label className="relative flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[3px]">
          <span
            className="absolute inset-0 rounded-[3px]"
            style={{
              background: color,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
            }} />
          
          <input
            type="color"
            aria-label={`${label} color`}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0" />
          
        </label>
        <input
          type="text"
          aria-label={`${label} hex`}
          value={hex}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
            if (v.length === 6) onColorChange(`#${v}`);
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-[11px] uppercase tabular-nums outline-none"
          style={{
            color: t.textHi
          }} />
        
        <input
          type="text"
          inputMode="numeric"
          aria-label={`${label} opacity`}
          value={opacity}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
            if (!Number.isNaN(n)) onOpacityChange(Math.max(0, Math.min(100, n)));else
            if (e.target.value === '') onOpacityChange(0);
          }}
          className="w-7 shrink-0 bg-transparent text-right font-mono text-[11px] tabular-nums outline-none"
          style={{
            color: t.textMid
          }} />
        
        <span
          className="shrink-0 text-[11px]"
          style={{
            color: t.textLo
          }}
          aria-hidden="true">
          
          %
        </span>
      </div>
      <EyeToggle
        visible={visible}
        onChange={onVisibleChange}
        label={label}
        t={t} />
      
      <IconButton label={`Remove ${label}`} onClick={onRemove} t={t}>
        <Minus size={14} />
      </IconButton>
    </div>);

}
function SelectCell({
  value,
  options,
  onChange,
  ariaLabel,
  glyph,
  t










}: {value: string;options: {value: string;label: string;}[];onChange: (v: string) => void;ariaLabel: string;glyph?: React.ReactNode;t: Tokens;}) {
  return (
    <div
      className="relative flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-[6px] border px-2"
      style={{
        borderColor: t.border,
        background: 'rgba(0,0,0,0.22)'
      }}>
      
      {glyph ?
      <span
        className="flex shrink-0 items-center justify-center"
        style={{
          color: t.textMid
        }}
        aria-hidden="true">
        
          {glyph}
        </span> :
      null}
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent text-[12px] outline-none"
        style={{
          color: t.textHi
        }}>
        
        {options.map((o) =>
        <option
          key={o.value}
          value={o.value}
          style={{
            color: '#111'
          }}>
          
            {o.label}
          </option>
        )}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none shrink-0"
        style={{
          color: t.textLo
        }}
        aria-hidden="true" />
      
    </div>);

}
// Compact left-label / right-control row used inside effect panels.
function PanelRow({
  label,
  t,
  children,
  align = 'center'





}: {label: string;t: Tokens;children: React.ReactNode;align?: 'center' | 'start';}) {
  return (
    <div
      className={`grid grid-cols-[64px_1fr] gap-2 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      
      <span
        className="text-[11px]"
        style={{
          color: t.textMid,
          paddingTop: align === 'start' ? 6 : 0
        }}>
        
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>);

}
// Lightweight inline slider for 0–100 effect params (Glass etc.).
function MiniSlider({
  value,
  min,
  max,
  onChange,
  ariaLabel,
  t







}: {value: number;min: number;max: number;onChange: (v: number) => void;ariaLabel: string;t: Tokens;}) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = (value - min) / Math.max(1, max - min) * 100;
  const setFrom = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    onChange(Math.round(min + p * (max - min)));
  };
  return (
    <div className="flex items-center gap-2.5">
      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="relative flex h-5 flex-1 cursor-pointer items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        onPointerDown={(e) => {
          ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          setFrom(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFrom(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(Math.min(max, value + 1));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(Math.max(min, value - 1));
          }
        }}>
        
        <div
          ref={ref}
          className="relative h-[3px] w-full rounded-full"
          style={{
            background: 'rgba(255,255,255,0.12)'
          }}>
          
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[var(--accent)]"
            style={{
              width: `${pct}%`
            }} />
          
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            style={{
              left: `${pct}%`
            }} />
          
        </div>
      </div>
      <div
        className="flex h-7 w-[44px] shrink-0 items-center justify-center rounded-[6px] border"
        style={{
          borderColor: t.border,
          background: 'rgba(0,0,0,0.22)'
        }}>
        
        <span
          className="font-mono text-[12px] tabular-nums"
          style={{
            color: t.textHi
          }}>
          
          {value}
        </span>
      </div>
    </div>);

}
function CheckRow({
  label,
  checked,
  onChange,
  accent,
  t






}: {label: string;checked: boolean;onChange: (v: boolean) => void;accent: string;t: Tokens;}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md">
      
      <span
        className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] border"
        style={{
          background: checked ? accent : 'transparent',
          borderColor: checked ? accent : 'rgba(255,255,255,0.25)'
        }}>
        
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span
        className="text-[12px]"
        style={{
          color: t.textHi
        }}>
        
        {label}
      </span>
    </button>);

}
/* -------------------------------------------------------------------------- */
/*  Effect rows + detail panels                                                */
/* -------------------------------------------------------------------------- */
const EFFECT_META: Record<
  EffectKind,
  {
    label: string;
    Icon: LucideIcon;
  }> =
{
  glass: {
    label: 'Glass',
    Icon: CircleDashed
  },
  texture: {
    label: 'Texture',
    Icon: Grid2x2
  },
  noise: {
    label: 'Noise',
    Icon: Sparkles
  },
  innerShadow: {
    label: 'Inner shadow',
    Icon: Square
  },
  dropShadow: {
    label: 'Drop shadow',
    Icon: BoxIcon
  },
  backgroundBlur: {
    label: 'Background blur',
    Icon: Layers
  }
};
const EFFECT_ORDER: EffectKind[] = [
'glass',
'texture',
'noise',
'innerShadow',
'dropShadow',
'backgroundBlur'];

function EffectDetails({
  kind,
  effect,
  accent,
  onUpdateEffect,
  t










}: {kind: EffectKind;effect: Effect;accent: string;onUpdateEffect: (k: EffectKind, patch: Partial<Effect>, coalesce?: boolean) => void;t: Tokens;}) {
  const set = (patch: Partial<Effect>, coalesce = true) =>
  onUpdateEffect(kind, patch, coalesce);
  if (kind === 'glass') {
    const g = effect as GlassEffect;
    return (
      <div className="flex flex-col gap-3">
        <PanelRow label="Light" t={t} align="start">
          <div className="flex gap-2">
            <NumberFieldBox t={t}>
              <NumberCell
                value={g.lightAngle}
                onChange={(v) =>
                set({
                  lightAngle: v
                })
                }
                min={-180}
                max={180}
                suffix="°"
                ariaLabel="Light angle"
                t={t} />
              
            </NumberFieldBox>
            <NumberFieldBox t={t}>
              <NumberCell
                value={g.lightIntensity}
                onChange={(v) =>
                set({
                  lightIntensity: v
                })
                }
                min={0}
                max={100}
                suffix="%"
                ariaLabel="Light intensity"
                t={t} />
              
            </NumberFieldBox>
          </div>
        </PanelRow>
        <PanelRow label="Refraction" t={t}>
          <MiniSlider
            value={g.refraction}
            min={0}
            max={100}
            onChange={(v) =>
            set({
              refraction: v
            })
            }
            ariaLabel="Refraction"
            t={t} />
          
        </PanelRow>
        <PanelRow label="Depth" t={t}>
          <MiniSlider
            value={g.depth}
            min={0}
            max={100}
            onChange={(v) =>
            set({
              depth: v
            })
            }
            ariaLabel="Depth"
            t={t} />
          
        </PanelRow>
        <PanelRow label="Dispersion" t={t}>
          <MiniSlider
            value={g.dispersion}
            min={0}
            max={100}
            onChange={(v) =>
            set({
              dispersion: v
            })
            }
            ariaLabel="Dispersion"
            t={t} />
          
        </PanelRow>
        <PanelRow label="Frost" t={t}>
          <MiniSlider
            value={g.frost}
            min={0}
            max={100}
            onChange={(v) =>
            set({
              frost: v
            })
            }
            ariaLabel="Frost"
            t={t} />
          
        </PanelRow>
        <PanelRow label="Splay" t={t}>
          <MiniSlider
            value={g.splay}
            min={0}
            max={100}
            onChange={(v) =>
            set({
              splay: v
            })
            }
            ariaLabel="Splay"
            t={t} />
          
        </PanelRow>
      </div>);

  }
  if (kind === 'dropShadow' || kind === 'innerShadow') {
    const s = effect as DropShadowEffect | InnerShadowEffect;
    const bound = kind === 'dropShadow' ? 48 : 24;
    return (
      <div className="flex flex-col gap-3">
        <PanelRow label="Position" t={t} align="start">
          <div className="flex flex-col gap-2">
            <NumberFieldBox t={t}>
              <NumberCell
                value={s.x}
                onChange={(v) =>
                set({
                  x: v
                })
                }
                min={-bound}
                max={bound}
                prefix="X"
                ariaLabel={`${kind} X`}
                t={t} />
              
            </NumberFieldBox>
            <NumberFieldBox t={t}>
              <NumberCell
                value={s.y}
                onChange={(v) =>
                set({
                  y: v
                })
                }
                min={-bound}
                max={bound}
                prefix="Y"
                ariaLabel={`${kind} Y`}
                t={t} />
              
            </NumberFieldBox>
          </div>
        </PanelRow>
        <PanelRow label="Blur" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={s.blur}
              onChange={(v) =>
              set({
                blur: v
              })
              }
              min={0}
              max={kind === 'dropShadow' ? 80 : 24}
              glyph={<Grid2x2 size={12} />}
              ariaLabel="Blur"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <PanelRow label="Spread" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={s.spread}
              onChange={(v) =>
              set({
                spread: v
              })
              }
              min={kind === 'dropShadow' ? -24 : -12}
              max={kind === 'dropShadow' ? 24 : 12}
              glyph={<Maximize2 size={12} />}
              ariaLabel="Spread"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <PanelRow label="Color" t={t}>
          <ColorField
            color={s.color}
            opacity={s.opacity}
            onColorChange={(hex) =>
            set(
              {
                color: hex
              },
              false
            )
            }
            onOpacityChange={(o) =>
            set({
              opacity: o
            })
            }
            label={kind}
            t={t} />
          
        </PanelRow>
        {kind === 'dropShadow' &&
        <CheckRow
          label="Show behind transparent areas"
          checked={(s as DropShadowEffect).showBehind}
          onChange={(v) =>
          set(
            {
              showBehind: v
            },
            false
          )
          }
          accent={accent}
          t={t} />

        }
      </div>);

  }
  if (kind === 'backgroundBlur') {
    const b = effect as BackgroundBlurEffect;
    return (
      <div className="flex flex-col gap-3">
        <SegmentedControl
          ariaLabel="Blur mode"
          value={b.mode}
          options={[
          {
            value: 'uniform',
            label: 'Uniform'
          },
          {
            value: 'progressive',
            label: 'Progressive'
          }]
          }
          onChange={(m) =>
          set(
            {
              mode: m as BackgroundBlurEffect['mode']
            },
            false
          )
          } />
        
        <PanelRow label="Blur" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={b.amount}
              onChange={(v) =>
              set({
                amount: v
              })
              }
              min={0}
              max={40}
              glyph={<Grid2x2 size={12} />}
              ariaLabel="Blur amount"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
      </div>);

  }
  if (kind === 'texture') {
    const tx = effect as TextureEffect;
    return (
      <div className="flex flex-col gap-3">
        <PanelRow label="Size" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={tx.size}
              onChange={(v) =>
              set({
                size: v
              })
              }
              min={0.1}
              max={4}
              step={0.1}
              glyph={<Grid2x2 size={12} />}
              ariaLabel="Texture size"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <PanelRow label="Radius" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={tx.radius}
              onChange={(v) =>
              set({
                radius: v
              })
              }
              min={0}
              max={40}
              glyph={<Maximize2 size={12} />}
              ariaLabel="Texture radius"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <CheckRow
          label="Clip to shape"
          checked={tx.clipToShape}
          onChange={(v) =>
          set(
            {
              clipToShape: v
            },
            false
          )
          }
          accent={accent}
          t={t} />
        
      </div>);

  }
  if (kind === 'noise') {
    const n = effect as NoiseEffect;
    return (
      <div className="flex flex-col gap-3">
        <SegmentedControl
          ariaLabel="Noise mode"
          value={n.mode}
          options={[
          {
            value: 'mono',
            label: 'Mono'
          },
          {
            value: 'duo',
            label: 'Duo'
          },
          {
            value: 'multi',
            label: 'Multi'
          }]
          }
          onChange={(m) =>
          set(
            {
              mode: m as NoiseEffect['mode']
            },
            false
          )
          } />
        
        <PanelRow label="Noise size" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={n.size}
              onChange={(v) =>
              set({
                size: v
              })
              }
              min={0.1}
              max={4}
              step={0.1}
              glyph={<Grid2x2 size={12} />}
              ariaLabel="Noise size"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <PanelRow label="Density" t={t}>
          <NumberFieldBox t={t}>
            <NumberCell
              value={n.density}
              onChange={(v) =>
              set({
                density: v
              })
              }
              min={0}
              max={100}
              suffix="%"
              ariaLabel="Density"
              t={t} />
            
          </NumberFieldBox>
        </PanelRow>
        <PanelRow label="Color" t={t}>
          <ColorField
            color={n.color}
            opacity={n.opacity}
            onColorChange={(hex) =>
            set(
              {
                color: hex
              },
              false
            )
            }
            onOpacityChange={(o) =>
            set({
              opacity: o
            })
            }
            label="Noise"
            t={t} />
          
        </PanelRow>
      </div>);

  }
  return null;
}
// Single-field box wrapper for effect-panel NumberCells.
function NumberFieldBox({
  t,
  children



}: {t: Tokens;children: React.ReactNode;}) {
  return (
    <div
      className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-[6px] border px-2"
      style={{
        borderColor: t.border,
        background: 'rgba(0,0,0,0.22)'
      }}>
      
      {children}
    </div>);

}
function EffectRow({
  kind,
  effect,
  expanded,
  onToggleExpand,
  accent,
  onUpdateEffect,
  t












}: {kind: EffectKind;effect: Effect;expanded: boolean;onToggleExpand: () => void;accent: string;onUpdateEffect: (k: EffectKind, patch: Partial<Effect>, coalesce?: boolean) => void;t: Tokens;}) {
  const { label, Icon } = EFFECT_META[kind];
  return (
    <div className="px-4">
      <div className="flex items-center gap-2 py-1">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center"
          style={{
            color: t.textMid
          }}
          aria-hidden="true">
          
          <Icon size={15} />
        </span>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          className="flex h-7 min-w-0 flex-1 items-center justify-between rounded-[6px] border px-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            borderColor: t.border,
            background: 'rgba(0,0,0,0.22)'
          }}>
          
          <span
            className="truncate text-[12px]"
            style={{
              color: effect.enabled ? t.textHi : t.textLo
            }}>
            
            {label}
          </span>
          <motion.span
            animate={{
              rotate: expanded ? 180 : 0
            }}
            transition={{
              duration: 0.18
            }}
            className="shrink-0"
            style={{
              color: t.textLo
            }}
            aria-hidden="true">
            
            <ChevronDown size={13} />
          </motion.span>
        </button>
        <EyeToggle
          visible={effect.enabled}
          onChange={(v) =>
          onUpdateEffect(kind, {
            enabled: v
          })
          }
          label={label}
          t={t} />
        
      </div>
      <AnimatePresence initial={false}>
        {expanded &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="overflow-hidden">
          
            <div
            className="mb-1 ml-8 rounded-[8px] border p-3"
            style={{
              borderColor: t.border,
              background: 'rgba(0,0,0,0.18)'
            }}>
            
              <EffectDetails
              kind={kind}
              effect={effect}
              accent={accent}
              onUpdateEffect={onUpdateEffect}
              t={t} />
            
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */
export function ControlAside({
  style,
  appearance,
  accent,
  onAppearanceChange,
  onUpdate,
  onUpdateEffect
}: ControlAsideProps) {
  const t = getTokens(appearance, accent);
  const getEffect = (kind: EffectKind) =>
  style.effects.find((e) => e.kind === kind);
  const [expanded, setExpanded] = useState<EffectKind | null>('glass');
  const strokeVisible = style.borderWidth > 0;
  const setStrokeVisible = useCallback(
    (v: boolean) =>
    onUpdate({
      borderWidth: v ? Math.max(1, style.borderWidth) : 0
    }),
    [onUpdate, style.borderWidth]
  );
  const fillVisible = style.fillOpacity > 0;
  return (
    <aside
      aria-label="Design inspector"
      className="flex w-full flex-col overflow-hidden rounded-[12px] border lg:w-[18rem] lg:shrink-0"
      style={{
        borderColor: t.border,
        background: t.panel
      }}>
      
      {/* ── APPEARANCE ─────────────────────────────────────────────────── */}
      <SectionHeader
        title="Appearance"
        t={t}
        trailing={
        <>
            <IconButton
            label={`Theme: ${appearance}`}
            onClick={() =>
            onAppearanceChange(appearance === 'dark' ? 'light' : 'dark')
            }
            t={t}>
            
              <Eye size={14} />
            </IconButton>
            <IconButton label="Tint" t={t}>
              <Droplet size={14} />
            </IconButton>
          </>
        } />
      
      <div className="flex items-end gap-2 px-4 pb-3.5">
        <FieldBox label="Opacity" t={t}>
          {/* Opacity drives the button fill transparency (style.fillOpacity). */}
          <NumberCell
            value={style.fillOpacity}
            onChange={(v) =>
            onUpdate(
              {
                fillOpacity: v
              },
              true
            )
            }
            min={0}
            max={100}
            suffix="%"
            ariaLabel="Fill opacity"
            glyph={<Droplet size={12} />}
            t={t} />
          
        </FieldBox>
        <FieldBox label="Corner radius" t={t}>
          <NumberCell
            value={style.radius}
            onChange={(v) =>
            onUpdate(
              {
                radius: v
              },
              true
            )
            }
            min={0}
            max={999}
            ariaLabel="Corner radius"
            glyph={<SlidersHorizontal size={12} />}
            t={t} />
          
        </FieldBox>
        <IconButton label="Fit corners" t={t}>
          <Maximize2 size={14} />
        </IconButton>
      </div>

      <Divider t={t} />

      {/* ── FILL ───────────────────────────────────────────────────────── */}
      <SectionHeader
        title="Fill"
        t={t}
        trailing={
        <>
            <IconButton label="Fill styles" t={t}>
              <Grid2x2 size={14} />
            </IconButton>
            <IconButton label="Add fill" t={t}>
              <Plus size={14} />
            </IconButton>
          </>
        } />
      
      {/* Fill color = the button's background color (style.baseColor). */}
      <ColorLayerRow
        label="Fill"
        color={style.baseColor}
        opacity={style.fillOpacity}
        visible={fillVisible}
        onColorChange={(hex) =>
        onUpdate({
          baseColor: hex
        })
        }
        onOpacityChange={(o) =>
        onUpdate(
          {
            fillOpacity: o
          },
          true
        )
        }
        onVisibleChange={(v) =>
        onUpdate({
          fillOpacity: v ? Math.max(1, style.fillOpacity) : 0
        })
        }
        onRemove={() =>
        onUpdate({
          fillOpacity: 0
        })
        }
        t={t} />
      

      <Divider t={t} />

      {/* ── STROKE ─────────────────────────────────────────────────────── */}
      <SectionHeader
        title="Stroke"
        t={t}
        trailing={
        <>
            <IconButton label="Stroke styles" t={t}>
              <Grid2x2 size={14} />
            </IconButton>
            <IconButton
            label="Add stroke"
            onClick={() => setStrokeVisible(true)}
            t={t}>
            
              <Plus size={14} />
            </IconButton>
          </>
        } />
      
      <ColorLayerRow
        label="Stroke"
        color={style.borderColor}
        opacity={style.borderOpacity}
        visible={strokeVisible}
        onColorChange={(hex) =>
        onUpdate({
          borderColor: hex
        })
        }
        onOpacityChange={(o) =>
        onUpdate(
          {
            borderOpacity: o
          },
          true
        )
        }
        onVisibleChange={setStrokeVisible}
        onRemove={() => setStrokeVisible(false)}
        t={t} />
      
      <div className="flex items-end gap-2 px-4 pb-3">
        <FieldBox label="Position" t={t}>
          <SelectCell
            ariaLabel="Stroke position"
            value="inside"
            options={[
            {
              value: 'inside',
              label: 'Inside'
            },
            {
              value: 'center',
              label: 'Center'
            },
            {
              value: 'outside',
              label: 'Outside'
            }]
            }
            onChange={() => {}}
            t={t} />
          
        </FieldBox>
        <FieldBox label="Weight" t={t}>
          <NumberCell
            value={style.borderWidth}
            onChange={(v) =>
            onUpdate(
              {
                borderWidth: v
              },
              true
            )
            }
            min={0}
            max={12}
            ariaLabel="Stroke weight"
            glyph={<Layers size={12} />}
            t={t} />
          
        </FieldBox>
        <IconButton label="Advanced stroke" t={t}>
          <SlidersHorizontal size={14} />
        </IconButton>
        <IconButton label="Stroke style" t={t}>
          <Maximize2 size={14} />
        </IconButton>
      </div>
      <div className="px-4 pb-3.5">
        <FieldBox label="End points" t={t}>
          <SelectCell
            ariaLabel="End points"
            value="none"
            options={[
            {
              value: 'none',
              label: 'None'
            },
            {
              value: 'round',
              label: 'Round'
            },
            {
              value: 'square',
              label: 'Square'
            }]
            }
            onChange={() => {}}
            t={t} />
          
        </FieldBox>
      </div>

      <Divider t={t} />

      {/* ── EFFECTS ────────────────────────────────────────────────────── */}
      <SectionHeader
        title="Effects"
        t={t}
        trailing={
        <>
            <IconButton label="Effect styles" t={t}>
              <Grid2x2 size={14} />
            </IconButton>
            <IconButton label="Add effect" t={t}>
              <Plus size={14} />
            </IconButton>
          </>
        } />
      
      <div className="flex flex-col gap-1 pb-3">
        {EFFECT_ORDER.map((kind) => {
          const fx = getEffect(kind);
          if (!fx) return null;
          return (
            <EffectRow
              key={kind}
              kind={kind}
              effect={fx}
              expanded={expanded === kind}
              onToggleExpand={() =>
              setExpanded((cur) => cur === kind ? null : kind)
              }
              accent={accent}
              onUpdateEffect={onUpdateEffect}
              t={t} />);


        })}
      </div>
    </aside>);

}