import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { calcTotalSpent, calcRemainingBalance } from '../core/math/finance'
import { STORAGE_KEY, partialize } from '../core/storage/persist-config'
import type { Expense, Budget, MonthlySummary } from '../types'

interface NavSlice {
  isModalOpen: boolean
  editingExpense: Expense | null
  openModal: () => void
  closeModal: () => void
  openEditModal: (expense: Expense) => void
}

interface DataSlice {
  budget: Budget | null
  expenses: Expense[]
  setBudget: (amount: number) => void
  editBudget: (amount: number) => void
  addExpense: (expense: Omit<Expense, 'id' | 'registeredAt'>) => void
  updateExpense: (id: string, changes: Partial<Omit<Expense, 'id' | 'registeredAt'>>) => void
  deleteExpense: (id: string) => void
  resetAll: () => void
  getSummary: () => MonthlySummary
}

type ExpenseStore = DataSlice & NavSlice

const buildExpense = (raw: Omit<Expense, 'id' | 'registeredAt'>): Expense => ({
  ...raw,
  id: crypto.randomUUID(),
  registeredAt: new Date().toISOString(),
})

const buildBudget = (amount: number): Budget => ({
  amount,
  configuredAt: new Date().toISOString(),
})

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      budget: null,
      expenses: [],
      isModalOpen: false,
      editingExpense: null,

      openModal: () => set({ isModalOpen: true, editingExpense: null }),
      closeModal: () => set({ isModalOpen: false, editingExpense: null }),
      openEditModal: (expense: Expense) => set({ isModalOpen: true, editingExpense: expense }),

      setBudget: (amount: number) => set({ budget: buildBudget(amount) }),
      editBudget: (amount: number) => set({ budget: buildBudget(amount) }),

      addExpense: raw => set(s => ({ expenses: [...s.expenses, buildExpense(raw)] })),

      updateExpense: (id, changes) =>
        set(s => ({
          expenses: s.expenses.map(e => (e.id === id ? { ...e, ...changes } : e)),
        })),

      deleteExpense: (id: string) => set(s => ({ expenses: s.expenses.filter(e => e.id !== id) })),

      resetAll: () => set({ budget: null, expenses: [], isModalOpen: false, editingExpense: null }),

      getSummary: (): MonthlySummary => {
        const { budget, expenses } = get()
        const totalSpent = calcTotalSpent(expenses)
        const budgetAmount = budget?.amount ?? 0
        const remainingBalance = calcRemainingBalance(budgetAmount, totalSpent)
        return {
          budget: budgetAmount,
          totalSpent,
          remainingBalance,
          isOverBudget: remainingBalance < 0,
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: s => partialize(s),
    },
  ),
)
