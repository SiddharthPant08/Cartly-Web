import { forwardRef } from 'react'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-card',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-card',
  outline: 'border border-ink-300 text-ink-900 hover:border-primary-500 hover:text-primary-600 bg-white',
  ghost: 'text-ink-700 hover:bg-ink-100',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
