import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <input ref={ref} id={inputId} className={`input ${error ? 'border-danger' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
})
