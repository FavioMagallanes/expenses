import { type FormEvent, useState } from 'react'

interface BudgetFormProps {
  onSubmit: (amount: number) => void
  isEditing: boolean
  error?: string | null
}

export const BudgetForm = ({ onSubmit, isEditing, error }: BudgetFormProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(value.replace(/,/g, '.'))
    if (!isNaN(parsed)) onSubmit(parsed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex flex-col gap-1 flex-1 max-w-xs">
        <label className="text-xs font-semibold text-ds-secondary uppercase tracking-wider px-0.5">
          Establecer objetivo
        </label>
        <div
          className={`flex items-center border rounded-lg bg-surface px-3 py-2 gap-2 transition-all focus-within:ring-1 focus-within:ring-primary/50 ${error ? 'border-red-400' : 'border-ds-border'}`}
        >
          <span className="text-ds-secondary text-sm">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full bg-transparent border-none p-0 outline-none text-ds-text font-medium text-sm"
          />
          <span className="material-symbols-outlined text-ds-secondary text-base">
            stylus_pencil
          </span>
        </div>
        {error && <p className="text-xs text-red-500 px-0.5">{error}</p>}
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors h-10.5"
      >
        {isEditing ? 'Actualizar' : 'Guardar'}
      </button>
    </form>
  )
}
