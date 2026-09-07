import React from 'react'
import { Slot } from '@radix-ui/react-slot'

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success',
  ghost: 'inline-flex items-center justify-center gap-2 bg-transparent hover:bg-bg-border text-text-secondary text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: '',
  lg: 'text-base px-6 py-3',
}

export function Button({ variant = 'primary', size = 'md', asChild = false, className = '', children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </Comp>
  )
}
