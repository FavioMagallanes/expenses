import { Button } from '../../../shared/ui/button'
import { Icon } from '../../../shared/ui/icon'
import type { Expense } from '../../../types'
import { ExpenseItem } from './expense-item'

interface ExpenseListProps {
  expenses: Expense[]
  /** Título único encima de la lista (periodo / contexto del ledger). */
  listCaption?: string
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
  onAddFirst?: () => void
  hasBudget: boolean
}

export const ExpenseList = ({
  expenses,
  listCaption,
  onEdit,
  onDelete,
  onAddFirst,
  hasBudget,
}: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-ds-border dark:border-dark-border bg-surface/30 dark:bg-dark-surface/10 rounded-none">
        <Icon
          name="receipt-dollar"
          size="xl"
          className="text-ds-secondary/40 dark:text-dark-secondary/40 mb-3"
        />
        <p className="text-sm text-ds-secondary dark:text-dark-secondary text-center max-w-[240px]">
          {hasBudget
            ? 'Todavía no hay gastos cargados en este periodo.'
            : 'Ingresá un presupuesto inicial para comenzar a cargar tus gastos.'}
        </p>
        {hasBudget && onAddFirst && (
          <Button variant="secondary" size="sm" className="mt-4" onClick={onAddFirst}>
            Cargar primer gasto
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-1">
      {listCaption != null && listCaption !== '' && (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ds-secondary dark:text-dark-secondary px-1 pb-3 mb-1 border-b border-ds-border dark:border-dark-border">
          {listCaption}
        </p>
      )}
      {expenses.map(expense => (
        <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
