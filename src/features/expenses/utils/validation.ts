export interface ExpenseFormFields {
  description: string
  categoryId: string
  totalAmount: string
  currentInstallment: string
  totalInstallments: string
  banco: string
}

export type ExpenseErrors = Partial<Record<keyof ExpenseFormFields, string>>

/**
 * Tarjeta: si ambos campos de cuotas van vacíos, se persiste como pago único `1/1`.
 */
export const resolveInstallmentForSubmit = (
  currentInstallment: string,
  totalInstallments: string,
): string => {
  const c = currentInstallment.trim()
  const t = totalInstallments.trim()
  if (c === '' && t === '') return '1/1'
  return `${c}/${t}`
}

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
    const cRaw = fields.currentInstallment.trim()
    const tRaw = fields.totalInstallments.trim()
    const bothEmpty = cRaw === '' && tRaw === ''

    if (!bothEmpty) {
      const current = parseInt(fields.currentInstallment, 10)
      const total = parseInt(fields.totalInstallments, 10)

      if (!cRaw || isNaN(current) || current < 1) {
        errors.currentInstallment = 'Cuota actual inválida'
      }

      if (!tRaw || isNaN(total) || total < 1) {
        errors.totalInstallments = 'Total de cuotas inválido'
      }

      if (
        !errors.currentInstallment &&
        !errors.totalInstallments &&
        current > total
      ) {
        errors.currentInstallment = 'No puede superar el total'
      }
    }
  }

  return errors
}
