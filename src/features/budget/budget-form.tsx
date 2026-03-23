import { type FormEvent, useState } from 'react'
import { LedgerInput } from '../../shared/ui/ledger-input'
import { PrimaryButton } from '../../shared/ui/primary-button'

interface BudgetFormProps {
  onSubmit: (amount: number) => void
  isEditing: boolean
  error?: string | null
}

export const BudgetForm = ({ onSubmit, isEditing, error }: BudgetFormProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) onSubmit(parsed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <LedgerInput
        label="Monto del presupuesto"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={value}
        onChange={e => setValue(e.target.value)}
        error={error ?? undefined}
      />
      <PrimaryButton type="submit">
        {isEditing ? 'Actualizar presupuesto' : 'Establecer presupuesto'}
      </PrimaryButton>
    </form>
  )
}
