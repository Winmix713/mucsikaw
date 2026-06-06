<!DOCTYPE html>
<html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Button Playground</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
</head>
<body class="min-h-screen w-full bg-[#040406] text-white antialiased" style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <main class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
    <header class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div class="">
        <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-normal text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]"></span>
          Live visual editor
        </div>
        <h1 class="text-2xl font-medium tracking-tight text-white sm:text-3xl">Button Playground</h1>
        <p class="mt-1 max-w-xl text-sm font-normal text-white/45">Design, save, and export advanced button styles with layered effects, glass, shadows, noise, and texture.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button onclick="openModal()" class="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-white/75 transition hover:border-white/15 hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:diskette-linear" class="text-sm text-white/55 group-hover:text-white"></iconify-icon>
          Save preset
        </button>
        <button onclick="copyGeneratedCss()" class="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-white/75 transition hover:border-white/15 hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:copy-linear" class="text-sm text-white/55 group-hover:text-white"></iconify-icon>
          Copy CSS
        </button>
        <button onclick="copyComponent()" class="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-white/75 transition hover:border-white/15 hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:copy-linear" class="text-sm text-white/55 group-hover:text-white"></iconify-icon>
          Component
        </button>
        <button onclick="downloadCss()" class="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-white/75 transition hover:border-white/15 hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:download-minimalistic-linear" class="text-sm text-white/55 group-hover:text-white"></iconify-icon>
          CSS
        </button>
        <button onclick="downloadComponent()" class="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-medium text-white/75 transition hover:border-white/15 hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:download-linear" class="text-sm text-white/55 group-hover:text-white"></iconify-icon>
          Component
        </button>
        <button onclick="showToast('Nothing to undo')" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/40 transition hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:undo-left-linear" class="text-base"></iconify-icon>
        </button>
        <button onclick="showToast('Nothing to redo')" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-white/40 transition hover:bg-white/[0.075] hover:text-white">
          <iconify-icon icon="solar:undo-right-linear" class="text-base"></iconify-icon>
        </button>
      </div>
    </header>

    <section class="relative grid gap-6 rounded-3xl border border-white/[0.06] bg-[#0a0a0c] p-3 shadow-2xl shadow-black/60 sm:p-4 lg:grid-cols-[1fr_20rem] lg:p-6" style="background-image: radial-gradient(circle at left top, rgba(124, 92, 255, 0.08), transparent 34rem), radial-gradient(circle at right bottom, rgba(56, 189, 248, 0.055), transparent 28rem);">
      <div class="flex min-w-0 flex-col gap-4">
        <section class="relative flex min-h-[26rem] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/[0.06] bg-[#060608] transition-colors duration-300 sm:min-h-[30rem]" style="background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 0.0625rem, transparent 0.0625rem); background-size: 1rem 1rem" id="stage">
          
          
          
          

          <button id="previewButton" class="relative z-10 px-6 py-3 text-sm font-medium transition active:translate-y-px" style="color: rgb(255, 255, 255); border-radius: 0.875rem; background: linear-gradient(rgb(156, 124, 255), rgb(94, 62, 225)); box-shadow: rgba(255, 255, 255, 0.26) 0px 1px 0px inset, rgba(0, 0, 0, 0.18) 0px -12px 24px inset, rgba(124, 92, 255, 0.35) 0px 16px 42px, rgba(0, 0, 0, 0.28) 0px 3px 12px; backdrop-filter: blur(14px) saturate(148%); border: 1px solid rgba(255, 255, 255, 0.18);">
            Primary Action
          </button>

          <button onclick="toggleCss()" class="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#08080a]/90 text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur transition hover:text-white">
            <iconify-icon icon="solar:settings-linear" class="text-base"></iconify-icon>
          </button>

          <div id="warningBox" class="absolute bottom-3 left-3 right-3 z-20 hidden items-start gap-2 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-xs font-normal text-amber-100 backdrop-blur" style="display: none;">
            <iconify-icon icon="solar:danger-triangle-linear" class="mt-0.5 shrink-0 text-sm"></iconify-icon>
            <span>Layer blur can reduce text clarity. Prefer background blur for glass styles.</span>
          </div>
        </section>

        <section id="cssPanel" class="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060608]">
          <div class="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <span class="font-mono text-xs font-normal uppercase tracking-wider text-white/35">Generated CSS</span>
            <button onclick="copyGeneratedCss()" class="flex items-center gap-1.5 text-xs font-normal text-white/50 transition hover:text-white">
              <iconify-icon icon="solar:copy-linear" class="text-sm"></iconify-icon>
              Copy
            </button>
          </div>
          <pre id="generatedCss" class="max-h-72 overflow-auto px-4 py-4 font-mono text-xs leading-relaxed text-white/75">.primary-button {
  color: #ffffff;
  border-radius: 0.875rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: linear-gradient(rgb(156, 124, 255), rgb(94, 62, 225));
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: rgba(255, 255, 255, 0.26) 0px 1px 0px inset, rgba(0, 0, 0, 0.18) 0px -12px 24px inset, rgba(124, 92, 255, 0.35) 0px 16px 42px, rgba(0, 0, 0, 0.28) 0px 3px 12px;
  backdrop-filter: blur(14px) saturate(148%);
  transition: transform 150ms ease, box-shadow 150ms ease;
}</pre>
        </section>

        <section class="rounded-2xl border border-white/[0.06] bg-[#060608] p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-medium text-white/90">Saved presets <span id="presetCount" class="text-white/40">(3)</span></h2>
            <div class="flex items-center gap-3 text-white/40">
              <button onclick="showToast('Import simulated')" class="transition hover:text-white">
                <iconify-icon icon="solar:upload-minimalistic-linear" class="text-base"></iconify-icon>
              </button>
              <button onclick="exportPresets()" class="transition hover:text-white">
                <iconify-icon icon="solar:download-minimalistic-linear" class="text-base"></iconify-icon>
              </button>
            </div>
          </div>
          <div id="presetList" class="flex flex-wrap gap-2">
            <button onclick="loadPreset('Aurora')" class="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-2 py-1.5 transition hover:bg-white/[0.075]">
              <span class="h-5 w-8 rounded-md" style="background: linear-gradient(180deg, #8b74ff, #7051ff); box-shadow: 0 8px 20px rgba(124,92,255,0.32);"></span>
              <span class="text-xs font-normal text-white/75">Aurora</span>
              <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xs text-white/30 group-hover:text-white/70"></iconify-icon>
            </button>
            <button onclick="loadPreset('Ocean')" class="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-2 py-1.5 transition hover:bg-white/[0.075]">
              <span class="h-5 w-8 rounded-md" style="background: linear-gradient(180deg, #38bdf8, #2563eb); box-shadow: 0 8px 20px rgba(56,189,248,0.24);"></span>
              <span class="text-xs font-normal text-white/75">Ocean</span>
              <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xs text-white/30 group-hover:text-white/70"></iconify-icon>
            </button>
            <button onclick="loadPreset('Ember')" class="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-2 py-1.5 transition hover:bg-white/[0.075]">
              <span class="h-5 w-8 rounded-md" style="background: linear-gradient(180deg, #fb7185, #f97316); box-shadow: 0 8px 20px rgba(251,113,133,0.24);"></span>
              <span class="text-xs font-normal text-white/75">Ember</span>
              <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xs text-white/30 group-hover:text-white/70"></iconify-icon>
            </button>
          </div>
        </section>
      </div>

      <aside class="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0a0a0c]/95 p-5 shadow-xl shadow-black/40">
        <section>
          <h3 class="mb-3 text-sm font-medium text-white/90">Color theme</h3>
          <div id="colorThemes" class="grid grid-cols-4 gap-x-2 gap-y-4">
            <button data-color="#7c5cff" data-ring="rgba(124,92,255,0.95)" data-name="Violet" class="color-dot relative mx-auto flex h-6 w-6 items-center justify-center rounded-full transition" style="background: #7c5cff; box-shadow: 0 0 0 0.125rem rgba(124,92,255,0.95), 0 0 0 0.25rem #0a0a0c;">
              <iconify-icon icon="solar:check-read-linear" class="text-xs text-white"></iconify-icon>
            </button>
            <button data-color="#2563eb" data-ring="rgba(37,99,235,0.95)" data-name="Blue" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #2563eb;"></button>
            <button data-color="#06b6d4" data-ring="rgba(6,182,212,0.95)" data-name="Cyan" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #06b6d4;"></button>
            <button data-color="#10b981" data-ring="rgba(16,185,129,0.95)" data-name="Emerald" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #10b981;"></button>
            <button data-color="#f59e0b" data-ring="rgba(245,158,11,0.95)" data-name="Amber" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #f59e0b;"></button>
            <button data-color="#f97316" data-ring="rgba(249,115,22,0.95)" data-name="Orange" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #f97316;"></button>
            <button data-color="#fb7185" data-ring="rgba(251,113,133,0.95)" data-name="Rose" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #fb7185;"></button>
            <button data-color="#d946ef" data-ring="rgba(217,70,239,0.95)" data-name="Fuchsia" class="color-dot relative mx-auto h-6 w-6 rounded-full transition" style="background: #d946ef;"></button>
          </div>
        </section>

        <section>
          <h3 class="mb-3 text-sm font-medium text-white/90">Border radius</h3>
          <div class="flex gap-1 rounded-xl border border-white/[0.06] bg-[#060608] p-1">
            <button onclick="setRadius('0.375rem', this)" class="radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70">
              <span class="h-5 w-5 border-l-2 border-t-2 border-current" style="border-top-left-radius: 0.25rem;"></span>
            </button>
            <button onclick="setRadius('0.75rem', this)" class="radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70">
              <span class="h-5 w-5 border-l-2 border-t-2 border-current" style="border-top-left-radius: 0.5rem;"></span>
            </button>
            <button onclick="setRadius('0.875rem', this)" class="radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition">
              <span class="h-5 w-5 border-l-2 border-t-2 border-current" style="border-top-left-radius: 0.875rem;"></span>
            </button>
            <button onclick="setRadius('9999rem', this)" class="radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70">
              <span class="h-5 w-5 rounded-tl-full border-l-2 border-t-2 border-current"></span>
            </button>
          </div>
        </section>

        <section>
          <h3 class="mb-3 text-sm font-medium text-white/90">Appearance</h3>
          <div class="flex gap-1 rounded-xl border border-white/[0.06] bg-[#060608] p-1">
            <button id="lightBtn" onclick="setAppearance('light')" class="flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70">
              <iconify-icon icon="solar:sun-2-linear" class="text-base"></iconify-icon>
            </button>
            <button id="darkBtn" onclick="setAppearance('dark')" class="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition">
              <iconify-icon icon="solar:moon-linear" class="text-base"></iconify-icon>
            </button>
          </div>
        </section>

        <section class="-mx-5 flex-1 border-t border-white/[0.06] px-5 pt-4">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-medium text-white/90">Effects</h3>
            <div class="relative">
              <button onclick="toggleEffectsMenu()" class="flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.055] hover:text-white">
                <iconify-icon icon="solar:add-circle-linear" class="text-base"></iconify-icon>
              </button>
              <div id="effectsMenu" class="absolute right-0 top-9 z-30 hidden w-56 rounded-2xl border border-white/10 bg-[#0a0a0c] p-1.5 shadow-2xl shadow-black/70">
                <button onclick="addEffect('Inner shadow')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:layers-minimalistic-linear" class="text-sm text-white/45"></iconify-icon>
                  Inner shadow
                </button>
                <button onclick="addEffect('Drop shadow')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:dropper-3-linear" class="text-sm text-white/45"></iconify-icon>
                  Drop shadow
                </button>
                <button onclick="addEffect('Background blur')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:waterdrops-linear" class="text-sm text-white/45"></iconify-icon>
                  Background blur
                </button>
                <button onclick="addEffect('Glass')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:sparkles-linear" class="text-sm text-white/45"></iconify-icon>
                  Glass
                </button>
                <button onclick="addEffect('Texture')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:widget-2-linear" class="text-sm text-white/45"></iconify-icon>
                  Texture
                </button>
                <button onclick="addEffect('Noise')" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-normal text-white/75 transition hover:bg-white/[0.055] hover:text-white">
                  <iconify-icon icon="solar:stars-linear" class="text-sm text-white/45"></iconify-icon>
                  Noise
                </button>
              </div>
            </div>
          </div>

          <div id="effectsList" class="flex flex-col gap-2">
            <article class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <button onclick="toggleEffectEditor(this)" class="flex w-full items-center justify-between">
                <span class="flex items-center gap-2 text-xs font-medium text-white/80">
                  <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.055] text-white/55">
                    <iconify-icon icon="solar:sparkles-linear" class="text-sm"></iconify-icon>
                  </span>
                  Glass
                </span>
                <span class="flex items-center gap-2 text-white/40">
                  <iconify-icon icon="solar:eye-linear" class="text-sm"></iconify-icon>
                  <iconify-icon icon="solar:alt-arrow-down-linear" class="text-sm"></iconify-icon>
                </span>
              </button>
              <div class="effect-editor mt-3 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-2.5 py-1 text-sm font-normal text-white/85">
                    Glass
                    <iconify-icon icon="solar:alt-arrow-down-linear" class="text-xs text-white/40"></iconify-icon>
                  </div>
                  <div class="flex items-center gap-2 text-white/45">
                    <iconify-icon icon="solar:dropper-3-linear" class="text-sm"></iconify-icon>
                    <iconify-icon icon="solar:close-circle-linear" class="text-sm"></iconify-icon>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="w-16 shrink-0 text-xs font-normal text-white/45">Light</span>
                  <div class="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.045]">
                    <span class="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" style="transform: translate(0.875rem, -0.5rem);"></span>
                  </div>
                  <div class="flex flex-1 flex-col gap-1.5">
                    <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                      <input value="325" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                      <span class="text-xs text-white/40">°</span>
                    </div>
                    <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                      <input value="72" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                      <span class="text-xs text-white/40">%</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-white/55">Refraction</span>
                    <span id="refractionValue" class="font-mono text-white/45">62</span>
                  </div>
                  <button onclick="moveKnob(this, event)" class="relative h-7 rounded-lg border border-white/10 bg-white/[0.035] px-2">
                    <span class="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10"></span>
                    <span class="absolute left-2 top-1/2 h-1 w-[62%] -translate-y-1/2 rounded-full bg-[#7c5cff]"></span>
                    <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/30 bg-white shadow-lg" style="left: 62%;"></span>
                  </button>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-white/55">Depth</span>
                    <span class="font-mono text-white/45">44</span>
                  </div>
                  <div class="relative h-7 rounded-lg border border-white/10 bg-white/[0.035] px-2">
                    <span class="absolute left-2 right-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10"></span>
                    <span class="absolute left-2 top-1/2 h-1 w-[44%] -translate-y-1/2 rounded-full bg-white/35"></span>
                    <span class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/25 bg-white/90 shadow-lg" style="left: 44%;"></span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="w-16 shrink-0 text-xs font-normal text-white/45">Tint</span>
                  <label class="flex flex-1 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                    <span class="h-3.5 w-3.5 rounded border border-white/30" style="background: #7c5cff;"></span>
                    <input value="7C5CFF" class="w-full bg-transparent font-mono text-xs uppercase tracking-wide text-white/85 outline-none">
                  </label>
                  <div class="flex w-16 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                    <input value="18" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                    <span class="text-xs text-white/40">%</span>
                  </div>
                </div>

                <label class="flex cursor-pointer items-center gap-2">
                  <span class="flex h-4 w-4 items-center justify-center rounded border border-transparent bg-[#7c5cff]">
                    <iconify-icon icon="solar:check-read-linear" class="text-xs text-white"></iconify-icon>
                  </span>
                  <span class="text-xs font-normal text-white/65">Auto highlight border</span>
                </label>
              </div>
            </article>

            <article class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <button onclick="toggleEffectEditor(this)" class="flex w-full items-center justify-between">
                <span class="flex items-center gap-2 text-xs font-medium text-white/80">
                  <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.055] text-white/55">
                    <iconify-icon icon="solar:dropper-3-linear" class="text-sm"></iconify-icon>
                  </span>
                  Drop shadow
                </span>
                <span class="flex items-center gap-2 text-white/40">
                  <iconify-icon icon="solar:eye-linear" class="text-sm"></iconify-icon>
                  <iconify-icon icon="solar:alt-arrow-down-linear" class="text-sm"></iconify-icon>
                </span>
              </button>
              <div class="effect-editor mt-3 hidden flex-col gap-3">
                <div class="grid grid-cols-2 gap-2 rounded-xl border border-white/10 p-2">
                  <div class="flex h-16 items-center justify-center rounded-lg bg-white">
                    <div class="h-7 w-16 rounded-lg" style="background:#7c5cff; box-shadow: 0 14px 30px rgba(124,92,255,0.4);"></div>
                  </div>
                  <div class="flex h-16 items-center justify-center rounded-lg bg-[#0a0a0c]">
                    <div class="h-7 w-16 rounded-lg" style="background:#7c5cff; box-shadow: 0 14px 30px rgba(124,92,255,0.4);"></div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-16 shrink-0 text-xs text-white/45">Position</span>
                  <div class="flex w-20 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                    <span class="text-xs text-white/35">X</span>
                    <input value="0" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                  </div>
                  <div class="flex w-20 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                    <span class="text-xs text-white/35">Y</span>
                    <input value="16" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-16 shrink-0 text-xs text-white/45">Blur</span>
                  <div class="flex flex-1 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1">
                    <iconify-icon icon="solar:widget-2-linear" class="text-xs text-white/35"></iconify-icon>
                    <input value="42" class="w-full bg-transparent text-right font-mono text-xs text-white/85 outline-none">
                  </div>
                </div>
              </div>
            </article>

            <article class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
              <button onclick="toggleEffectEditor(this)" class="flex w-full items-center justify-between">
                <span class="flex items-center gap-2 text-xs font-medium text-white/80">
                  <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.055] text-white/55">
                    <iconify-icon icon="solar:stars-linear" class="text-sm"></iconify-icon>
                  </span>
                  Noise
                </span>
                <span class="flex items-center gap-2 text-white/40">
                  <iconify-icon icon="solar:eye-linear" class="text-sm"></iconify-icon>
                  <iconify-icon icon="solar:alt-arrow-down-linear" class="text-sm"></iconify-icon>
                </span>
              </button>
            </article>
          </div>
        </section>
      </aside>
    </section>
  </main>

  <div id="modalBackdrop" class="fixed inset-0 z-40 hidden items-center justify-center bg-black/70 px-4 backdrop-blur-md" style="display: none;">
    <section class="bg-[#0a0a0c] w-full max-w-md border-white/10 border rounded-3xl pt-5 pr-5 pb-5 pl-5 shadow-2xl">
      <div class="mb-5 flex items-start justify-between">
        <div class="">
          <h2 class="text-xl font-medium tracking-tight text-white">Save preset</h2>
          <p class="mt-1 text-sm text-white/45">Store the current button style locally in this demo.</p>
        </div>
        <button onclick="closeModal()" class="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/[0.06] hover:text-white">
          <iconify-icon icon="solar:close-circle-linear" class="text-lg"></iconify-icon>
        </button>
      </div>
      <label class="mb-2 block text-xs font-medium text-white/55">Preset name</label>
      <input id="presetName" value="Preset 4" class="mb-5 w-full rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20 focus:bg-white/[0.06]">
      <div class="flex justify-end gap-2">
        <button onclick="closeModal()" class="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white">Cancel</button>
        <button onclick="savePreset()" class="rounded-xl border border-white/10 bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90">Save preset</button>
      </div>
    </section>
  </div>

  <div id="toast" class="fixed bottom-5 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#101014]/95 px-4 py-2 text-xs font-medium text-white/80 shadow-2xl shadow-black/60 backdrop-blur">
    <iconify-icon icon="solar:check-circle-linear" class="text-sm text-emerald-300"></iconify-icon>
    <span id="toastText" class="">Copied</span>
  </div>

  <script class="">
    const state = {
      color: "#7c5cff",
      radius: "0.875rem",
      appearance: "dark",
      presetCount: 3
    };

    const preview = document.getElementById("previewButton");
    const cssOut = document.getElementById("generatedCss");
    const stage = document.getElementById("stage");

    function hexToRgb(hex) {
      const clean = hex.replace("#", "");
      const bigint = parseInt(clean, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
      };
    }

    function shade(hex, amount) {
      const c = hexToRgb(hex);
      const r = Math.max(0, Math.min(255, c.r + amount));
      const g = Math.max(0, Math.min(255, c.g + amount));
      const b = Math.max(0, Math.min(255, c.b + amount));
      return `rgb(${r}, ${g}, ${b})`;
    }

    function updateButton() {
      const rgb = hexToRgb(state.color);
      const lighter = shade(state.color, 32);
      const darker = shade(state.color, -30);
      preview.style.borderRadius = state.radius;
      preview.style.background = `linear-gradient(180deg, ${lighter}, ${darker})`;
      preview.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.26), inset 0 -12px 24px rgba(0,0,0,0.18), 0 16px 42px rgba(${rgb.r},${rgb.g},${rgb.b},0.35), 0 3px 12px rgba(0,0,0,0.28)`;
      preview.style.backdropFilter = "blur(14px) saturate(148%)";
      preview.style.border = "1px solid rgba(255,255,255,0.18)";
      updateCss();
    }

    function updateCss() {
      cssOut.textContent =
`.primary-button {
  color: #ffffff;
  border-radius: ${state.radius};
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${preview.style.background};
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: ${preview.style.boxShadow};
  backdrop-filter: blur(14px) saturate(148%);
  transition: transform 150ms ease, box-shadow 150ms ease;
}`;
    }

    function setRadius(radius, el) {
      state.radius = radius;
      document.querySelectorAll(".radius-btn").forEach(btn => {
        btn.className = "radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70";
      });
      el.className = "radius-btn flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition";
      updateButton();
      showToast("Radius updated");
    }

    document.querySelectorAll(".color-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        state.color = dot.dataset.color;
        document.querySelectorAll(".color-dot").forEach(d => {
          d.innerHTML = "";
          d.style.boxShadow = "";
        });
        dot.innerHTML = '<iconify-icon icon="solar:check-read-linear" class="text-xs text-white"></iconify-icon>';
        dot.style.boxShadow = `0 0 0 0.125rem ${dot.dataset.ring}, 0 0 0 0.25rem #0a0a0c`;
        updateButton();
        showToast(`${dot.dataset.name} theme selected`);
      });
    });

    function setAppearance(mode) {
      state.appearance = mode;
      const lightBtn = document.getElementById("lightBtn");
      const darkBtn = document.getElementById("darkBtn");

      if (mode === "light") {
        stage.style.backgroundColor = "#f1f1f4";
        stage.style.backgroundImage = "radial-gradient(circle, rgba(0,0,0,0.06) 0.0625rem, transparent 0.0625rem)";
        lightBtn.className = "flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition";
        darkBtn.className = "flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70";
      } else {
        stage.style.backgroundColor = "#060608";
        stage.style.backgroundImage = "radial-gradient(circle, rgba(255,255,255,0.06) 0.0625rem, transparent 0.0625rem)";
        darkBtn.className = "flex h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition";
        lightBtn.className = "flex h-10 flex-1 items-center justify-center rounded-lg border border-transparent text-white/40 transition hover:text-white/70";
      }

      stage.style.backgroundSize = "1rem 1rem";
      showToast(mode === "light" ? "Light stage enabled" : "Dark stage enabled");
    }

    function toggleCss() {
      const panel = document.getElementById("cssPanel");
      panel.classList.toggle("hidden");
    }

    function toggleEffectsMenu() {
      document.getElementById("effectsMenu").classList.toggle("hidden");
    }

    function toggleEffectEditor(button) {
      const article = button.closest("article");
      const editor = article.querySelector(".effect-editor");
      if (!editor) return;
      editor.classList.toggle("hidden");
      editor.classList.toggle("flex");
    }

    function addEffect(name) {
      const list = document.getElementById("effectsList");
      const icon = name === "Glass" ? "solar:sparkles-linear" : name === "Texture" ? "solar:widget-2-linear" : name === "Noise" ? "solar:stars-linear" : name === "Background blur" ? "solar:waterdrops-linear" : "solar:dropper-3-linear";
      const item = document.createElement("article");
      item.className = "rounded-2xl border border-white/10 bg-white/[0.035] p-3";
      item.innerHTML = `
        <button onclick="toggleEffectEditor(this)" class="flex w-full items-center justify-between">
          <span class="flex items-center gap-2 text-xs font-medium text-white/80">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.055] text-white/55">
              <iconify-icon icon="${icon}" class="text-sm"></iconify-icon>
            </span>
            ${name}
          </span>
          <span class="flex items-center gap-2 text-white/40">
            <iconify-icon icon="solar:eye-linear" class="text-sm"></iconify-icon>
            <iconify-icon icon="solar:trash-bin-minimalistic-linear" onclick="this.closest('article').remove(); event.stopPropagation(); showToast('Effect removed')" class="text-sm hover:text-white"></iconify-icon>
          </span>
        </button>
      `;
      list.appendChild(item);
      document.getElementById("effectsMenu").classList.add("hidden");
      document.getElementById("warningBox").classList.remove("hidden");
      document.getElementById("warningBox").classList.add("flex");
      showToast(`${name} added`);
    }

    function openModal() {
      const modal = document.getElementById("modalBackdrop");
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    function closeModal() {
      const modal = document.getElementById("modalBackdrop");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    function savePreset() {
      const name = document.getElementById("presetName").value || `Preset ${state.presetCount + 1}`;
      const rgb = hexToRgb(state.color);
      state.presetCount++;
      document.getElementById("presetCount").textContent = `(${state.presetCount})`;

      const button = document.createElement("button");
      button.className = "group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-2 py-1.5 transition hover:bg-white/[0.075]";
      button.setAttribute("onclick", `loadPreset('${name.replace(/'/g, "")}')`);
      button.innerHTML = `
        <span class="h-5 w-8 rounded-md" style="background: linear-gradient(180deg, ${shade(state.color, 32)}, ${shade(state.color, -30)}); box-shadow: 0 8px 20px rgba(${rgb.r},${rgb.g},${rgb.b},0.28);"></span>
        <span class="text-xs font-normal text-white/75">${name}</span>
        <iconify-icon icon="solar:trash-bin-minimalistic-linear" class="text-xs text-white/30 group-hover:text-white/70"></iconify-icon>
      `;

      document.getElementById("presetList").appendChild(button);
      closeModal();
      showToast(`Preset “${name}” saved`);
    }

    function loadPreset(name) {
      showToast(`Loaded preset “${name}”`);
    }

    function showToast(message) {
      const toast = document.getElementById("toast");
      document.getElementById("toastText").textContent = message;
      toast.classList.remove("hidden");
      toast.classList.add("flex");
      clearTimeout(window.toastTimer);
      window.toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
        toast.classList.remove("flex");
      }, 2200);
    }

    async function copyGeneratedCss() {
      const text = cssOut.textContent;
      try {
        await navigator.clipboard.writeText(text);
        showToast("CSS copied to clipboard");
      } catch (e) {
        showToast("Copy unavailable");
      }
    }

    async function copyComponent() {
      const component = `export function PrimaryButton() {
  return <button className="primary-button">Primary Action</button>;
}`;
      try {
        await navigator.clipboard.writeText(component);
        showToast("Component copied");
      } catch (e) {
        showToast("Copy unavailable");
      }
    }

    function downloadFile(name, content) {
      const a = document.createElement("a");
      a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    function downloadCss() {
      downloadFile("button-styles.css", cssOut.textContent);
      showToast("CSS downloaded");
    }

    function downloadComponent() {
      downloadFile("PrimaryButton.tsx", `export function PrimaryButton() {
  return <button className="primary-button">Primary Action</button>;
}`);
      showToast("Component downloaded");
    }

    function exportPresets() {
      downloadFile("presets.json", JSON.stringify({ presets: state.presetCount }, null, 2));
      showToast("Presets exported");
    }

    function moveKnob(el, event) {
      const value = Math.max(8, Math.min(92, Math.round((event.offsetX / el.clientWidth) * 100)));
      const fill = el.querySelectorAll("span")[1];
      const knob = el.querySelectorAll("span")[2];
      fill.style.width = value + "%";
      knob.style.left = value + "%";
      document.getElementById("refractionValue").textContent = value;
      showToast("Refraction adjusted");
    }

    document.addEventListener("click", (event) => {
      const menu = document.getElementById("effectsMenu");
      if (!event.target.closest("#effectsMenu") && !event.target.closest("[onclick='toggleEffectsMenu()']")) {
        menu.classList.add("hidden");
      }
    });

    updateButton();
  </script>

</body></html>