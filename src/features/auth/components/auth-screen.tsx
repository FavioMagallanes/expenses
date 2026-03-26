import { Button } from '../../../shared/ui/button'
import { useAuthForm } from '../hooks/use-auth-form'
import { AUTH_UI } from '../constants/styles'

export const AuthScreen = () => {
  const { isLogin, email, password, loading, setEmail, setPassword, toggleMode, handleSubmit } =
    useAuthForm()

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden px-6 md:px-8 bg-background dark:bg-dark-bg transition-colors">
      {/* Fondo técnico con patrón de cuadrícula */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.6] dark:opacity-[0.4] pointer-events-none" />

      <div className={AUTH_UI.CARD}>
        {/* Bordes absolutos decorativos (líneas largas) */}
        <div className="absolute -inset-y-6 -left-px w-px bg-ds-border dark:bg-dark-border" />
        <div className="absolute -inset-y-6 -right-px w-px bg-ds-border dark:bg-dark-border" />
        <div className="absolute -inset-x-6 -top-px h-px bg-ds-border dark:bg-dark-border" />
        <div className="absolute -inset-x-6 -bottom-px h-px bg-ds-border dark:bg-dark-border" />

        <div className="w-full max-w-sm space-y-10">
          <div className="flex flex-col space-y-1.5 items-center">
            <h1 className="font-bold text-3xl tracking-[0.2em] text-ds-text dark:text-dark-text uppercase pl-[0.2em]">
              Gastly<span className="text-primary">.</span>
            </h1>
            <p className="text-[13px] text-ds-secondary dark:text-dark-secondary font-medium tracking-tight">
              {isLogin ? 'Iniciá sesión para continuar' : 'Creá tu cuenta para empezar'}
            </p>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className={AUTH_UI.LABEL}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  autoFocus
                  className={AUTH_UI.INPUT}
                />
              </div>
              <div>
                <label htmlFor="password" className={AUTH_UI.LABEL}>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={AUTH_UI.INPUT}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                className="mt-6 h-12 text-sm uppercase tracking-widest font-semibold"
              >
                {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>
            </form>
            <div className="pt-4 border-t border-ds-border/50 dark:border-dark-border/50 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:text-primary-hover underline-offset-4 font-medium cursor-pointer text-[12px] tracking-wide uppercase"
              >
                {isLogin ? '¿No tenés cuenta? Crear cuenta' : '¿Ya tenés cuenta? Iniciar sesión'}
              </button>
            </div>
          </div>
        </div>

        {/* Capa decorativa superior: Cruces de esquinas (Brillo blanco) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* + esquina superior izquierda */}
          <div className="absolute left-0 top-0 -translate-x-px -translate-y-3 w-px h-6 bg-[#a1a1aa] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <div className="absolute left-0 top-0 -translate-x-3 -translate-y-px h-px w-6 bg-[#a1a1aa] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />

          {/* + esquina inferior derecha */}
          <div className="absolute right-0 bottom-0 translate-x-px translate-y-3 w-px h-6 bg-[#a1a1aa] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-px h-px w-6 bg-[#a1a1aa] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </div>
  )
}
