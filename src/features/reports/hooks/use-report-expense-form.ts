import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { CATEGORIES, isCardCategory } from '../../../types'
import type { Expense } from '../../../types'
import { validateExpense } from '../../expenses/utils/validation'
import type { ExpenseFormFields, ExpenseErrors } from '../../expenses/utils/validation'

const INITIAL_STATE: ExpenseFormFields = {
  description: '',
  categoryId: 'otros',
  totalAmount: '',
  currentInstallment: '',
  totalInstallments: '',
  banco: '',
}

const toFormState = (expense: Expense): ExpenseFormFields => {
  const [current, total] = (expense.installment ?? '').split('/')
  return {
    description: expense.description ?? '',
    categoryId: expense.categoryId,
    totalAmount: String(expense.totalAmount),
    currentInstallment: current ?? '',
    totalInstallments: total ?? '',
    banco: expense.banco ?? '',
  }
}

/**
 * Formulario de gasto para editar el snapshot de un reporte cerrado (sin Zustand).
 */
export const useReportExpenseForm = (
  initial: Expense | null,
  onCommit: (expense: Expense) => void,
  onSuccess?: () => void,
) => {
  const [fields, setFields] = useState<ExpenseFormFields>(() =>
    initial ? toFormState(initial) : INITIAL_STATE,
  )
  const [errors, setErrors] = useState<ExpenseErrors>({})
  const amountRef = useRef<HTMLInputElement>(null)

  const showInstallments = isCardCategory(fields.categoryId)
  const categoryObj = CATEGORIES.find(c => c.id === fields.categoryId)
  const requiresBank = !!categoryObj?.requiresBank

  const setField = <K extends keyof ExpenseFormFields>(key: K, value: ExpenseFormFields[K]) => {
    setFields(prev => {
      const next = { ...prev, [key]: value }

      if (key === 'categoryId') {
        const newCat = CATEGORIES.find(c => c.id === value)
        if (newCat?.type !== 'credit_card') {
          next.currentInstallment = ''
          next.totalInstallments = ''
        }
        if (!newCat?.requiresBank) {
          next.banco = ''
        }
      }

      return next
    })

    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const nextErrors = validateExpense(fields, requiresBank, showInstallments)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const base = {
      description: fields.description || undefined,
      categoryId: fields.categoryId,
      totalAmount: parseFloat(fields.totalAmount),
      installment: showInstallments
        ? `${fields.currentInstallment}/${fields.totalInstallments}`
        : undefined,
      banco: requiresBank ? fields.banco || undefined : undefined,
    }

    if (initial) {
      onCommit({
        ...initial,
        ...base,
      })
    } else {
      onCommit({
        id: crypto.randomUUID(),
        registeredAt: new Date().toISOString(),
        ...base,
      })
    }

    toast.success(initial ? 'Gasto actualizado' : 'Gasto agregado')
    onSuccess?.()
  }

  return {
    fields,
    errors,
    showInstallments,
    amountRef,
    setField,
    handleSubmit,
    requiresBank,
  }
}
