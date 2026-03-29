const capitalizeFirst = (value: string): string => {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const monthYearEsAr = (date: Date): string =>
  capitalizeFirst(date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }))

/** Nombre del mes en es-AR, sin año (p. ej. "mayo"). */
const monthNameOnlyEsAr = (date: Date): string =>
  date.toLocaleDateString('es-AR', { month: 'long' })

const startOfCalendarMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1)

const addCalendarMonths = (monthStart: Date, monthsToAdd: number): Date =>
  new Date(monthStart.getFullYear(), monthStart.getMonth() + monthsToAdd, 1)

/**
 * Etiquetas alineadas al flujo tarjeta/resumen: cargás gastos en un mes calendario (ledger),
 * esos consumos suelen liquidarse en el mes siguiente (pago), y el plan adelantado apunta al
 * mes posterior (lo que viene después del ciclo de pago inmediato).
 */
export const getPlanMonthContext = (referenceDate: Date = new Date()) => {
  const ledgerMonthStart = startOfCalendarMonth(referenceDate)
  const paymentMonthStart = addCalendarMonths(ledgerMonthStart, 1)
  const planTargetMonthStart = addCalendarMonths(ledgerMonthStart, 2)

  return {
    /** Mes del ledger donde registrás gastos hoy. */
    ledgerMonthLabel: monthYearEsAr(ledgerMonthStart),
    /** Mes en que ese resumen suele pagarse / nombre del reporte al cerrar el mes. */
    paymentMonthLabel: monthYearEsAr(paymentMonthStart),
    /** Mes objetivo del plan (pago esperado), solo nombre sin año. */
    planTargetMonthName: monthNameOnlyEsAr(planTargetMonthStart),
  }
}
