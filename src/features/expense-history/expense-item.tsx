import { CATEGORY_LABELS } from '../../types'
import type { Expense } from '../../types'

const fmt = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)

const CATEGORY_ICON: Record<string, { icon: string; bg: string; fg: string }> = {
  BBVA: { icon: 'credit_card', bg: 'bg-blue-100', fg: 'text-blue-600' },
  SUPERVIELLE: { icon: 'credit_card', bg: 'bg-violet-100', fg: 'text-violet-600' },
  PRESTAMO: { icon: 'account_balance', bg: 'bg-orange-100', fg: 'text-orange-600' },
  OTROS: { icon: 'payments', bg: 'bg-green-100', fg: 'text-green-600' },
}

interface ExpenseItemProps {
  expense: Expense
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
}

export const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  const { icon, bg, fg } = CATEGORY_ICON[expense.category] ?? CATEGORY_ICON.OTROS

  return (
    <div className="flex items-center justify-between p-3 border border-ds-border rounded-lg hover:bg-[#EFEFEF] transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`size-10 ${bg} ${fg} rounded-lg flex items-center justify-center shrink-0`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-ds-text">
            {expense.description ?? CATEGORY_LABELS[expense.category]}
          </p>
          <p className="text-xs text-ds-secondary">
            {CATEGORY_LABELS[expense.category]}
            {expense.installment ? ` • Cuota ${expense.installment}` : ''}
            {' • '}
            {new Date(expense.registeredAt).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-ds-text">{fmt(expense.totalAmount)}</p>
          {expense.installment && (
            <p className="text-[8px] text-ds-secondary uppercase font-bold tracking-tighter">
              Monto
            </p>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                type="button"
                aria-label={`Editar ${expense.description ?? CATEGORY_LABELS[expense.category]}`}
                onClick={() => onEdit(expense)}
                className="p-1.5 text-ds-secondary hover:text-primary hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                aria-label={`Eliminar ${expense.description ?? CATEGORY_LABELS[expense.category]}`}
                onClick={() => onDelete(expense.id)}
                className="p-1.5 text-ds-secondary hover:text-red-500 hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
