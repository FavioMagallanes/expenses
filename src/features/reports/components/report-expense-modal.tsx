import { useEffect } from 'react'
import type { Expense } from '../../../types'
import { Modal } from '../../../shared/ui/modal'
import { ExpenseFormProvider } from '../../expenses/context/expense-form-provider'
import { ExpenseForm } from '../../expenses/components/expense-form'
import { useReportExpenseForm } from '../hooks/use-report-expense-form'

interface ReportExpenseModalProps {
  initial: Expense | null
  onClose: () => void
  onSave: (expense: Expense) => void
}

/**
 * Alta/edición de un gasto dentro del contexto de un reporte cerrado.
 */
export const ReportExpenseModal = ({ initial, onClose, onSave }: ReportExpenseModalProps) => {
  const formValue = useReportExpenseForm(initial, onSave, onClose)

  useEffect(() => {
    formValue.amountRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const title = initial ? 'Editar gasto' : 'Nuevo gasto'
  const icon = initial ? 'pencil-edit' : 'add'

  return (
    <Modal title={title} icon={icon} onClose={onClose} zIndexClass="z-[100]">
      <ExpenseFormProvider value={formValue}>
        <ExpenseForm onCancel={onClose} />
      </ExpenseFormProvider>
    </Modal>
  )
}
