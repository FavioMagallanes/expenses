import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useExpenseStore } from '../../../store/expense-store'
import { CATEGORIES } from '../../../types'
import { validateExpense, resolveInstallmentForSubmit } from '../utils/validation'
import type { ExpenseFormFields, ExpenseErrors } from '../utils/validation'

const INITIAL_STATE: ExpenseFormFields = {
  description: '',
  categoryId: 'otros',
  totalAmount: '',
  currentInstallment: '',
  totalInstallments: '',
  banco: '',
}

export const useExpenseForm = (onSuccess?: () => void) => {
  const addExpense = useExpenseStore(s => s.addExpense)
  const [fields, setFields] = useState<ExpenseFormFields>(INITIAL_STATE)
  const [errors, setErrors] = useState<ExpenseErrors>({})
  const amountRef = useRef<HTMLInputElement>(null)

  const categoryObj = CATEGORIES.find(c => c.id === fields.categoryId)
  const showInstallments = categoryObj?.type === 'credit_card'
  const requiresBank = !!categoryObj?.requiresBank

  const setField = <K extends keyof ExpenseFormFields>(key: K, value: ExpenseFormFields[K]) => {
    setFields(prev => {
      const next = { ...prev, [key]: value }
      
      // Limpiar campos específicos si cambia la categoría
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

    addExpense({
      description: fields.description || undefined,
      categoryId: fields.categoryId,
      totalAmount: parseFloat(fields.totalAmount),
      installment: showInstallments
        ? resolveInstallmentForSubmit(fields.currentInstallment, fields.totalInstallments)
        : undefined,
      banco: requiresBank ? fields.banco : undefined,
    })

    setFields(INITIAL_STATE)
    setErrors({})
    toast.success('Gasto registrado correctamente')
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
