import { useExpenseStore } from '../../../store/expense-store'
import { useExpenseForm } from '../hooks/use-expense-form'
import { ExpenseFormProvider } from '../context/expense-form-provider'
import { ExpenseForm } from './expense-form'
import { Modal } from '../../../shared/ui/modal'

export const NewExpenseModal = () => {
  const closeModal = useExpenseStore(s => s.closeModal)
  const formValue = useExpenseForm(closeModal)

  return (
    <Modal title="Registro rápido" icon="receipt-dollar" onClose={closeModal}>
      <ExpenseFormProvider value={formValue}>
        <ExpenseForm onCancel={closeModal} />
      </ExpenseFormProvider>
    </Modal>
  )
}
