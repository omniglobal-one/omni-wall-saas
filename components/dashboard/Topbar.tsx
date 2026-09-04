import type { ReactNode } from 'react'

interface TopbarProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-omni-border bg-omni-surface px-4 py-4 sm:px-8 sm:py-5">
      <div className="min-w-0">
        <h1 className="font-display text-h1 font-semibold text-omni-ink sm:text-h1-lg">{title}</h1>
        {subtitle ? <div className="mt-0.5 flex items-center gap-2 text-small text-omni-ink-soft">{subtitle}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
