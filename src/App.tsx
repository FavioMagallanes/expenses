import { useExpenseStore } from './store/expense-store'
import { Dashboard } from './features/dashboard'
import { NewExpenseModal, EditExpenseModal } from './features/expenses'
import { Button } from './shared/ui/button'
import { Toaster } from 'sonner'

/* ─── App root ───────────────────────────────────────────────────────── */
const App = () => {
  const isModalOpen = useExpenseStore(s => s.isModalOpen)
  const editingExpense = useExpenseStore(s => s.editingExpense)
  const openModal = useExpenseStore(s => s.openModal)

  return (
    <div className="min-h-screen bg-white">
      <Dashboard />

      {/* FAB — solo visible en mobile, en desktop el botón está inline */}
      <Button
        variant="primary"
        size="lg"
        aria-label="Nuevo gasto"
        onClick={openModal}
        className="md:hidden fixed bottom-6 right-6 size-14! rounded-full! shadow-lg hover:scale-105 active:scale-95 transition-transform z-40"
        leadingIcon="add"
      />

      {isModalOpen && !editingExpense && <NewExpenseModal />}
      <EditExpenseModal />

      <Toaster
        position="bottom-center"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '13px',
          },
        }}
      />
    </div>
  )
}

export default App
