import { cn } from '../../../core/utils/cn'

export const AUTH_UI = {
  CARD: cn(
    'relative flex w-full max-w-sm flex-col justify-between p-6 md:p-8 border rounded-none shadow-xl animate-fade-in-up transition-colors',
    'bg-white border-gray-200 text-gray-900',
    'dark:bg-dark-surface dark:border-dark-border dark:text-dark-text',
  ),
  LABEL: cn(
    'block text-[11px] font-semibold uppercase tracking-widest mb-1.5',
    'text-ds-secondary dark:text-dark-secondary',
  ),
  INPUT: cn(
    'w-full h-11 px-3 rounded-none border outline-none transition-all text-sm font-medium placeholder:text-ds-secondary/50',
    'bg-surface border-ds-border text-ds-text',
    'dark:bg-dark-surface dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-secondary/50',
    'focus:ring-1 focus:ring-primary/50 focus:border-primary',
  ),
} as const
