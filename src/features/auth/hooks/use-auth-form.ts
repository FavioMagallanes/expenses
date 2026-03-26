import { useState } from 'react'
import { useAuth } from '../context/auth-context'
import { toast } from 'sonner'

export type AuthMode = 'login' | 'signup'

export const useAuthForm = () => {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  const toggleMode = () => {
    setMode(m => (m === 'login' ? 'signup' : 'login'))
    setEmail('')
    setPassword('')
  }

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      toast.warning('Completá todos los campos')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.warning('Ingresá un email válido')
      return false
    }

    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    const error = isLogin ? await signIn(email, password) : await signUp(email, password)
    setLoading(false)

    if (error) {
      toast.error(error)
    } else if (!isLogin) {
      toast.success('¡Cuenta creada! Revisá tu email para confirmar.')
    }
  }

  return {
    mode,
    isLogin,
    email,
    password,
    loading,
    setEmail,
    setPassword,
    toggleMode,
    handleSubmit,
  }
}
