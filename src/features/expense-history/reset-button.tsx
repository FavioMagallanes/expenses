import { useState } from 'react'

interface ResetButtonProps {
  onConfirm: () => void
}

export const ResetButton = ({ onConfirm }: ResetButtonProps) => {
  const [isPending, setIsPending] = useState(false)

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-3 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">warning</span>
          Se borrarán todos los gastos y el presupuesto. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsPending(false)
              onConfirm()
            }}
            className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sí, borrar todo
          </button>
          <button
            type="button"
            onClick={() => setIsPending(false)}
            className="px-3 py-1.5 text-xs font-medium border border-ds-border rounded-lg text-ds-secondary hover:bg-surface transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsPending(true)}
      className="text-xs text-ds-secondary hover:text-red-500 transition-colors flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-sm">delete_sweep</span>
      Reiniciar todo
    </button>
  )
}
