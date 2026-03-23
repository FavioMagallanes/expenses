import { CATEGORY_LABELS } from '../../types'
import type { Category } from '../../types'

interface CategoryPickerProps {
  value: Category
  onChange: (category: Category) => void
}

const CATEGORIES: Category[] = ['BBVA', 'SUPERVIELLE', 'PRESTAMO', 'OTROS']

/**
 * CategoryPicker — Select dropdown alineado con Stitch design system.
 * Reemplaza el grid de chips por un <select> nativo con estilo consistente.
 */
export const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-xs font-semibold text-ds-secondary uppercase tracking-wider">
      Categoría
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value as Category)}
        className="w-full appearance-none border border-ds-border rounded-lg bg-surface px-3 py-2.5 pr-10 text-ds-text font-medium text-sm outline-none transition-all focus:ring-1 focus:ring-primary/50 cursor-pointer"
      >
        {CATEGORIES.map(category => (
          <option key={category} value={category}>
            {CATEGORY_LABELS[category]}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ds-secondary text-base pointer-events-none">
        unfold_more
      </span>
    </div>
  </div>
)
