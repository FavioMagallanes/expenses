// NUEVA ESTRUCTURA DE CATEGORÍAS
export type CategoryType =
  | 'fixed'
  | 'variable'
  | 'credit_card'
  | 'loan'
  | 'savings'
  | 'debt'
  | 'other'

export interface Category {
  id: string
  label: string
  type: CategoryType
  color: string
  icon?: string
  requiresBank?: boolean
  subcategories?: Category[]
}

export const BANKS_AR = [
  'Banco Nación',
  'Banco Provincia',
  'Banco Ciudad',
  'Banco Galicia',
  'Banco Santander',
  'Banco BBVA',
  'Banco Macro',
  'Banco HSBC',
  'Banco ICBC',
  'Banco Supervielle',
  'Banco Patagonia',
  'Banco Credicoop',
  'Banco Itaú',
  'Banco Comafi',
  'Banco Columbia',
  'Banco Hipotecario',
  'Brubank',
  'Banco del Sol',
  'Wilobank',
  'Reba',
]

export const CATEGORIES: Category[] = [
  {
    id: 'alquiler',
    label: 'Alquiler',
    type: 'fixed',
    color: '#f59e42',
    icon: 'home',
  },
  {
    id: 'expensas',
    label: 'Expensas',
    type: 'fixed',
    color: '#fbbf24',
    icon: 'building',
  },
  {
    id: 'servicios',
    label: 'Servicios',
    type: 'fixed',
    color: '#38bdf8',
    icon: 'bolt',
    subcategories: [
      { id: 'luz', label: 'Luz', type: 'fixed', color: '#fde047', icon: 'sun' },
      { id: 'gas', label: 'Gas', type: 'fixed', color: '#f87171', icon: 'fire' },
      { id: 'agua', label: 'Agua', type: 'fixed', color: '#60a5fa', icon: 'droplet' },
      { id: 'internet', label: 'Internet', type: 'fixed', color: '#818cf8', icon: 'wifi' },
      { id: 'telefono', label: 'Teléfono', type: 'fixed', color: '#a3e635', icon: 'phone' },
    ],
  },
  {
    id: 'seguros',
    label: 'Seguros',
    type: 'fixed',
    color: '#f472b6',
    icon: 'shield',
  },
  {
    id: 'supermercado',
    label: 'Supermercado',
    type: 'variable',
    color: '#34d399',
    icon: 'shopping-cart',
  },
  {
    id: 'comidas',
    label: 'Comidas fuera de casa',
    type: 'variable',
    color: '#f87171',
    icon: 'utensils',
  },
  {
    id: 'transporte',
    label: 'Transporte',
    type: 'variable',
    color: '#60a5fa',
    icon: 'bus',
  },
  {
    id: 'salud',
    label: 'Salud',
    type: 'variable',
    color: '#f472b6',
    icon: 'heart',
  },
  {
    id: 'educacion',
    label: 'Educación',
    type: 'variable',
    color: '#fbbf24',
    icon: 'book',
  },
  {
    id: 'mascotas',
    label: 'Mascotas',
    type: 'variable',
    color: '#a3e635',
    icon: 'paw',
  },
  {
    id: 'ocio',
    label: 'Ocio y entretenimiento',
    type: 'variable',
    color: '#818cf8',
    icon: 'gamepad',
  },
  {
    id: 'ropa',
    label: 'Ropa y calzado',
    type: 'variable',
    color: '#f59e42',
    icon: 'tshirt',
  },
  {
    id: 'tarjeta_credito',
    label: 'Tarjeta de crédito',
    type: 'credit_card',
    color: '#38bdf8',
    icon: 'credit-card',
    requiresBank: true,
  },
  {
    id: 'prestamo',
    label: 'Préstamo',
    type: 'loan',
    color: '#f87171',
    icon: 'dollar-sign',
    requiresBank: true,
  },
  {
    id: 'ahorro',
    label: 'Ahorro',
    type: 'savings',
    color: '#a3e635',
    icon: 'piggy-bank',
  },
  {
    id: 'deuda',
    label: 'Deuda',
    type: 'debt',
    color: '#f472b6',
    icon: 'file-invoice-dollar',
    requiresBank: true,
  },
  {
    id: 'otros',
    label: 'Otros',
    type: 'other',
    color: '#a1a1aa',
    icon: 'dots-horizontal',
  },
]

export const CATEGORY_LABELS: Record<string, string> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c.label
    if (c.subcategories) c.subcategories.forEach(sc => (acc[sc.id] = sc.label))
    return acc
  },
  {} as Record<string, string>,
)

/**
 * Expense — Modelo de gasto mensual.
 *
 * - `totalAmount`  → Monto que se paga **este mes** (la cuota, no el total del producto).
 * - `installment`  → Texto libre con formato "X/Y" (ej: "1/6").
 *                     Solo se usa cuando la categoría es tarjeta (BBVA o SUPERVIELLE).
 *                     Es informativo; NO se usa para calcular montos.
 * - `category`     → Método de pago / origen del gasto.
 * - `description`  → Detalle opcional del gasto (ej: "Heladera", "Netflix").
 */
export interface Expense {
  id: string
  description?: string
  categoryId: string // id de la categoría
  /** Monto de la cuota que se paga este mes */
  totalAmount: number
  /**
   * Indicador de cuota en formato libre "X/Y" (ej: "2/6").
   * Solo presente cuando category es BBVA o SUPERVIELLE.
   */
  installment?: string
  registeredAt: string
  banco?: string // solo si la categoría lo requiere
}

export interface Budget {
  amount: number
  configuredAt: string
}

export interface MonthlySummary {
  budget: number
  totalSpent: number
  remainingBalance: number
  isOverBudget: boolean
}

export const isCardCategory = (id?: string, categories: Category[] = CATEGORIES): boolean => {
  if (!id) return false
  for (const c of categories) {
    if (c.id === id) return c.type === 'credit_card'
    if (c.subcategories && isCardCategory(id, c.subcategories)) return true
  }
  return false
}
