import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility to merge Tailwind classes efficiently.
 * Combines clsx for conditional logic and tailwind-merge to handle overrides.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
