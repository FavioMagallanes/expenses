import { forwardRef } from 'react'

interface LedgerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const LedgerInput = forwardRef<HTMLInputElement, LedgerInputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      )}
      <input
        ref={ref}
        className={`
          w-full bg-surface-container-low px-3 py-2.5 text-sm
          border-0 border-b border-b-primary
          outline-none focus:border-b-2 transition-all duration-150
          placeholder:text-gray-400
          ${error ? 'border-b-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  ),
)

LedgerInput.displayName = 'LedgerInput'
