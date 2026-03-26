export interface ExpenseFormFields {
  description: string
  categoryId: string
  totalAmount: string
  currentInstallment: string
  totalInstallments: string
  banco: string
}

export type ExpenseErrors = Partial<Record<keyof ExpenseFormFields, string>>

export const validateExpense = (
  fields: ExpenseFormFields,
  requiresBank: boolean,
  showInstallments: boolean,
): ExpenseErrors => {
  const errors: ExpenseErrors = {}
  const amount = parseFloat(fields.totalAmount)

  if (!fields.totalAmount || isNaN(amount) || amount <= 0) {
    errors.totalAmount = 'Ingresá un monto válido mayor a 0'
  }

  if (requiresBank && !fields.banco) {
    errors.banco = 'Seleccioná un banco'
  }

  if (showInstallments) {
    const current = parseInt(fields.currentInstallment)
    const total = parseInt(fields.totalInstallments)

    if (!fields.currentInstallment || isNaN(current) || current < 1) {
      errors.currentInstallment = 'Cuota actual inválida'
    }

    if (!fields.totalInstallments || isNaN(total) || total < 1) {
      errors.totalInstallments = 'Total de cuotas inválido'
    }

    if (current > total && !errors.currentInstallment && !errors.totalInstallments) {
      errors.currentInstallment = 'No puede superar el total'
    }
  }

  return errors
}
