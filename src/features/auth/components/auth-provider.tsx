import { AuthContext } from '../context/auth-context'
import { useAuthProvider } from '../hooks/use-auth-provider'

/**
 * AuthProvider — Provee el contexto de autenticación a toda la app.
 * Se usa una sola vez en App.tsx, envolviendo el contenido principal.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useAuthProvider()
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
