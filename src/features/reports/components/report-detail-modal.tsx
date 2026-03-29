import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { Modal } from '../../../shared/ui/modal'
import { Icon } from '../../../shared/ui/icon'
import { Button } from '../../../shared/ui/button'
import { formatCurrency } from '../../../core/math/format'
import { calcRemainingBalance, calcTotalSpent } from '../../../core/math/finance'
import { CATEGORY_LABELS } from '../../../types'
import type { Expense } from '../../../types'
import type { MonthlyReport } from '../../../types/database'
import type { ReportUpdatePayload } from '../services/report-service'
import { ReportExpenseModal } from './report-expense-modal'
import { confirmToast } from '../../../shared/ui/confirm-toast'

interface ReportDetailModalProps {
  report: MonthlyReport
  onClose: () => void
  onUpdate: (id: string, payload: ReportUpdatePayload) => Promise<boolean>
}

const rowId = (expense: Expense, index: number) => expense.id ?? String(index)

/**
 * ReportDetailModal — Detalle de un reporte mensual cerrado; permite editar snapshot y generar PDF.
 */
export const ReportDetailModal = ({ report, onClose, onUpdate }: ReportDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [draftExpenses, setDraftExpenses] = useState<Expense[]>([])
  const [draftBudget, setDraftBudget] = useState('')
  const [saving, setSaving] = useState(false)
  const [subModal, setSubModal] = useState<null | 'new' | Expense>(null)

  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(report.expenses.map((e, i) => rowId(e, i))),
  )

  // Solo al abrir otro reporte (otro id); no al refrescar el mismo tras guardar.
  useEffect(() => {
    setSelectedIds(new Set(report.expenses.map((e, i) => rowId(e, i))))
    setIsEditing(false)
    setSubModal(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dependemos solo de `report.id`
  }, [report.id])

  const handleStartEdit = () => {
    setDraftExpenses(report.expenses.map(e => ({ ...e })))
    setDraftBudget(String(report.budget))
    setSelectedIds(new Set(report.expenses.map((e, i) => rowId(e, i))))
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSubModal(null)
    setSelectedIds(new Set(report.expenses.map((e, i) => rowId(e, i))))
  }

  const listExpenses = isEditing ? draftExpenses : report.expenses

  const reportForExport: MonthlyReport = useMemo(() => {
    if (!isEditing) return report
    const budgetNum = parseFloat(draftBudget.replace(',', '.')) || 0
    const totalSpent = calcTotalSpent(draftExpenses)
    const remainingBalance = calcRemainingBalance(budgetNum, totalSpent)
    return {
      ...report,
      budget: budgetNum,
      total_spent: totalSpent,
      remaining_balance: remainingBalance,
      is_over_budget: remainingBalance < 0,
      expenses: draftExpenses,
    }
  }, [isEditing, report, draftBudget, draftExpenses])

  const summaryBudget = reportForExport.budget
  const summaryTotalSpent = reportForExport.total_spent
  const summaryRemaining = reportForExport.remaining_balance
  const summaryOver = reportForExport.is_over_budget

  const filename = `reporte-${report.label.toLowerCase().replace(/\s+/g, '-')}.pdf`

  const toggleExpense = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === listExpenses.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(listExpenses.map((e, i) => rowId(e, i))))
    }
  }

  const selectedExpenses = listExpenses.filter((e, i) => selectedIds.has(rowId(e, i)))

  const handleDownload = async () => {
    if (selectedExpenses.length === 0) return
    setDownloading(true)
    try {
      const { generateReportPdf } = await import('../services/report-pdf')
      const { downloadReport } = await import('../services/share-report')
      const blob = await generateReportPdf(reportForExport, selectedExpenses)
      downloadReport(blob, filename)
      toast.success('PDF descargado')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    if (selectedExpenses.length === 0) return
    setSharing(true)
    try {
      const { generateReportPdf } = await import('../services/report-pdf')
      const { shareReport } = await import('../services/share-report')
      const blob = await generateReportPdf(reportForExport, selectedExpenses)
      const result = await shareReport(blob, filename)
      if (result === 'unsupported') {
        toast.info(
          'Tu navegador no soporta compartir archivos. Usá el botón "Descargar PDF" para guardarlo.',
          { position: 'top-center', duration: 5000 },
        )
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      toast.error('Error al compartir el reporte')
    } finally {
      setSharing(false)
    }
  }

  const handleSaveReport = async () => {
    const budgetNum = parseFloat(draftBudget.replace(',', '.'))
    if (isNaN(budgetNum) || budgetNum < 0) {
      toast.error('Ingresá un presupuesto válido')
      return
    }
    if (draftExpenses.length === 0) {
      toast.error('El reporte debe tener al menos un gasto')
      return
    }
    const totalSpent = calcTotalSpent(draftExpenses)
    const remainingBalance = calcRemainingBalance(budgetNum, totalSpent)
    const payload: ReportUpdatePayload = {
      budget: budgetNum,
      total_spent: totalSpent,
      remaining_balance: remainingBalance,
      is_over_budget: remainingBalance < 0,
      expenses: draftExpenses,
    }
    setSaving(true)
    const ok = await onUpdate(report.id, payload)
    setSaving(false)
    if (ok) setIsEditing(false)
  }

  const handleDeleteDraftExpense = (expense: Expense, index: number) => {
    const id = rowId(expense, index)
    confirmToast({
      title: '¿Eliminar este gasto?',
      description: 'Se quitará del reporte al guardar los cambios.',
      confirmLabel: 'Eliminar',
      onConfirm: () => {
        setDraftExpenses(prev => prev.filter((_, i) => i !== index))
        setSelectedIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      },
    })
  }

  const handleCommitExpense = (expense: Expense) => {
    setDraftExpenses(prev => {
      const idx = prev.findIndex(e => e.id === expense.id)
      if (idx === -1) return [...prev, expense]
      const next = [...prev]
      next[idx] = expense
      return next
    })
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.add(expense.id)
      return next
    })
    setSubModal(null)
  }

  return (
    <>
      <Modal title={report.label} icon="receipt-dollar" onClose={onClose}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!isEditing ? (
              <Button variant="secondary" size="sm" leadingIcon="pencil-edit" onClick={handleStartEdit}>
                Editar reporte
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={saving}>
                  Cancelar edición
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leadingIcon="check"
                  onClick={() => void handleSaveReport()}
                  loading={saving}
                >
                  Guardar cambios
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leadingIcon="add"
                  onClick={() => setSubModal('new')}
                  disabled={saving}
                >
                  Agregar gasto
                </Button>
              </>
            )}
          </div>

          {/* Resumen */}
          <div className="rounded-lg border border-ds-border dark:border-dark-border p-4 space-y-2 text-[13px]">
            <div className="flex justify-between items-center gap-2">
              <span className="text-ds-secondary dark:text-dark-secondary">Presupuesto</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <span className="text-ds-secondary dark:text-dark-secondary text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={draftBudget}
                    onChange={e => setDraftBudget(e.target.value)}
                    className="w-28 border border-ds-border dark:border-dark-border rounded-lg bg-surface dark:bg-dark-surface px-2 py-1 text-right text-sm font-medium text-ds-text dark:text-dark-text outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              ) : (
                <span className="font-medium text-ds-text dark:text-dark-text">
                  {formatCurrency(summaryBudget)}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-ds-secondary dark:text-dark-secondary">Total gastado</span>
              <span className="font-medium text-ds-text dark:text-dark-text">
                {formatCurrency(summaryTotalSpent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ds-secondary dark:text-dark-secondary">Saldo</span>
              <span
                className={`font-medium ${summaryOver ? 'text-danger' : 'text-ds-text dark:text-dark-text'}`}
              >
                {formatCurrency(summaryRemaining)}
              </span>
            </div>
          </div>

          {/* Lista de gastos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-medium text-ds-text dark:text-dark-text">
                Gastos ({selectedIds.size}/{listExpenses.length})
              </h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-[11px] text-primary hover:underline underline-offset-2 cursor-pointer"
                >
                  {selectedIds.size === listExpenses.length
                    ? 'Deseleccionar todo'
                    : 'Seleccionar todo'}
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {listExpenses.map((expense, i) => {
                const id = rowId(expense, i)
                const isSelected = selectedIds.has(id)
                return (
                  <div
                    key={id}
                    onClick={!isEditing ? () => toggleExpense(id) : undefined}
                    role={!isEditing ? 'button' : undefined}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] transition-colors ${
                      isEditing
                        ? 'border-ds-border dark:border-dark-border cursor-default'
                        : `cursor-pointer ${
                            isSelected
                              ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                              : 'border-ds-border dark:border-dark-border opacity-50'
                          }`
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {!isEditing && (
                        <div
                          className={`size-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-ds-border dark:border-dark-border'
                          }`}
                        >
                          {isSelected && <Icon name="check" size="sm" className="text-white" />}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-ds-text dark:text-dark-text truncate">
                          {expense.description || CATEGORY_LABELS[expense.categoryId]}
                        </p>
                        <p className="text-[11px] text-ds-secondary dark:text-dark-secondary">
                          {CATEGORY_LABELS[expense.categoryId]}
                          {expense.installment && ` · Cuota ${expense.installment}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-medium text-ds-text dark:text-dark-text">
                        {formatCurrency(expense.totalAmount)}
                      </span>
                      {isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Editar gasto"
                            onClick={e => {
                              e.stopPropagation()
                              setSubModal(expense)
                            }}
                            className="size-8 inline-flex items-center justify-center rounded-lg text-ds-secondary dark:text-dark-secondary hover:bg-surface dark:hover:bg-dark-hover hover:text-ds-text dark:hover:text-dark-text transition-colors cursor-pointer"
                          >
                            <Icon name="pencil-edit" size="base" />
                          </button>
                          <button
                            type="button"
                            aria-label="Eliminar gasto"
                            onClick={e => {
                              e.stopPropagation()
                              handleDeleteDraftExpense(expense, i)
                            }}
                            className="size-8 inline-flex items-center justify-center rounded-lg text-ds-secondary dark:text-dark-secondary hover:bg-surface dark:hover:bg-dark-hover hover:text-danger transition-colors cursor-pointer"
                          >
                            <Icon name="delete" size="base" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Acciones PDF */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              leadingIcon="download"
              onClick={handleDownload}
              loading={downloading}
              disabled={selectedIds.size === 0}
            >
              {downloading ? 'Generando...' : 'Descargar PDF'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              leadingIcon="share"
              onClick={handleShare}
              loading={sharing}
              disabled={selectedIds.size === 0}
            >
              {sharing ? 'Compartiendo...' : 'Compartir'}
            </Button>
          </div>

          <p className="text-[11px] text-ds-secondary dark:text-dark-secondary text-center">
            Cerrado el{' '}
            {new Date(report.closed_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </Modal>

      {subModal !== null && (
        <ReportExpenseModal
          key={subModal === 'new' ? 'new' : subModal.id}
          initial={subModal === 'new' ? null : subModal}
          onClose={() => setSubModal(null)}
          onSave={handleCommitExpense}
        />
      )}
    </>
  )
}
