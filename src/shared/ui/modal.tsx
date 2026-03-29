import { Icon } from './icon'
import { useModalCore } from '../hooks/use-modal-core'
import { cn } from '../../core/utils/cn'

interface ModalProps {
  title: string
  icon: string
  onClose: () => void
  children: React.ReactNode
  /** Por encima del valor por defecto cuando hay modales anidados (ej. z-[100]). */
  zIndexClass?: string
}

export const Modal = ({ title, icon, onClose, children, zIndexClass = 'z-50' }: ModalProps) => {
  const { panelRef, handleTabKey } = useModalCore({ onClose })

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        'fixed inset-0 flex items-end sm:items-center justify-center',
        zIndexClass,
      )}
      onKeyDown={handleTabKey}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel — Technical Precision Aesthetic */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:max-w-md bg-white dark:bg-dark-surface border border-ds-border dark:border-dark-border rounded-none shadow-2xl animate-fade-in-up"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ds-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Icon name={icon} size="xl" className="text-ds-secondary dark:text-dark-secondary" />
            <h2 className="text-base font-semibold text-ds-text dark:text-dark-text tracking-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            className="size-8 inline-flex items-center justify-center rounded-none text-ds-secondary dark:text-dark-secondary hover:bg-surface dark:hover:bg-dark-hover hover:text-ds-text dark:hover:text-dark-text transition-colors cursor-pointer"
          >
            <Icon name="cancel" size="xl" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
