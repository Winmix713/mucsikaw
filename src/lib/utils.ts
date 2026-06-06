import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — merge conditional class names with Tailwind conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (dedupes/overrides
 * conflicting Tailwind utilities so the last-declared wins).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}