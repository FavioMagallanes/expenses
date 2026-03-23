import Big from 'big.js'
import type { Expense } from '../../types'

Big.RM = Big.roundHalfUp

export const calcInstallmentAmount = (totalAmount: number, installments: number): number =>
  Big(totalAmount).div(installments).round(2, Big.roundHalfUp).toNumber()

export const calcTotalSpent = (expenses: Expense[]): number =>
  expenses.reduce((acc, e) => Big(acc).plus(e.totalAmount).toNumber(), 0)

export const calcRemainingBalance = (budget: number, totalSpent: number): number =>
  Big(budget).minus(totalSpent).toNumber()
