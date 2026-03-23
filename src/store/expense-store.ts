import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { calcTotalGastado, calcSaldo, calcMontoCuota } from '../core/math/finance'
import { STORAGE_KEY, partialize } from '../core/storage/persist-config'
import { esTarjeta } from '../types'
import type { Gasto, Presupuesto, ResumenMensual, Category } from '../types'

interface NavSlice {
  isModalOpen: boolean
  editingGasto: Gasto | null
  openModal: () => void
  closeModal: () => void
  openEditModal: (gasto: Gasto) => void
}

interface DataSlice {
  presupuesto: Presupuesto | null
  gastos: Gasto[]
  setBudget: (monto: number) => void
  editBudget: (monto: number) => void
  addGasto: (gasto: Omit<Gasto, 'id' | 'fecha_registro'>) => void
  updateGasto: (id: string, changes: Partial<Omit<Gasto, 'id' | 'fecha_registro'>>) => void
  deleteGasto: (id: string) => void
  resetAll: () => void
  getResumen: () => ResumenMensual
}

type ExpenseStore = DataSlice & NavSlice

const buildGasto = (raw: Omit<Gasto, 'id' | 'fecha_registro'>): Gasto => ({
  ...raw,
  id: crypto.randomUUID(),
  fecha_registro: new Date().toISOString(),
  ...(esTarjeta(raw.categoria as Category) && raw.total_cuotas
    ? { monto_por_cuota: calcMontoCuota(raw.monto_total, raw.total_cuotas) }
    : {}),
})

const buildPresupuesto = (monto: number): Presupuesto => ({
  monto,
  fecha_configuracion: new Date().toISOString(),
})

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      presupuesto: null,
      gastos: [],
      isModalOpen: false,
      editingGasto: null,

      openModal: () => set({ isModalOpen: true, editingGasto: null }),
      closeModal: () => set({ isModalOpen: false, editingGasto: null }),
      openEditModal: (gasto: Gasto) => set({ isModalOpen: true, editingGasto: gasto }),

      setBudget: (monto: number) => set({ presupuesto: buildPresupuesto(monto) }),
      editBudget: (monto: number) => set({ presupuesto: buildPresupuesto(monto) }),

      addGasto: raw => set(s => ({ gastos: [...s.gastos, buildGasto(raw)] })),

      updateGasto: (id, changes) =>
        set(s => ({
          gastos: s.gastos.map(g =>
            g.id === id
              ? {
                  ...g,
                  ...changes,
                  ...(esTarjeta((changes.categoria ?? g.categoria) as Category) &&
                  (changes.total_cuotas ?? g.total_cuotas)
                    ? {
                        monto_por_cuota: calcMontoCuota(
                          changes.monto_total ?? g.monto_total,
                          (changes.total_cuotas ?? g.total_cuotas)!,
                        ),
                      }
                    : {}),
                }
              : g,
          ),
        })),

      deleteGasto: id => set(s => ({ gastos: s.gastos.filter(g => g.id !== id) })),

      resetAll: () =>
        set({ presupuesto: null, gastos: [], isModalOpen: false, editingGasto: null }),

      getResumen: (): ResumenMensual => {
        const { presupuesto, gastos } = get()
        const total_gastado = calcTotalGastado(gastos)
        const pMonto = presupuesto?.monto ?? 0
        const saldo_restante = calcSaldo(pMonto, total_gastado)
        return {
          presupuesto: pMonto,
          total_gastado,
          saldo_restante,
          es_negativo: saldo_restante < 0,
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
