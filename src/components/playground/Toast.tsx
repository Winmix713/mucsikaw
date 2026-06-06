import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { Appearance } from './types';
import { getTokens } from './theme';
export interface ToastState {
  id: number;
  message: string;
}
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({
      id: Date.now(),
      message
    });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  return {
    toast,
    show
  };
}
export function Toast({
  toast,
  appearance



}: {toast: ToastState | null;appearance: Appearance;}) {
  const t = getTokens(appearance, '#7c5cff');
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      aria-live="polite">
      
      <AnimatePresence>
        {toast &&
        <motion.div
          key={toast.id}
          initial={{
            opacity: 0,
            y: 16,
            scale: 0.96
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 12,
            scale: 0.97
          }}
          transition={{
            duration: 0.22,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[13px] font-medium"
          style={{
            background: appearance === 'light' ? '#0a0a0c' : '#ffffff',
            color: appearance === 'light' ? '#ffffff' : '#0a0a0c',
            boxShadow: t.shadowPanel
          }}>
          
            <span
            className="flex h-4 w-4 items-center justify-center rounded-full"
            style={{
              background: '#22c55e'
            }}>
            
              <Check size={11} strokeWidth={3} className="text-white" />
            </span>
            {toast.message}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}