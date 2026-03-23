interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'danger' | 'ghost'
  fullWidth?: boolean
}

export const PrimaryButton = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
}: PrimaryButtonProps) => {
  const base =
    'px-4 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-surface-container-low text-primary border border-primary',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  )
}
