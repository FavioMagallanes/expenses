export type Category = 'BBVA' | 'SUPERVIELLE' | 'PRESTAMO' | 'OTROS'

export interface Expense {
  id: string
  description?: string
  category: Category
  totalAmount: number
  currentInstallment?: number
  totalInstallments?: number
  amountPerInstallment?: number
  registeredAt: string
}

export interface Budget {
  amount: number
  configuredAt: string
}

export interface MonthlySummary {
  budget: number
  totalSpent: number
  remainingBalance: number
  isOverBudget: boolean
}

export const CARD_CATEGORIES: Category[] = ['BBVA', 'SUPERVIELLE']

export const CATEGORY_LABELS: Record<Category, string> = {
  BBVA: 'Tarjeta BBVA',
  SUPERVIELLE: 'Tarjeta Supervielle',
  PRESTAMO: 'Préstamo',
  OTROS: 'Otros',
}

export const isCardCategory = (category: Category): boolean => CARD_CATEGORIES.includes(category)
