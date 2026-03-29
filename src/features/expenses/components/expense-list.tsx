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
  /** Si false, no se muestra “Cargar primer gasto” (p. ej. periodo ya cerrado con reporte). */
  canAddExpenses?: boolean
  /** Si true, no se ofrecen editar ni eliminar filas. */
  ledgerReadOnly?: boolean
  /** Si true y la lista está vacía, no se repite texto (el aviso va arriba en el dashboard). */
  suppressEmptyDescription?: boolean
  /** Si true y no hay ítems, no se renderiza el bloque vacío (p. ej. periodo cerrado). */
  hideEmptyState?: boolean
}

export const ExpenseList = ({
  expenses,
  listCaption,
  onEdit,
  onDelete,
  onAddFirst,
  hasBudget,
  canAddExpenses = true,
  ledgerReadOnly = false,
  suppressEmptyDescription = false,
  hideEmptyState = false,
}: ExpenseListProps) => {
  if (expenses.length === 0) {
    if (hideEmptyState) {
      return null
    }
    const emptyBody = hasBudget
      ? 'Todavía no hay gastos cargados en este periodo.'
      : 'Ingresá un presupuesto inicial para comenzar a cargar tus gastos.'
    const showDescription = !suppressEmptyDescription

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-ds-border dark:border-dark-border bg-surface/30 dark:bg-dark-surface/10 rounded-none">
        <Icon
          name="receipt-dollar"
          size="xl"
          className="text-ds-secondary/40 dark:text-dark-secondary/40 mb-3"
        />
        {showDescription && (
          <p className="text-sm text-ds-secondary dark:text-dark-secondary text-center max-w-[320px] leading-relaxed text-pretty">
            {emptyBody}
          </p>
        )}
        {hasBudget && onAddFirst && canAddExpenses && (
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
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={ledgerReadOnly ? undefined : onEdit}
          onDelete={ledgerReadOnly ? undefined : onDelete}
        />
      ))}
    </div>
  )
}
