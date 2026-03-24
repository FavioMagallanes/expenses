import { ExpenseFormContext } from './expense-form-context'
import type { ExpenseFormContextValue } from './expense-form-context'

interface ExpenseFormProviderProps {
  value: ExpenseFormContextValue
  children: React.ReactNode
}

/**
 * ExpenseFormProvider — Envuelve a `ExpenseForm` e inyecta el contexto.
 *
 * Permite usar distintos hooks (useExpenseForm, useEditExpenseForm)
 * con el mismo componente presentacional.
 */
export const ExpenseFormProvider = ({ value, children }: ExpenseFormProviderProps) => (
  <ExpenseFormContext.Provider value={value}>{children}</ExpenseFormContext.Provider>
)
