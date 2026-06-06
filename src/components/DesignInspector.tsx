import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Component } from
'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform } from
'framer-motion';
import {
  Sun,
  Moon,
  Palette,
  Droplets,
  Eye,
  EyeOff,
  Square,
  Layers,
  ArrowLeftRight,
  ArrowUpDown,
  Maximize2,
  LayoutGrid,
  Monitor,
  Smartphone,
  Tablet,
  ChevronRight,
  Plus,
  Minus,
  AlignJustify,
  Scissors,
  Circle,
  Triangle,
  Hexagon,
  BoxIcon } from
'lucide-react';
// ─── Constants ───────────────────────────────────────────────────────────────
const ACCENT = '#3D6AFF';
const COLOR_PALETTE = [
{
  id: 'neutral',
  value: '#2A2835'
},
{
  id: 'red',
  value: '#FF7474'
},
{
  id: 'orange',
  value: '#FFA502'
},
{
  id: 'yellow',
  value: '#FFFA65'
},
{
  id: 'green',
  value: '#2ECC71'
},
{
  id: 'lavender',
  value: '#DEB4F6'
},
{
  id: 'purple',
  value: '#B4AAFF'
}];

type Theme = 'light' | 'dark';
type Preset = 'mobile' | 'tablet';
interface DesignState {
  selectedColor: string;
  theme: Theme;
  blur: number;
  opacity: number;
  radius: number;
  shadow: number;
  width: number;
  height: number;
  padding: number;
  gap: number;
  preset: Preset;
  visible: boolean;
  overflow: boolean;
  hue: number;
  activeStyle: 'glass' | 'glow' | 'skeuo' | 'clay';
}
// ─── Primitive Components ─────────────────────────────────────────────────────
function Panel({
  children,
  className = '',
  theme = 'dark'




}: {children: React.ReactNode;className?: string;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div
      className={`rounded-[22px] overflow-hidden ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(10,12,20,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: isLight ?
        '1px solid rgba(0,0,0,0.08)' :
        '1px solid rgba(255,255,255,0.07)',
        boxShadow: isLight ?
        'inset 2px 4px 16px rgba(255,255,255,0.5), 0 24px 48px -12px rgba(0,0,0,0.15)' :
        'inset 2px 4px 16px rgba(248,248,248,0.04), 0 24px 48px -12px rgba(0,0,0,0.5)'
      }}>
      
      {children}
    </div>);

}
function ControlRow({
  icon: Icon,
  label,
  children,
  theme = 'dark'





}: {icon: React.ElementType;label: string;children: React.ReactNode;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div
      className="flex items-center h-[40px] px-2 rounded-[11px] group"
      style={{
        background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
        border: isLight ?
        '1px solid rgba(0,0,0,0.06)' :
        '1px solid rgba(255,255,255,0.065)',
        transition: 'background 0.15s ease'
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = isLight ?
        'rgba(0,0,0,0.05)' :
        'rgba(255,255,255,0.045)';
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.background = isLight ?
        'rgba(0,0,0,0.03)' :
        'rgba(255,255,255,0.03)';
      }}>
      
      {/* Icon container */}
      <div
        className="flex items-center justify-center w-[22px] h-[22px] rounded-[7px] shrink-0"
        style={{
          background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)'
        }}>
        
        <Icon
          size={13}
          style={{
            color: isLight ? 'rgba(0,0,0,0.52)' : 'rgba(255,255,255,0.52)'
          }} />
        
      </div>

      {/* Label */}
      <span
        className="ml-2 text-[11px] font-medium w-[58px] shrink-0"
        style={{
          color: isLight ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)'
        }}>
        
        {label}
      </span>

      {/* Vertical divider */}
      <div
        className="w-px h-[16px] shrink-0 mx-2"
        style={{
          background: isLight ?
          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' :
          'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
        }} />
      

      {/* Control */}
      <div className="flex-1 flex items-center">{children}</div>
    </div>);

}
function SliderControl({
  value,
  min,
  max,
  onChange,
  unit = 'px',
  theme = 'dark'







}: {value: number;min: number;max: number;onChange: (v: number) => void;unit?: string;theme?: Theme;}) {
  const isLight = theme === 'light';
  const pct = (value - min) / (max - min) * 100;
  return (
    <div className="flex items-center gap-2 w-full">
      {/* Track */}
      <div className="relative flex-1 h-[10px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
            boxShadow: isLight ?
            'inset 0 1px 2px rgba(0,0,0,0.1)' :
            'inset 0 1px 2px rgba(0,0,0,0.3)'
          }} />
        
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${ACCENT}70, ${ACCENT})`,
            transition: 'width 150ms ease-out'
          }} />
        
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[12px] h-[16px] rounded-full"
          style={{
            left: `${pct}%`,
            background: '#ffffff',
            border: isLight ?
            '1px solid rgba(0,0,0,0.1)' :
            '1px solid rgba(255,255,255,0.16)',
            boxShadow: isLight ?
            `0 1px 4px rgba(0,0,0,0.2), 0 0 0 1.5px ${ACCENT}35` :
            `0 1px 4px rgba(0,0,0,0.6), 0 0 0 1.5px ${ACCENT}35`,
            pointerEvents: 'none',
            transition: 'left 150ms ease-out'
          }} />
        
        {/* Native invisible input for interaction */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{
            margin: 0
          }}
          aria-label={`Slider ${min} to ${max} ${unit}`} />
        
      </div>

      {/* Value display */}
      <div className="flex items-center gap-1.5 shrink-0 justify-end">
        <span
          className="text-[11px] font-medium tracking-[-0.3px] w-[20px] text-right"
          style={{
            color: isLight ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)'
          }}>
          
          {value}
        </span>
        <div
          className="flex items-center justify-center px-1.5 h-[22px] rounded-[6px] shrink-0"
          style={{
            background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
            border: isLight ?
            '1px solid rgba(0,0,0,0.08)' :
            '1px solid rgba(255,255,255,0.07)',
            minWidth: '24px'
          }}>
          
          <span
            className="text-[10px] font-medium tracking-[0.5px]"
            style={{
              color: isLight ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.58)'
            }}>
            
            {unit}
          </span>
        </div>
      </div>
    </div>);

}
function NumberStepper({
  value,
  onChange,
  unit = 'px',
  theme = 'dark'





}: {value: number;onChange: (v: number) => void;unit?: string;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div className="flex items-center gap-1.5 w-full justify-end">
      <div
        className="flex items-center rounded-[6px] overflow-hidden px-1"
        style={{
          background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.22)',
          border: isLight ?
          '1px solid rgba(0,0,0,0.08)' :
          '1px solid rgba(255,255,255,0.07)',
          boxShadow: isLight ?
          'inset 0 1px 2px rgba(0,0,0,0.05)' :
          'inset 0 1px 2px rgba(0,0,0,0.3)',
          width: '44px',
          height: '22px'
        }}>
        
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-full bg-transparent text-center text-[11px] font-medium outline-none"
          style={{
            color: isLight ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)'
          }} />
        
      </div>
      <div
        className="flex items-center justify-center px-1.5 h-[22px] rounded-[6px] shrink-0"
        style={{
          background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
          border: isLight ?
          '1px solid rgba(0,0,0,0.08)' :
          '1px solid rgba(255,255,255,0.07)',
          minWidth: '24px'
        }}>
        
        <span
          className="text-[10px] font-medium tracking-[0.5px]"
          style={{
            color: isLight ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.58)'
          }}>
          
          {unit}
        </span>
      </div>
    </div>);

}
function Toggle({
  checked,
  onChange,
  theme = 'dark'




}: {checked: boolean;onChange: (v: boolean) => void;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div className="flex w-full justify-end">
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className="relative flex-shrink-0 w-[40px] h-[22px] rounded-full"
        style={{
          background: checked ?
          ACCENT :
          isLight ?
          'rgba(0,0,0,0.08)' :
          'rgba(255,255,255,0.1)',
          border: `1px solid ${checked ? ACCENT : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'background 150ms ease-out, border-color 150ms ease-out',
          boxShadow: checked ? `0 0 10px ${ACCENT}50` : 'none'
        }}>
        
        <motion.div
          className="absolute top-[1px] w-[18px] h-[18px] rounded-full bg-white"
          animate={{
            left: checked ? 19 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 600,
            damping: 35
          }}
          style={{
            boxShadow: isLight ?
            '0 1px 2px rgba(0,0,0,0.2)' :
            '0 1px 2px rgba(0,0,0,0.5)'
          }} />
        
      </button>
    </div>);

}
// ─── Premium: VisibleToggle ──────────────────────────────────────────────────
// Eye/EyeOff morph inside a glowing knob. The track also reveals an active
// pulse halo when visible.
function VisibleToggle({
  checked,
  onChange,
  theme = 'dark'




}: {checked: boolean;onChange: (v: boolean) => void;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div className="flex w-full justify-end">
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label="Toggle visibility"
        className="relative flex-shrink-0 w-[40px] h-[22px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          background: checked ?
          `linear-gradient(135deg, ${ACCENT} 0%, #5680ff 100%)` :
          isLight ?
          'rgba(0,0,0,0.06)' :
          'rgba(255,255,255,0.08)',
          border: `1px solid ${checked ? isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.18)' : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: checked ?
          `0 0 18px ${ACCENT}55, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 1px rgba(0,0,0,0.35)` :
          isLight ?
          'inset 0 1px 2px rgba(0,0,0,0.1)' :
          'inset 0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)',
          transition:
          'background 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out'
        }}>
        
        {/* Inner pulse halo when on */}
        <AnimatePresence>
          {checked &&
          <motion.span
            aria-hidden
            initial={{
              opacity: 0,
              scale: 0.6
            }}
            animate={{
              opacity: [0.5, 0, 0.5],
              scale: [0.9, 1.1, 0.9]
            }}
            exit={{
              opacity: 0
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-[3px] rounded-full pointer-events-none"
            style={{
              background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.28), transparent 70%)'
            }} />

          }
        </AnimatePresence>

        {/* Knob */}
        <motion.div
          className="absolute top-[1px] w-[18px] h-[18px] rounded-full flex items-center justify-center"
          animate={{
            left: checked ? 19 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 32
          }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #e6e9f2 100%)',
            boxShadow: isLight ?
            '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.05)' :
            '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.1)'
          }}>
          
          <AnimatePresence mode="wait" initial={false}>
            {checked ?
            <motion.span
              key="eye-on"
              initial={{
                opacity: 0,
                scale: 0.6,
                rotate: -12
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                rotate: 12
              }}
              transition={{
                duration: 0.18
              }}
              className="flex items-center justify-center">
              
                <Eye
                size={10}
                strokeWidth={2.4}
                style={{
                  color: ACCENT
                }} />
              
              </motion.span> :

            <motion.span
              key="eye-off"
              initial={{
                opacity: 0,
                scale: 0.6,
                rotate: 12
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.6,
                rotate: -12
              }}
              transition={{
                duration: 0.18
              }}
              className="flex items-center justify-center">
              
                <EyeOff
                size={10}
                strokeWidth={2.4}
                style={{
                  color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(20,22,32,0.55)'
                }} />
              
              </motion.span>
            }
          </AnimatePresence>
        </motion.div>
      </button>
    </div>);

}
// ─── Premium: OverflowToggle ─────────────────────────────────────────────────
// Animated "clip" metaphor — when ON, content gets clipped (scissors close);
// when OFF, content overflows the boundary (dotted ghost line).
function OverflowToggle({
  checked,
  onChange,
  disabled = false,
  theme = 'dark'





}: {checked: boolean;onChange: (v: boolean) => void;disabled?: boolean;theme?: Theme;}) {
  const isLight = theme === 'light';
  return (
    <div className="flex w-full justify-end">
      <button
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        aria-label="Toggle overflow clipping"
        className="relative flex-shrink-0 w-[40px] h-[22px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          background: checked ?
          `linear-gradient(135deg, ${ACCENT} 0%, #5680ff 100%)` :
          isLight ?
          'rgba(0,0,0,0.06)' :
          'rgba(255,255,255,0.08)',
          border: `1px solid ${checked ? isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.18)' : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: checked ?
          `0 0 16px ${ACCENT}50, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 1px rgba(0,0,0,0.35)` :
          isLight ?
          'inset 0 1px 2px rgba(0,0,0,0.1)' :
          'inset 0 1px 2px rgba(0,0,0,0.4)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background 150ms ease-out, box-shadow 150ms ease-out'
        }}>
        
        {/* Track texture — dotted ghost line when off, clean when on */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-[6px] right-[6px] flex items-center pointer-events-none">
          
          <span
            className="w-full h-px"
            style={{
              background: checked ?
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' :
              isLight ?
              'repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0 2px, transparent 2px 5px)' :
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 5px)',
              transition: 'background 150ms ease-out'
            }} />
          
        </span>

        {/* Knob with scissor icon */}
        <motion.div
          className="absolute top-[1px] w-[18px] h-[18px] rounded-full flex items-center justify-center"
          animate={{
            left: checked ? 19 : 1,
            rotate: checked ? 0 : -12
          }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 30
          }}
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #e6e9f2 100%)',
            boxShadow: isLight ?
            '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.05)' :
            '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 1px rgba(0,0,0,0.1)'
          }}>
          
          <motion.span
            animate={{
              scale: checked ? 1 : 0.92,
              opacity: checked ? 1 : 0.6
            }}
            transition={{
              duration: 0.2
            }}
            className="flex items-center justify-center">
            
            <Scissors
              size={9}
              strokeWidth={2.4}
              style={{
                color: checked ?
                ACCENT :
                isLight ?
                'rgba(0,0,0,0.4)' :
                'rgba(20,22,32,0.55)'
              }} />
            
          </motion.span>
        </motion.div>
      </button>
    </div>);

}
// ─── Premium: Spectrum (interactive hue picker) ──────────────────────────────
function Spectrum({
  hue,
  onChange,
  theme = 'dark'




}: {hue: number; // 0–360
  onChange: (h: number) => void;theme?: Theme;}) {const isLight = theme === 'light';
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pct = hue / 360 * 100;
  const currentColor = `hsl(${hue}, 92%, 58%)`;
  const calc = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      onChange(Math.round(ratio * 360));
    },
    [onChange]
  );
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    calc(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    calc(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p
          className="text-[9px] font-semibold uppercase tracking-[0.9px]"
          style={{
            color: isLight ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.58)'
          }}>
          
          Spectrum
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="w-[8px] h-[8px] rounded-full"
            style={{
              background: currentColor,
              boxShadow: isLight ?
              `0 0 8px ${currentColor}, inset 0 0 0 1px rgba(0,0,0,0.1)` :
              `0 0 8px ${currentColor}, inset 0 0 0 1px rgba(255,255,255,0.4)`
            }} />
          
          <span
            className="text-[9px] font-mono tabular-nums tracking-wider"
            style={{
              color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)'
            }}>
            
            {Math.round(hue)}°
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hue)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onChange(Math.max(0, hue - 4));
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onChange(Math.min(360, hue + 4));
          } else if (e.key === 'Home') {
            e.preventDefault();
            onChange(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            onChange(360);
          }
        }}
        className="relative h-[14px] w-full cursor-pointer touch-none rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/30"
        style={{
          background:
          'linear-gradient(90deg, #FF0000 0%, #FF7F00 17%, #FFFF00 33%, #00FF00 50%, #00FFFF 67%, #0000FF 83%, #8B00FF 100%)',
          boxShadow: isLight ?
          'inset 0 1px 3px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.06)' :
          'inset 0 1px 3px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)'
        }}>
        
        {/* Reflective sheen */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[5px] rounded-t-[7px] pointer-events-none"
          style={{
            background: isLight ?
            'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)' :
            'linear-gradient(180deg, rgba(255,255,255,0.32), transparent)'
          }} />
        

        {/* Active value tooltip */}
        <AnimatePresence>
          {(isDragging || isHovered) &&
          <motion.div
            aria-hidden
            initial={{
              opacity: 0,
              y: 4,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 4,
              scale: 0.9
            }}
            transition={{
              duration: 0.14
            }}
            className="absolute -top-7 -translate-x-1/2 px-1.5 py-0.5 rounded-md pointer-events-none"
            style={{
              left: `${pct}%`,
              background: isLight ?
              'rgba(255,255,255,0.92)' :
              'rgba(18,18,22,0.92)',
              border: isLight ?
              '1px solid rgba(0,0,0,0.1)' :
              '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}>
            
              <span
              className="text-[9px] font-mono tabular-nums tracking-wider"
              style={{
                color: isLight ?
                'rgba(0,0,0,0.85)' :
                'rgba(255,255,255,0.85)'
              }}>
              
                {Math.round(hue)}°
              </span>
            </motion.div>
          }
        </AnimatePresence>

        {/* Handle */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          animate={{
            scale: isDragging ? 1.15 : isHovered ? 1.05 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28
          }}
          style={{
            left: `${pct}%`,
            width: 18,
            height: 18,
            background: '#ffffff',
            border: `2px solid ${currentColor}`,
            boxShadow: isLight ?
            `0 2px 4px rgba(0,0,0,0.2), 0 0 8px ${currentColor}50, inset 0 0 0 1px rgba(255,255,255,0.8)` :
            `0 2px 6px rgba(0,0,0,0.5), 0 0 12px ${currentColor}80, inset 0 0 0 1px rgba(255,255,255,0.6)`
          }}>
          
          <span
            className="absolute inset-[3px] rounded-full"
            style={{
              background: currentColor
            }} />
          
        </motion.div>
      </div>
    </div>);

}
// ─── Color Picker Sidebar ─────────────────────────────────────────────────────
function ColorPickerSidebar({
  selectedColor,
  onColorSelect,
  radius,
  opacity,
  blur,
  shadow,
  hue,
  onHueChange,
  theme = 'dark'










}: {selectedColor: string;onColorSelect: (c: string) => void;radius: number;opacity: number;blur: number;shadow: number;hue: number;onHueChange: (h: number) => void;theme?: Theme;}) {
  const isLight = theme === 'light';
  const previewRadius = Math.max(4, Math.min(radius, 40));
  return (
    <Panel
      className="w-[240px] flex flex-col min-h-[368px] justify-between"
      theme={theme}>
      
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-3"
        style={{
          borderBottom: isLight ?
          '1px solid rgba(0,0,0,0.06)' :
          '1px solid rgba(255,255,255,0.05)'
        }}>
        
        {/* Avatar gradient circle */}
        <div
          className="relative w-[44px] h-[44px] rounded-full shrink-0 overflow-hidden"
          style={{
            background:
            'linear-gradient(160deg, rgba(128,74,255,0.55) 0%, rgba(61,106,255,0.3) 40%, rgba(120,120,120,0.8) 100%)'
          }}>
          
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: isLight ?
              'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.3), transparent 60%)' :
              'radial-gradient(ellipse at 35% 35%, rgba(255,255,255,0.15), transparent 60%)'
            }} />
          
          {/* Status dot */}
          <div
            className="absolute bottom-0 right-0 w-[12px] h-[12px] rounded-full"
            style={{
              background:
              'linear-gradient(180deg, rgba(248,248,248,0.92), rgba(248,248,248,0.35))',
              border: isLight ?
              '2px solid rgba(255,255,255,0.96)' :
              '2px solid rgba(10,12,20,0.96)',
              boxShadow: isLight ?
              '0 1px 3px rgba(0,0,0,0.1)' :
              '0 0 6px rgba(255,255,255,0.3)'
            }} />
          
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-[14px] font-medium leading-5 truncate"
            style={{
              color: isLight ? 'rgba(0,0,0,0.95)' : 'rgba(248,248,248,0.95)'
            }}>
            
            Select Icon
          </span>
          <span
            className="text-[12px] truncate"
            style={{
              color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(248,248,248,0.45)'
            }}>
            
            color picker
          </span>
        </div>

        {/* Chevron button */}
        <button
          className="flex items-center justify-center w-[24px] h-[24px] rounded-full shrink-0 transition-all duration-150 hover:bg-black/5 dark:hover:bg-white/10"
          style={{
            background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(63,63,63,0.12)',
            backdropFilter: 'blur(16px)',
            border: isLight ?
            '1px solid rgba(0,0,0,0.08)' :
            '1px solid rgba(255,255,255,0.4)',
            boxShadow: isLight ?
            'inset 0 1px 2px rgba(255,255,255,0.5)' :
            'inset 2px 4px 16px rgba(248,248,248,0.06)'
          }}
          aria-label="Open">
          
          <ChevronRight
            size={12}
            style={{
              color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(248,248,248,0.8)'
            }} />
          
        </button>
      </div>

      {/* Live preview box */}
      <div className="px-3 pt-3 flex-1 flex flex-col justify-center">
        <div
          className="w-full h-[88px] relative overflow-hidden flex items-center justify-center"
          style={{
            borderRadius: `${previewRadius}px`,
            border: isLight ?
            '1px solid rgba(0,0,0,0.08)' :
            '1px solid rgba(255,255,255,0.06)',
            background: isLight ? 'rgba(0,0,0,0.02)' : 'transparent'
          }}>
          
          {/* Checkerboard backdrop for opacity */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isLight ?
              'linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.03) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.03) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.03) 75%)' :
              'linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
            }} />
          
          {/* Colored fill */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 35% 40%, ${selectedColor}, ${selectedColor}cc 60%, ${selectedColor}66)`,
              opacity: opacity / 100,
              filter: blur > 0 ? `blur(${blur * 0.08}px)` : undefined,
              boxShadow:
              shadow > 0 ?
              `0 ${shadow * 0.2}px ${shadow * 0.5}px rgba(0,0,0,${shadow / 100 * 0.6})` :
              undefined
            }} />
          
          {/* Hex pill */}
          <div
            className="relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: isLight ?
              'rgba(255,255,255,0.8)' :
              'rgba(0,0,0,0.38)',
              border: isLight ?
              '1px solid rgba(0,0,0,0.08)' :
              '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}>
            
            <div
              className="w-[7px] h-[7px] rounded-full"
              style={{
                background: selectedColor
              }} />
            
            <span
              className="text-[9px] font-mono tracking-wider uppercase"
              style={{
                color: isLight ? 'rgba(0,0,0,0.72)' : 'rgba(255,255,255,0.72)'
              }}>
              
              {selectedColor}
            </span>
          </div>
        </div>
      </div>

      {/* Palette section */}
      <div className="px-3 pt-3 pb-4 flex flex-col gap-4">
        <div>
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.9px] mb-2"
            style={{
              color: isLight ? 'rgba(0,0,0,0.58)' : 'rgba(255,255,255,0.58)'
            }}>
            
            Palette
          </p>
          <div className="flex items-center gap-[7px] flex-wrap">
            {/* Spectrum swatch */}
            <button
              className="relative overflow-hidden flex-shrink-0 transition-transform active:scale-90 hover:scale-110"
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background:
                'conic-gradient(from 0deg, #FF7474, #FFA502, #FFFA65, #2ECC71, #B4AAFF, #DEB4F6, #FF7474)',
                boxShadow: isLight ?
                'inset 0 1px 2px rgba(0,0,0,0.1)' :
                'inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
              aria-label="Open color spectrum">
              
              <div
                className="absolute inset-[5px] rounded-[3px]"
                style={{
                  background: isLight ?
                  'rgba(255,255,255,0.9)' :
                  'rgba(10,12,20,0.85)',
                  boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }} />
              
            </button>

            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <motion.button
                  key={color.id}
                  onClick={() => onColorSelect(color.value)}
                  whileTap={{
                    scale: 0.85
                  }}
                  whileHover={{
                    scale: isSelected ? 1.2 : 1.1
                  }}
                  animate={{
                    scale: isSelected ? 1.2 : 1
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                  className="flex-shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    background: color.value,
                    outline: isSelected ? `2px solid ${color.value}` : 'none',
                    outlineOffset: isSelected ? '2.5px' : '0',
                    boxShadow: isSelected ?
                    isLight ?
                    `0 0 12px ${color.value}60, inset 0 1px 0 rgba(255,255,255,0.5)` :
                    `0 0 14px ${color.value}80, inset 0 1px 0 rgba(255,255,255,0.3)` :
                    isLight ?
                    'inset 0 1px 2px rgba(0,0,0,0.1)' :
                    'inset 0 1px 0 rgba(255,255,255,0.2)',
                    transition:
                    'outline 0.15s ease, outline-offset 0.15s ease, box-shadow 0.15s ease'
                  }}
                  aria-label={color.id}
                  aria-pressed={isSelected} />);


            })}
          </div>
        </div>

        {/* Interactive Spectrum */}
        <Spectrum hue={hue} onChange={onHueChange} theme={theme} />
      </div>
    </Panel>);

}
// ─── Appearance Panel ─────────────────────────────────────────────────────────
function AppearancePanel({
  theme,
  setTheme,
  selectedColor,
  setSelectedColor,
  blur,
  setBlur,
  opacity,
  setOpacity,
  radius,
  setRadius,
  shadow,
  setShadow













}: {theme: Theme;setTheme: (v: Theme) => void;selectedColor: string;setSelectedColor: (v: string) => void;blur: number;setBlur: (v: number) => void;opacity: number;setOpacity: (v: number) => void;radius: number;setRadius: (v: number) => void;shadow: number;setShadow: (v: number) => void;}) {
  const isLight = theme === 'light';
  return (
    <Panel className="w-[320px]" theme={theme}>
      <div
        className="px-4 pt-4 pb-3"
        style={{
          borderBottom: isLight ?
          '1px solid rgba(0,0,0,0.06)' :
          '1px solid rgba(255,255,255,0.04)'
        }}>
        
        <h2
          className="text-[13px] font-semibold tracking-[0.325px]"
          style={{
            color: isLight ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)'
          }}>
          
          Appearance
        </h2>
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col gap-[11px]">
        {/* Theme */}
        <ControlRow
          icon={theme === 'dark' ? Moon : Sun}
          label="Theme"
          theme={theme}>
          
          <div
            className="flex p-[3px] rounded-[11px] w-full"
            style={{
              background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.22)',
              border: isLight ?
              '1px solid rgba(0,0,0,0.06)' :
              '1px solid rgba(255,255,255,0.07)',
              boxShadow: isLight ?
              'inset 0 1px 2px rgba(0,0,0,0.05)' :
              'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}>
            
            {(['light', 'dark'] as const).map((t) =>
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-[5px] rounded-[7px] text-[11px] font-medium transition-all duration-150"
              style={{
                background:
                theme === t ?
                isLight ?
                'rgba(255,255,255,0.9)' :
                'rgba(255,255,255,0.08)' :
                'transparent',
                border:
                theme === t ?
                isLight ?
                '1px solid rgba(0,0,0,0.05)' :
                '1px solid rgba(255,255,255,0.06)' :
                '1px solid transparent',
                color:
                theme === t ?
                isLight ?
                'rgba(0,0,0,0.92)' :
                'rgba(255,255,255,0.92)' :
                isLight ?
                'rgba(0,0,0,0.4)' :
                'rgba(255,255,255,0.22)',
                boxShadow:
                theme === t ?
                isLight ?
                '0 1px 3px rgba(0,0,0,0.1)' :
                '0 2px 4px rgba(0,0,0,0.35)' :
                'none'
              }}
              aria-pressed={theme === t}>
              
                {t === 'light' ? <Sun size={11} /> : <Moon size={11} />}
                {t === 'light' ? 'Light' : 'Dark'}
              </button>
            )}
          </div>
        </ControlRow>

        {/* Color */}
        <ControlRow icon={Palette} label="Color" theme={theme}>
          <div className="flex items-center gap-[5px] w-full min-w-0 justify-between pr-0.5">
            {/* Spectrum circle */}
            <button
              className="relative overflow-hidden flex-shrink-0 transition-transform active:scale-90 hover:scale-110"
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background:
                'conic-gradient(from 0deg, #FF7474, #FFA502, #FFFA65, #2ECC71, #B4AAFF, #DEB4F6, #FF7474)',
                boxShadow: isLight ?
                'inset 0 1px 2px rgba(0,0,0,0.2)' :
                'inset 0 0 0 1px rgba(255,255,255,0.18)'
              }}
              aria-label="Open color spectrum">
              
              <div
                className="absolute inset-[3px] rounded-full"
                style={{
                  background: isLight ?
                  'rgba(255,255,255,0.95)' :
                  'rgba(10,12,20,0.95)'
                }} />
              
            </button>

            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <motion.button
                  key={color.id}
                  onClick={() => setSelectedColor(color.value)}
                  whileTap={{
                    scale: 0.82
                  }}
                  whileHover={{
                    scale: isSelected ? 1.2 : 1.15
                  }}
                  animate={{
                    scale: isSelected ? 1.2 : 1
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                  className="flex-shrink-0 rounded-full relative"
                  style={{
                    width: 18,
                    height: 18,
                    background: color.value,
                    boxShadow: isSelected ?
                    isLight ?
                    `0 0 0 1.5px rgba(255,255,255,1), 0 0 0 3px ${color.value}, 0 0 10px ${color.value}40, inset 0 1px 0 rgba(255,255,255,0.5)` :
                    `0 0 0 1.5px rgba(10,12,20,1), 0 0 0 3px ${color.value}, 0 0 14px ${color.value}80, inset 0 1px 0 rgba(255,255,255,0.28)` :
                    isLight ?
                    'inset 0 1px 2px rgba(0,0,0,0.15)' :
                    'inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.22)',
                    transition: 'box-shadow 0.18s ease'
                  }}
                  aria-label={color.id}
                  aria-pressed={isSelected} />);


            })}
          </div>
        </ControlRow>

        {/* Blur */}
        <ControlRow icon={Droplets} label="Blur" theme={theme}>
          <SliderControl
            value={blur}
            min={0}
            max={100}
            onChange={setBlur}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Opacity */}
        <ControlRow icon={Eye} label="Opacity" theme={theme}>
          <SliderControl
            value={opacity}
            min={0}
            max={100}
            onChange={setOpacity}
            unit="%"
            theme={theme} />
          
        </ControlRow>

        {/* Radius */}
        <ControlRow icon={Square} label="Radius" theme={theme}>
          <SliderControl
            value={radius}
            min={0}
            max={64}
            onChange={setRadius}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Shadow */}
        <ControlRow icon={Layers} label="Shadow" theme={theme}>
          <SliderControl
            value={shadow}
            min={0}
            max={100}
            onChange={setShadow}
            unit="px"
            theme={theme} />
          
        </ControlRow>
      </div>
    </Panel>);

}
// ─── Layout Panel ─────────────────────────────────────────────────────────────
function LayoutPanel({
  width,
  setWidth,
  height,
  setHeight,
  padding,
  setPadding,
  gap,
  setGap,
  preset,
  setPreset,
  visible,
  setVisible,
  overflow,
  setOverflow,
  theme = 'dark'
















}: {width: number;setWidth: (v: number) => void;height: number;setHeight: (v: number) => void;padding: number;setPadding: (v: number) => void;gap: number;setGap: (v: number) => void;preset: Preset;setPreset: (v: Preset) => void;visible: boolean;setVisible: (v: boolean) => void;overflow: boolean;setOverflow: (v: boolean) => void;theme?: Theme;}) {
  const isLight = theme === 'light';
  const PRESETS: {
    id: Preset;
    label: string;
    Icon: React.ElementType;
  }[] = [
  {
    id: 'mobile',
    label: 'Mobile',
    Icon: Smartphone
  },
  {
    id: 'tablet',
    label: 'Tablet',
    Icon: Tablet
  }];

  return (
    <Panel className="w-[320px]" theme={theme}>
      <div
        className="px-4 pt-4 pb-3"
        style={{
          borderBottom: isLight ?
          '1px solid rgba(0,0,0,0.06)' :
          '1px solid rgba(255,255,255,0.04)'
        }}>
        
        <h2
          className="text-[13px] font-semibold tracking-[0.325px]"
          style={{
            color: isLight ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.92)'
          }}>
          
          Layout
        </h2>
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col gap-[11px]">
        {/* Width */}
        <ControlRow icon={ArrowLeftRight} label="Width" theme={theme}>
          <NumberStepper
            value={width}
            onChange={setWidth}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Height */}
        <ControlRow icon={ArrowUpDown} label="Height" theme={theme}>
          <NumberStepper
            value={height}
            onChange={setHeight}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Padding */}
        <ControlRow icon={Maximize2} label="Padding" theme={theme}>
          <SliderControl
            value={padding}
            min={0}
            max={100}
            onChange={setPadding}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Gap */}
        <ControlRow icon={LayoutGrid} label="Gap" theme={theme}>
          <SliderControl
            value={gap}
            min={0}
            max={100}
            onChange={setGap}
            unit="px"
            theme={theme} />
          
        </ControlRow>

        {/* Preset */}
        <ControlRow icon={Monitor} label="Preset" theme={theme}>
          <div className="flex items-center gap-1.5 w-full justify-end">
            {PRESETS.map(({ id, label, Icon }) => {
              const isActive = preset === id;
              return (
                <button
                  key={id}
                  onClick={() => setPreset(id)}
                  className={`flex items-center gap-1.5 px-2.5 py-[5px] rounded-[7px] text-[11px] font-medium transition-all duration-150 ${isLight ? 'hover:bg-[rgba(0,0,0,0.04)]' : 'hover:bg-[rgba(255,255,255,0.08)]'}`}
                  style={{
                    background: isActive ?
                    isLight ?
                    'rgba(0,0,0,0.06)' :
                    'rgba(255,255,255,0.12)' :
                    isLight ?
                    'rgba(0,0,0,0.02)' :
                    'rgba(0,0,0,0.2)',
                    border: isActive ?
                    isLight ?
                    '1px solid rgba(0,0,0,0.1)' :
                    '1px solid rgba(255,255,255,0.15)' :
                    isLight ?
                    '1px solid rgba(0,0,0,0.05)' :
                    '1px solid rgba(255,255,255,0.07)',
                    color: isActive ?
                    isLight ?
                    'rgba(0,0,0,0.95)' :
                    'rgba(255,255,255,0.95)' :
                    isLight ?
                    'rgba(0,0,0,0.52)' :
                    'rgba(255,255,255,0.52)',
                    boxShadow: isActive ?
                    isLight ?
                    '0 1px 2px rgba(0,0,0,0.05)' :
                    '0 0 12px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.35)' :
                    'none'
                  }}
                  aria-pressed={isActive}>
                  
                  <Icon
                    size={11}
                    style={{
                      color: isActive ? ACCENT : undefined
                    }} />
                  
                  {label}
                </button>);

            })}
          </div>
        </ControlRow>

        {/* Visible */}
        <ControlRow icon={visible ? Eye : EyeOff} label="Visible" theme={theme}>
          <VisibleToggle
            checked={visible}
            onChange={setVisible}
            theme={theme} />
          
        </ControlRow>

        {/* Overflow */}
        <ControlRow icon={AlignJustify} label="Overflow" theme={theme}>
          <OverflowToggle
            checked={overflow}
            onChange={setOverflow}
            disabled={!visible}
            theme={theme} />
          
        </ControlRow>
      </div>
    </Panel>);

}
// ─── Dockbar ──────────────────────────────────────────────────────────────────
function Dockbar({
  theme,
  activeStyle,
  onStyleSelect




}: {theme: Theme;activeStyle: string;onStyleSelect: (style: 'glass' | 'glow' | 'skeuo' | 'clay') => void;}) {
  const isLight = theme === 'light';
  const styles = [
  {
    id: 'glass',
    label: 'Glassmorphism',
    icon: BoxIcon,
    className: isLight ?
    'bg-black/5 backdrop-blur-[16px] saturate-[180%] border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),_0_4px_12px_rgba(0,0,0,0.05)]' :
    'bg-white/10 backdrop-blur-[16px] saturate-[180%] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),_0_4px_12px_rgba(0,0,0,0.2)]'
  },
  {
    id: 'glow',
    label: 'Inner glow',
    icon: Circle,
    className: isLight ?
    'bg-[#f8f9fa] border border-[#3D6AFF]/20 shadow-[inset_0_0_20px_rgba(61,106,255,0.25),_0_4px_10px_rgba(0,0,0,0.05)]' :
    'bg-[#12141c] border border-[#3D6AFF]/30 shadow-[inset_0_0_24px_rgba(61,106,255,0.4),_0_4px_10px_rgba(0,0,0,0.4)]'
  },
  {
    id: 'skeuo',
    label: 'Skeuomorphism',
    icon: Triangle,
    className: isLight ?
    'bg-gradient-to-b from-[#ffffff] to-[#e4e7ec] border border-[#caced6] shadow-[inset_0_1px_1px_rgba(255,255,255,1),_0_4px_6px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.05)]' :
    'bg-gradient-to-b from-[#2c2f3a] to-[#161822] border border-[#3a3d4a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_4px_6px_rgba(0,0,0,0.6),_0_1px_3px_rgba(0,0,0,0.8)]'
  },
  {
    id: 'clay',
    label: 'Claymorphism',
    icon: Hexagon,
    className: isLight ?
    'bg-[#eef0f5] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.9),_inset_-4px_-4px_8px_rgba(0,0,0,0.05),_6px_6px_12px_rgba(0,0,0,0.08),_-4px_-4px_10px_rgba(255,255,255,0.8)] border border-transparent' :
    'bg-[#1e212b] shadow-[inset_4px_4px_8px_rgba(255,255,255,0.04),_inset_-4px_-4px_8px_rgba(0,0,0,0.5),_6px_6px_12px_rgba(0,0,0,0.4),_-4px_-4px_10px_rgba(255,255,255,0.02)] border border-transparent'
  }] as
  const;
  return (
    <div
      className="flex items-center gap-4 p-2 rounded-[24px] mx-auto mb-8"
      style={{
        background: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(10,12,20,0.6)',
        backdropFilter: 'blur(20px)',
        border: isLight ?
        '1px solid rgba(0,0,0,0.05)' :
        '1px solid rgba(255,255,255,0.05)',
        boxShadow: isLight ?
        '0 8px 32px rgba(0,0,0,0.05)' :
        '0 8px 32px rgba(0,0,0,0.3)'
      }}>
      
      {styles.map((style) => {
        const isActive = activeStyle === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`relative flex items-center justify-center w-14 h-14 rounded-[16px] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${isLight ? 'focus-visible:ring-offset-[#f5f6f8]' : 'focus-visible:ring-offset-[#080a10]'} ${style.className}`}
            style={{
              transform: isActive ? 'scale(1.05)' : 'scale(1)'
            }}
            aria-label={style.label}
            aria-pressed={isActive}
            title={style.label}>
            
            <style.icon
              size={24}
              strokeWidth={1.5}
              style={{
                color: isActive ?
                isLight ?
                '#000' :
                '#fff' :
                isLight ?
                'rgba(0,0,0,0.4)' :
                'rgba(255,255,255,0.4)',
                transition: 'color 0.3s ease'
              }} />
            
            {isActive &&
            <motion.div
              layoutId="dockbar-active"
              className="absolute -bottom-3 w-1.5 h-1.5 rounded-full"
              style={{
                background: isLight ? '#000' : '#fff'
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30
              }} />

            }
          </button>);

      })}
    </div>);

}
// ─── Main Export ──────────────────────────────────────────────────────────────
export function DesignInspector() {
  const [state, setState] = useState<DesignState>({
    selectedColor: '#B4AAFF',
    theme: 'dark',
    blur: 55,
    opacity: 100,
    radius: 16,
    shadow: 24,
    width: 320,
    height: 240,
    padding: 16,
    gap: 8,
    preset: 'mobile',
    visible: true,
    overflow: false,
    hue: 248,
    activeStyle: 'glass'
  });
  const update = (partial: Partial<DesignState>) =>
  setState((s) => ({
    ...s,
    ...partial
  }));
  const isLight = state.theme === 'light';
  const panels = [
  <ColorPickerSidebar
    key="color"
    selectedColor={state.selectedColor}
    onColorSelect={(v) =>
    update({
      selectedColor: v
    })
    }
    radius={state.radius}
    opacity={state.opacity}
    blur={state.blur}
    shadow={state.shadow}
    hue={state.hue}
    onHueChange={(h) =>
    update({
      hue: h
    })
    }
    theme={state.theme} />,

  <AppearancePanel
    key="appearance"
    theme={state.theme}
    setTheme={(v) =>
    update({
      theme: v
    })
    }
    selectedColor={state.selectedColor}
    setSelectedColor={(v) =>
    update({
      selectedColor: v
    })
    }
    blur={state.blur}
    setBlur={(v) =>
    update({
      blur: v
    })
    }
    opacity={state.opacity}
    setOpacity={(v) =>
    update({
      opacity: v
    })
    }
    radius={state.radius}
    setRadius={(v) =>
    update({
      radius: v
    })
    }
    shadow={state.shadow}
    setShadow={(v) =>
    update({
      shadow: v
    })
    } />,

  <LayoutPanel
    key="layout"
    width={state.width}
    setWidth={(v) =>
    update({
      width: v
    })
    }
    height={state.height}
    setHeight={(v) =>
    update({
      height: v
    })
    }
    padding={state.padding}
    setPadding={(v) =>
    update({
      padding: v
    })
    }
    gap={state.gap}
    setGap={(v) =>
    update({
      gap: v
    })
    }
    preset={state.preset}
    setPreset={(v) =>
    update({
      preset: v
    })
    }
    visible={state.visible}
    setVisible={(v) =>
    update({
      visible: v
    })
    }
    overflow={state.overflow}
    setOverflow={(v) =>
    update({
      overflow: v
    })
    }
    theme={state.theme} />];


  return (
    <div className="flex flex-col items-center w-full">
      <Dockbar
        theme={state.theme}
        activeStyle={state.activeStyle}
        onStyleSelect={(style) =>
        update({
          activeStyle: style
        })
        } />
      
      <div
        className={`flex items-start gap-4 p-8 flex-wrap justify-center rounded-[32px] border transition-colors duration-300 w-full max-w-5xl ${isLight ? 'border-[rgba(0,0,0,0.06)] bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.03),transparent_70%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]' : 'border-[rgba(255,255,255,0.04)] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_70%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'}`}>
        
        {panels.map((panel, i) =>
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.09
          }}>
          
            {panel}
          </motion.div>
        )}
      </div>
    </div>);

}