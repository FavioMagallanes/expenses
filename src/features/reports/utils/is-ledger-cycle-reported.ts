import type { MonthlyReport } from '../../../types/database'

/**
 * True si ya hay un cierre para el ciclo actual: la etiqueta del reporte coincide con el mes del
 * ledger (registro) o con el mes de liquidación. Cubre reportes guardados solo con mes de pago o
 * versiones donde el label era el mes de registro.
 */
export const isLedgerCycleReported = (
  reports: MonthlyReport[],
  ledgerMonthLabel: string,
  paymentMonthLabel: string,
): boolean =>
  reports.some(
    r => r.label === ledgerMonthLabel || r.label === paymentMonthLabel,
  )
