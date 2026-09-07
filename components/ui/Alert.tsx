import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type AlertTone = 'success' | 'warning' | 'error' | 'info'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone: AlertTone
  title?: string
}

const toneClasses: Record<AlertTone, string> = {
  success: 'bg-success/10 border-success/20 text-success',
  warning: 'bg-warning/10 border-warning/20 text-warning',
  error: 'bg-danger/10 border-danger/20 text-danger',
  info: 'bg-primary/10 border-primary/20 text-primary',
}

export function Alert({ tone, title, className, children, ...props }: AlertProps) {
  return (
    <div role="alert" className={cn('flex gap-3 rounded-lg border px-4 py-3 text-sm', toneClasses[tone], className)} {...props}>
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  )
}
