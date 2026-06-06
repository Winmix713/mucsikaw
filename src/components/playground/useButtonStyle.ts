import { useCallback, useMemo, useRef, useState } from 'react';
import type { ButtonStyle, Effect, EffectKind } from './types';
import { createDefaultStyle } from './types';

interface History {
  past: ButtonStyle[];
  present: ButtonStyle;
  future: ButtonStyle[];
}

const MAX_HISTORY = 50;

export function useButtonStyle(initial?: ButtonStyle) {
  const [history, setHistory] = useState<History>(() => ({
    past: [],
    present: initial ?? createDefaultStyle(),
    future: []
  }));

  // Debounce coalescing for slider drags so undo steps stay meaningful.
  const lastCommitRef = useRef<number>(0);

  const commit = useCallback((next: ButtonStyle, coalesce = false) => {
    setHistory((h) => {
      const now = Date.now();
      const shouldCoalesce = coalesce && now - lastCommitRef.current < 350;
      lastCommitRef.current = now;
      const past = shouldCoalesce ?
      h.past :
      [...h.past, h.present].slice(-MAX_HISTORY);
      return { past, present: next, future: [] };
    });
  }, []);

  const update = useCallback(
    (partial: Partial<ButtonStyle>, coalesce = false) => {
      setHistory((h) => {
        const next = { ...h.present, ...partial };
        const now = Date.now();
        const shouldCoalesce = coalesce && now - lastCommitRef.current < 350;
        lastCommitRef.current = now;
        const past = shouldCoalesce ?
        h.past :
        [...h.past, h.present].slice(-MAX_HISTORY);
        return { past, present: next, future: [] };
      });
    },
    []
  );

  const updateEffect = useCallback(
    (kind: EffectKind, patch: Partial<Effect>, coalesce = false) => {
      setHistory((h) => {
        const effects = h.present.effects.map((e) =>
        e.kind === kind ? { ...e, ...patch } as Effect : e
        );
        const next = { ...h.present, effects };
        const now = Date.now();
        const shouldCoalesce = coalesce && now - lastCommitRef.current < 350;
        lastCommitRef.current = now;
        const past = shouldCoalesce ?
        h.past :
        [...h.past, h.present].slice(-MAX_HISTORY);
        return { past, present: next, future: [] };
      });
    },
    []
  );

  const replace = useCallback((next: ButtonStyle) => {
    setHistory((h) => ({
      past: [...h.past, h.present].slice(-MAX_HISTORY),
      present: next,
      future: []
    }));
  }, []);

  const undo = useCallback(() => {
    let didUndo = false;
    setHistory((h) => {
      if (h.past.length === 0) return h;
      didUndo = true;
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future]
      };
    });
    return didUndo;
  }, []);

  const redo = useCallback(() => {
    let didRedo = false;
    setHistory((h) => {
      if (h.future.length === 0) return h;
      didRedo = true;
      const next = h.future[0];
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1)
      };
    });
    return didRedo;
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return useMemo(
    () => ({
      style: history.present,
      update,
      updateEffect,
      replace,
      commit,
      undo,
      redo,
      canUndo,
      canRedo
    }),
    [
    history.present,
    update,
    updateEffect,
    replace,
    commit,
    undo,
    redo,
    canUndo,
    canRedo]

  );
}