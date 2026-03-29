import { useState, useEffect, useCallback } from 'react'
import type { MonthlyReport } from '../../../types/database'
import { fetchReports, closeMonth, deleteReport, updateReport } from '../services/report-service'
import type { ReportInsert, ReportUpdatePayload } from '../services/report-service'
import { useAuth } from '../../auth'
import { toast } from 'sonner'

export const useReports = () => {
  const { user } = useAuth()
  const [reports, setReports] = useState<MonthlyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null)

  const loadReports = useCallback(async () => {
    if (!user) {
      setReports([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await fetchReports()
    if (error) {
      toast.error(`Error al cargar reportes: ${error}`)
    } else {
      setReports(data)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        setReports([])
        setLoading(false)
        return
      }
      setLoading(true)
      const { data, error } = await fetchReports()
      if (cancelled) return
      if (error) {
        toast.error(`Error al cargar reportes: ${error}`)
      } else {
        setReports(data)
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleCloseMonth = useCallback(
    async (report: ReportInsert, onSuccess?: () => void) => {
      const { error } = await closeMonth(report)
      if (error) {
        toast.error(`Error al cerrar el mes: ${error}`)
      } else {
        toast.success(`Reporte "${report.label}" guardado`)
        await loadReports()
        onSuccess?.()
      }
    },
    [loadReports],
  )

  const handleDeleteReport = useCallback(
    async (id: string, label: string) => {
      const { error } = await deleteReport(id)
      if (error) {
        toast.error(`Error al eliminar: ${error}`)
      } else {
        toast.success(`Reporte "${label}" eliminado`)
        setReports(prev => prev.filter(r => r.id !== id))
        if (selectedReport?.id === id) setSelectedReport(null)
      }
    },
    [selectedReport],
  )

  const handleUpdateReport = useCallback(
    async (id: string, payload: ReportUpdatePayload) => {
      const { data, error } = await updateReport(id, payload)
      if (error || !data) {
        toast.error(`Error al guardar: ${error ?? 'Sin respuesta'}`)
        return false
      }
      toast.success('Reporte actualizado')
      setReports(prev => prev.map(report => (report.id === id ? data : report)))
      if (selectedReport?.id === id) setSelectedReport(data)
      return true
    },
    [selectedReport],
  )

  return {
    reports,
    loading,
    selectedReport,
    setSelectedReport,
    handleCloseMonth,
    handleDeleteReport,
    handleUpdateReport,
    refreshReports: loadReports,
  }
}
