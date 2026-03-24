import { useEffect } from 'react'
import { useExpenseStore } from '../../../store/expense-store'
import { useEditExpenseForm } from '../hooks/use-edit-expense-form'
import { ExpenseFormProvider } from '../context/expense-form-provider'
import { ExpenseForm } from './expense-form'
import { Modal } from '../../../shared/ui/modal'

export const EditExpenseModal = () => {
  const isModalOpen = useExpenseStore(s => s.isModalOpen)
  const editingExpense = useExpenseStore(s => s.editingExpense)
  const closeModal = useExpenseStore(s => s.closeModal)

  if (!isModalOpen || !editingExpense) return null

  return <EditExpenseModalContent key={editingExpense.id} onClose={closeModal} />
}

const EditExpenseModalContent = ({ onClose }: { onClose: () => void }) => {
  const editingExpense = useExpenseStore(s => s.editingExpense)!
  const formValue = useEditExpenseForm(editingExpense, onClose)

  useEffect(() => {
    formValue.amountRef.current?.focus()
  }, [formValue.amountRef])

  return (
    <Modal title="Editar gasto" icon="pencil-edit" onClose={onClose}>
      <ExpenseFormProvider value={formValue}>
        <ExpenseForm onCancel={onClose} />
      </ExpenseFormProvider>
    </Modal>
  )
}
