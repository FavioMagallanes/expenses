import { useEffect } from 'react'
import { Modal } from '../../../shared/ui/modal'
import { useExpenseStore } from '../../../store/expense-store'
import { ExpenseFormProvider } from '../context/expense-form-provider'
import { useExpenseForm } from '../hooks/use-expense-form'
import { ExpenseForm } from './expense-form'

export const NewExpenseModal = () => {
  const closeModal = useExpenseStore(s => s.closeModal)
  const formValue = useExpenseForm(closeModal)

  useEffect(() => {
    formValue.amountRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal title="Registro rápido" icon="receipt-dollar" onClose={closeModal}>
      <ExpenseFormProvider value={formValue}>
        <ExpenseForm onCancel={closeModal} />
      </ExpenseFormProvider>
    </Modal>
  )
}
