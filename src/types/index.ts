export type Category = 'BBVA' | 'SUPERVIELLE' | 'PRESTAMO' | 'OTROS'

export interface Gasto {
  id: string
  descripcion?: string
  categoria: Category
  monto_total: number
  cuota_actual?: number
  total_cuotas?: number
  monto_por_cuota?: number
  fecha_registro: string
}

export interface Presupuesto {
  monto: number
  fecha_configuracion: string
}

export interface ResumenMensual {
  presupuesto: number
  total_gastado: number
  saldo_restante: number
  es_negativo: boolean
}

export const CATEGORIAS_TARJETA: Category[] = ['BBVA', 'SUPERVIELLE']

export const CATEGORIA_LABELS: Record<Category, string> = {
  BBVA: 'Tarjeta BBVA',
  SUPERVIELLE: 'Tarjeta Supervielle',
  PRESTAMO: 'Préstamo',
  OTROS: 'Otros',
}

export const esTarjeta = (cat: Category): boolean => CATEGORIAS_TARJETA.includes(cat)
