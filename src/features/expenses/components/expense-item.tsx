import { CATEGORIES, CATEGORY_LABELS } from '../../../types'
import { Button } from '../../../shared/ui/button'
import { Icon } from '../../../shared/ui/icon'
import { formatCurrency } from '../../../core/math/format'
import type { Expense } from '../../../types'

interface ExpenseItemProps {
  expense: Expense
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
}

export const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  const categoryId = expense.categoryId
  const category = CATEGORIES.find(c => c.id === categoryId)
  const icon = category?.icon ?? 'payment'
  const color = category?.color ?? '#e5e7eb'
  const label = CATEGORY_LABELS[categoryId] ?? 'Otros'

  return (
    <div className="flex items-center justify-between p-3 border border-ds-border dark:border-dark-border rounded-lg hover:bg-[#EFEFEF] dark:hover:bg-dark-hover transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={`size-10 rounded-lg flex items-center justify-center shrink-0`}
          style={{ backgroundColor: color, color: '#ffffff' }}
        >
          <Icon name={icon} size="xl" />
        </div>
        <div>
          <p className="text-sm font-medium text-ds-text dark:text-dark-text tracking-tight">
            {expense.description ?? label}
          </p>
          <p className="text-[12px] text-ds-secondary dark:text-dark-secondary leading-relaxed">
            {label}
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
          <p className="text-sm font-semibold text-ds-text dark:text-dark-text">
            {formatCurrency(expense.totalAmount)}
          </p>
          {expense.installment && (
            <p className="text-[8px] text-ds-secondary dark:text-dark-secondary uppercase font-bold tracking-tighter">
              Monto
            </p>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar ${expense.description ?? label}`}
                onClick={() => onEdit(expense)}
                leadingIcon="edit"
              />
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Eliminar ${expense.description ?? label}`}
                onClick={() => onDelete(expense.id)}
                className="hover:text-danger!"
                leadingIcon="delete"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
