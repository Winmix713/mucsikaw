import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useButtonStyle } from './useButtonStyle';
import { createDefaultStyle, createDefaultPresets, COLOR_THEMES } from './types';
import { getStoredPresets, setStoredPresets } from './presetStorage';
import type { ButtonStyle, Preset, Effect, EffectKind } from './types';
import { generateCss, generateComponent } from './css';
import { getTokens } from './theme';
import { useTheme } from '../theme/hooks';
import { useToast, Toast } from './Toast';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PreviewStage } from './PreviewStage';
import { GeneratedCss } from './GeneratedCss';
import { PresetBar } from './PresetBar';
import { ControlAside } from './ControlAside';
import { SavePresetModal } from './SavePresetModal';
// Ensure all effect kinds exist so every control row renders.
function normalize(style: ButtonStyle): ButtonStyle {
  const kinds: EffectKind[] = [
  'glass',
  'dropShadow',
  'innerShadow',
  'backgroundBlur',
  'texture',
  'noise'];

  const have = new Set(style.effects.map((e) => e.kind));
  const extra: Effect[] = [];
  if (!have.has('backgroundBlur'))
  extra.push({
    kind: 'backgroundBlur',
    enabled: false,
    mode: 'uniform',
    amount: 4
  });
  if (!have.has('texture'))
  extra.push({
    kind: 'texture',
    enabled: false,
    size: 0.5,
    radius: 4,
    clipToShape: false,
    opacity: 24
  });
  if (!have.has('noise'))
  extra.push({
    kind: 'noise',
    enabled: false,
    mode: 'mono',
    size: 0.5,
    density: 100,
    color: '#000000',
    opacity: 25
  });
  // preserve declared order, append missing, and backfill any new fields
  // added to existing effects so older saved presets stay valid.
  const ordered = kinds.
  map((k) => {
    const found = style.effects.find((e) => e.kind === k);
    if (!found) return extra.find((e) => e.kind === k);
    return backfill(found);
  }).
  filter(Boolean) as Effect[];
  return {
    ...style,
    fillColor: style.fillColor ?? '#000000',
    fillOpacity: style.fillOpacity ?? 25,
    effects: ordered
  };
}
// Backfill newly-introduced fields on effects coming from older data shapes.
function backfill(e: Effect): Effect {
  switch (e.kind) {
    case 'glass':
      return {
        ...e,
        dispersion: e.dispersion ?? 50,
        frost: e.frost ?? 4,
        splay: e.splay ?? 0,
        lightAngle: e.lightAngle ?? -45,
        lightIntensity: e.lightIntensity ?? 80
      };
    case 'dropShadow':
      return {
        ...e,
        showBehind: e.showBehind ?? true
      };
    case 'innerShadow':
      return {
        ...e,
        spread: e.spread ?? 0
      };
    case 'backgroundBlur':
      return {
        ...e,
        mode: e.mode ?? 'uniform',
        amount: e.amount ?? 4
      };
    case 'texture':
      return {
        ...e,
        size: e.size ?? 0.5,
        radius: e.radius ?? 4,
        clipToShape: e.clipToShape ?? false,
        opacity: e.opacity ?? 24
      };
    case 'noise':
      return {
        ...e,
        mode: e.mode ?? 'mono',
        size: e.size ?? 0.5,
        density: e.density ?? 100,
        color: e.color ?? '#000000',
        opacity: e.opacity ?? 25
      };
    default:
      return e;
  }
}
function presetSwatch(color: string): string {
  return `linear-gradient(180deg, ${color}, ${color})`;
}
export function ButtonPlayground() {
  const initial = useMemo(() => normalize(createDefaultStyle()), []);
  const { style, update, updateEffect, replace, undo, redo, canUndo, canRedo } =
  useButtonStyle(initial);
  // Theme appearance is owned by the global ThemeProvider — no local theme state.
  const { appearance, setAppearance } = useTheme();
  // Built-ins are regenerated from code (never persisted); persisted user
  // presets are appended after them. Built-ins carry builtIn:true.
  const [presets, setPresets] = useState<Preset[]>(() => [
  ...createDefaultPresets(),
  ...getStoredPresets()]
  );
  const [modalOpen, setModalOpen] = useState(false);
  const { toast, show } = useToast();
  // Active accent / color theme derived from current baseColor.
  const activeTheme =
  COLOR_THEMES.find(
    (c) => c.color.toLowerCase() === style.baseColor.toLowerCase()
  ) ?? COLOR_THEMES[0];
  const accent = activeTheme.color;
  const t = getTokens(appearance, accent);
  // ── Actions ────────────────────────────────────────────────────────────────
  const copy = useCallback(
    (text: string, message: string) => {
      navigator.clipboard?.writeText(text).catch(() => {});
      show(message);
    },
    [show]
  );
  const download = useCallback(
    (text: string, filename: string, message: string) => {
      const blob = new Blob([text], {
        type: 'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      show(message);
    },
    [show]
  );


  const handleApplyPreset = (preset: Preset) => {
    replace(normalize(preset.style));
    show(`Applied "${preset.name}"`);
  };
  const handleSavePreset = (name: string) => {
    setPresets((p) => {
      const next = [
      ...p,
      {
        name,
        swatch: presetSwatch(accent),
        style: {
          ...style
        }
      }];

      // Persist ONLY user presets (never the built-ins).
      setStoredPresets(next.filter((preset) => !preset.builtIn));
      return next;
    });
    setModalOpen(false);
    show(`Saved "${name}"`);
  };
  const handleDeletePreset = (index: number) => {
    setPresets((p) => {
      // Guard: built-ins are non-deletable.
      if (p[index]?.builtIn) return p;
      const next = p.filter((_, i) => i !== index);
      setStoredPresets(next.filter((preset) => !preset.builtIn));
      return next;
    });
  };
  const handleReset = () => {
    replace(normalize(createDefaultStyle()));
    show('Reset to defaults');
  };
  // Keyboard shortcuts: undo / redo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
      e.key.toLowerCase() === 'z' && e.shiftKey ||
      e.key.toLowerCase() === 'y')
      {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const rootStyle = {
    '--accent': accent,
    background: t.page,
    fontFamily: "'Geist', 'DM Sans', system-ui, -apple-system, sans-serif"
  } satisfies CSSProperties & Record<'--accent', string>;

  return (
    <div
      className="min-h-screen w-full"
      style={rootStyle}>
      
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:py-12">
        <PlaygroundHeader
          appearance={appearance}
          accent={accent}
          canUndo={canUndo}
          canRedo={canRedo}
          onSavePreset={() => setModalOpen(true)}
          onCopyCss={() => copy(generateCss(style), 'CSS copied to clipboard')}
          onCopyComponent={() =>
          copy(generateComponent(style), 'Component copied to clipboard')
          }
          onDownloadCss={() =>
          download(generateCss(style), 'button.css', 'Downloaded button.css')
          }
          onDownloadComponent={() =>
          download(
            generateComponent(style),
            'PrimaryButton.tsx',
            'Downloaded PrimaryButton.tsx'
          )
          }
          onUndo={undo}
          onRedo={redo}
          onReset={handleReset} />
        

        {/* Main panel */}
        <div
          className="relative mt-7 overflow-hidden rounded-[24px] border p-4 sm:p-5"
          style={{
            borderColor: t.border,
            background: t.panel,
            boxShadow: t.shadowPanel
          }}>
          
          {/* Atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(80% 60% at 30% -10%, ${accent}14, transparent 60%)`
            }} />
          

          <div className="relative flex flex-col gap-5 lg:flex-row">
            {/* Work area */}
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <PreviewStage
                style={style}
                appearance={appearance}
                accent={accent} />
              
              <GeneratedCss
                style={style}
                appearance={appearance}
                accent={accent}
                onCopy={(text) => copy(text, 'CSS copied to clipboard')} />
              
              <PresetBar
                presets={presets}
                appearance={appearance}
                accent={accent}
                onApply={handleApplyPreset}
                onDelete={handleDeletePreset} />
              
            </div>

            {/* Control aside */}
            <ControlAside
            style={style}
            appearance={appearance}
            accent={accent}
            onAppearanceChange={setAppearance}
            onUpdate={update}
            onUpdateEffect={updateEffect} />
            
          </div>
        </div>
      </div>

      <SavePresetModal
        open={modalOpen}
        appearance={appearance}
        accent={accent}
        swatch={presetSwatch(accent)}
        onClose={() => setModalOpen(false)}
        onSave={handleSavePreset} />
      

      <Toast toast={toast} appearance={appearance} />
    </div>);

}