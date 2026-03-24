import { useEffect } from 'react'
import { useExpenseStore } from '../../store/expense-store'
import { useEditExpenseForm } from './use-edit-expense-form'
import { ExpenseForm } from '../expense-registration/expense-form'
import { Icon } from '../../shared/ui/icon'

export const EditExpenseModal = () => {
  const isModalOpen = useExpenseStore(s => s.isModalOpen)
  const editingExpense = useExpenseStore(s => s.editingExpense)
  const closeModal = useExpenseStore(s => s.closeModal)

  if (!isModalOpen || !editingExpense) return null

  return <EditExpenseModalContent key={editingExpense.id} onClose={closeModal} />
}

const EditExpenseModalContent = ({ onClose }: { onClose: () => void }) => {
  const editingExpense = useExpenseStore(s => s.editingExpense)!

  const { fields, errors, showInstallments, amountRef, setField, handleSubmit } =
    useEditExpenseForm(editingExpense, onClose)

  useEffect(() => {
    amountRef.current?.focus()
  }, [amountRef])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editar gasto"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md bg-white border border-ds-border rounded-xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ds-border">
          <div className="flex items-center gap-2">
            <Icon name="pencil-edit" size="xl" className="text-ds-secondary" />
            <h2 className="text-base font-semibold text-ds-text">Editar gasto</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="size-8 inline-flex items-center justify-center rounded-lg text-ds-secondary hover:bg-surface hover:text-ds-text transition-colors"
          >
            <Icon name="cancel" size="xl" />
          </button>
        </div>

        <div className="px-6 py-5">
          <ExpenseForm
            description={fields.description}
            category={fields.category}
            totalAmount={fields.totalAmount}
            installment={fields.installment}
            showInstallments={showInstallments}
            amountRef={amountRef}
            errors={errors}
            onDescriptionChange={v => setField('description', v)}
            onCategoryChange={v => setField('category', v)}
            onTotalAmountChange={v => setField('totalAmount', v)}
            onInstallmentChange={v => setField('installment', v)}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
