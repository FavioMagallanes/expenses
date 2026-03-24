import type { Expense } from './index'

/**
 * Reporte mensual guardado en Supabase.
 * Se crea al "cerrar" un mes, congelando el snapshot de budget + gastos.
 */
export interface MonthlyReport {
  id: string
  user_id: string
  /** Etiqueta del mes, ej: "Marzo 2026" */
  label: string
  /** Fecha ISO de cierre */
  closed_at: string
  /** Monto del presupuesto configurado */
  budget: number
  /** Total gastado en el mes */
  total_spent: number
  /** Saldo restante (budget - total_spent) */
  remaining_balance: number
  /** true si gastó más que el presupuesto */
  is_over_budget: boolean
  /** Snapshot de todos los gastos del mes */
  expenses: Expense[]
}
