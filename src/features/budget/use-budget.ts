import { useState } from 'react'
import { useExpenseStore } from '../../store/expense-store'

export const useBudget = () => {
  const budget = useExpenseStore(s => s.budget)
  const setBudget = useExpenseStore(s => s.setBudget)
  const editBudget = useExpenseStore(s => s.editBudget)
  const getSummary = useExpenseStore(s => s.getSummary)

  const [error, setError] = useState<string | null>(null)

  const summary = getSummary()

  const handleSetBudget = (amount: number) => {
    if (amount <= 0) return setError('El presupuesto debe ser un número positivo')
    setError(null)
    setBudget(amount)
  }

  const handleEditBudget = (amount: number) => {
    if (amount <= 0) return setError('El presupuesto debe ser un número positivo')
    setError(null)
    editBudget(amount)
  }

  return {
    budget,
    remainingBalance: summary.remainingBalance,
    totalSpent: summary.totalSpent,
    isOverBudget: summary.isOverBudget,
    error,
    handleSetBudget,
    handleEditBudget,
  }
}
