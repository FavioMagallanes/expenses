const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)

interface BudgetSummaryProps {
  budgetAmount: number
  totalSpent: number
  remainingBalance: number
  isOverBudget: boolean
}

export const BudgetSummary = ({
  budgetAmount,
  totalSpent,
  remainingBalance,
  isOverBudget,
}: BudgetSummaryProps) => (
  <div className="bg-surface-container-low p-4 flex flex-col gap-3 w-full">
    <SummaryRow
      label="Presupuesto mensual"
      value={formatCurrency(budgetAmount)}
      className="text-gray-700"
    />
    <SummaryRow
      label="Total gastado"
      value={formatCurrency(totalSpent)}
      className="text-gray-700"
    />
    <div className="border-t border-gray-200 pt-3">
      <SummaryRow
        label="Saldo restante"
        value={formatCurrency(remainingBalance)}
        className={isOverBudget ? 'text-red-600 font-semibold' : 'text-primary font-semibold'}
      />
    </div>
  </div>
)

const SummaryRow = ({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{label}</span>
    <span className={className}>{value}</span>
  </div>
)
