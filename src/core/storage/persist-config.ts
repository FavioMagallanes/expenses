import type { Expense, Budget } from '../../types'

export const STORAGE_KEY = 'expense-tracker-v1'

export const partialize = (state: { budget: Budget | null; expenses: Expense[] }) => ({
  budget: state.budget,
  expenses: state.expenses,
})
