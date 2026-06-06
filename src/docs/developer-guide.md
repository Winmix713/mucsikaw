# Developer Guide

## Add a new control component

1. Create the reusable control in `src/components/controls/`.
2. Export strongly typed props (avoid `any`).
3. Keep control state local and bubble committed changes with callbacks.
4. Wire the control into `src/components/playground/ControlAside.tsx`.
5. Update shared domain types in `src/components/playground/types.ts` when needed.

## Add a new design token

1. Add token(s) in `src/components/theme/tokens.ts`.
2. Keep semantic naming (`--bg-*`, `--text-*`, `--border-*`, `--sh-*`).
3. Provide values for both `LIGHT_TOKENS` and `DARK_TOKENS`.
4. Ensure token composition stays centralized in `resolveTokens()`.
5. Consume the token through CSS variables in UI components.
