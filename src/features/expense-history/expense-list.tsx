import { ExpenseItem } from './expense-item'
import type { Expense } from '../../types'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
  onAddFirst?: () => void
}

export const ExpenseList = ({ expenses, onEdit, onDelete, onAddFirst }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center border border-ds-border rounded-xl">
        <span className="material-symbols-outlined text-4xl text-ds-secondary">receipt_long</span>
        <p className="text-sm text-ds-secondary">Todavía no hay gastos registrados este mes.</p>
        {onAddFirst && (
          <button
            type="button"
            onClick={onAddFirst}
            className="text-sm text-primary font-medium hover:underline underline-offset-2"
          >
            Registrá tu primer gasto
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-1">
      {expenses.map(expense => (
        <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
