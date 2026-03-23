import Big from 'big.js'
import type { Gasto } from '../../types'

Big.RM = Big.roundHalfUp

export const calcMontoCuota = (monto: number, cuotas: number): number =>
  Big(monto).div(cuotas).round(2, Big.roundHalfUp).toNumber()

export const calcTotalGastado = (gastos: Gasto[]): number =>
  gastos.reduce((acc, g) => Big(acc).plus(g.monto_total).toNumber(), 0)

export const calcSaldo = (presupuesto: number, totalGastado: number): number =>
  Big(presupuesto).minus(totalGastado).toNumber()
