import { useState } from 'react'
import { Button } from '../../shared/ui/button'

interface ResetButtonProps {
  onConfirm: () => void
}

export const ResetButton = ({ onConfirm }: ResetButtonProps) => {
  const [isPending, setIsPending] = useState(false)

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-3 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 leading-relaxed">
          <span className="material-symbols-outlined text-sm">warning</span>
          Se borrarán todos los gastos y el presupuesto. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsPending(false)
              onConfirm()
            }}
          >
            Sí, borrar todo
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsPending(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button variant="ghost" size="sm" leadingIcon="delete_sweep" onClick={() => setIsPending(true)}>
      Reiniciar todo
    </Button>
  )
}
