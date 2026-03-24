import { forwardRef } from 'react'
import { CategoryPicker } from './category-picker'
import { Button } from '../../shared/ui/button'
import { Icon } from '../../shared/ui/icon'
import type { Category } from '../../types'
import type { RefObject } from 'react'

/**
 * Field — Wrapper atómico para label + input + error.
 */
const Field = ({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold text-ds-secondary uppercase tracking-widest">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

/**
 * StitchInput — Input alineado con el design system Stitch:
 * border sutil, fondo surface, ring al focus, border-radius lg.
 */
const StitchInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string; prefix?: string }
>(({ error, prefix, ...props }, ref) => (
  <div
    className={`flex items-center border rounded-lg bg-surface px-3 py-2.5 transition-all focus-within:ring-1 focus-within:ring-primary/50 ${error ? 'border-red-400' : 'border-ds-border'}`}
  >
    {prefix && <span className="text-ds-secondary mr-2 text-sm">{prefix}</span>}
    <input
      ref={ref}
      {...props}
      className="w-full bg-transparent border-none p-0 outline-none text-ds-text font-medium text-sm placeholder:text-ds-secondary/60 placeholder:font-normal"
    />
  </div>
))
StitchInput.displayName = 'StitchInput'

/**
 * ExpenseFormProps
 *
 * - `totalAmount`     → Monto de la cuota que se paga este mes (no el total del bien).
 * - `installment`     → Texto libre "X/Y" (ej: "1/6"). Solo visible si categoría es tarjeta.
 * - `showInstallments`→ true cuando la categoría es tarjeta (BBVA / SUPERVIELLE).
 */
interface ExpenseFormProps {
  description: string
  category: Category
  totalAmount: string
  installment: string
  showInstallments: boolean
  amountRef: RefObject<HTMLInputElement | null>
  errors: Partial<Record<string, string>>
  onDescriptionChange: (v: string) => void
  onCategoryChange: (v: Category) => void
  onTotalAmountChange: (v: string) => void
  onInstallmentChange: (v: string) => void
  onSubmit: () => void
  onCancel?: () => void
}

export const ExpenseForm = ({
  description,
  category,
  totalAmount,
  installment,
  showInstallments,
  amountRef,
  errors,
  onDescriptionChange,
  onCategoryChange,
  onTotalAmountChange,
  onInstallmentChange,
  onSubmit,
  onCancel,
}: ExpenseFormProps) => (
  <div className="flex flex-col gap-5 w-full">
    {/* Monto — lo que se paga este mes */}
    <Field label="Monto" error={errors.totalAmount}>
      <StitchInput
        ref={amountRef}
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        prefix="$"
        value={totalAmount}
        onChange={e => onTotalAmountChange(e.target.value)}
        error={errors.totalAmount}
        autoFocus
      />
    </Field>

    {/* Descripción */}
    <Field label="Descripción">
      <StitchInput
        type="text"
        placeholder="¿Qué compraste?"
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
      />
    </Field>

    {/* Categoría + Cuotas en fila (como en Stitch: Payment Method | Installments) */}
    <div className="flex gap-3">
      <div className={showInstallments ? 'flex-1' : 'w-full'}>
        <CategoryPicker value={category} onChange={onCategoryChange} />
      </div>
      {showInstallments && (
        <div className="flex-1">
          <Field label="Cuotas" error={errors.installment}>
            <StitchInput
              type="text"
              placeholder="ej: 1 de 6"
              value={installment}
              onChange={e => onInstallmentChange(e.target.value)}
              error={errors.installment}
            />
          </Field>
        </div>
      )}
    </div>

    {/* Pro-tip */}
    {showInstallments && (
      <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2.5">
        <Icon name="info" size="base" className="text-primary mt-0.5" />
        <p className="text-xs text-ds-secondary leading-relaxed">
          <span className="font-semibold text-ds-text">Pro tip:</span> Escribí "1/6" en cuotas para
          indicar que pagás la cuota 1 de 6 este mes.
        </p>
      </div>
    )}

    {/* Acciones */}
    <div className="flex items-center justify-end gap-3 pt-2">
      {onCancel && (
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancelar
        </Button>
      )}
      <Button variant="primary" size="md" trailingIcon="check" onClick={onSubmit}>
        Guardar gasto
      </Button>
    </div>
  </div>
)
