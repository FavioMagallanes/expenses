import { INSTALLMENT_RE } from './planned-advance'

export const parseInstallmentFraction = (
  installment: string | undefined,
): { current: number; total: number } | null => {
  const raw = installment?.trim()
  if (!raw) return null
  const match = raw.match(INSTALLMENT_RE)
  if (!match) return null
  const current = Number(match[1])
  const total = Number(match[2])
  if (Number.isNaN(current) || Number.isNaN(total) || total < 1) return null
  return { current, total }
}

/**
 * True cuando la cuota es la última de un plan en cuotas (ej. 6/6), no para 1/1 (pago único / suscripción).
 */
export const isLastInstallmentOfPlan = (installment: string | undefined): boolean => {
  const parsed = parseInstallmentFraction(installment)
  if (!parsed || parsed.total <= 1) return false
  return parsed.current === parsed.total
}
