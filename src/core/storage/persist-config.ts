import type { Gasto, Presupuesto } from '../../types'

export const STORAGE_KEY = 'expense-tracker-v1'

export const partialize = (state: { presupuesto: Presupuesto | null; gastos: Gasto[] }) => ({
  presupuesto: state.presupuesto,
  gastos: state.gastos,
})
