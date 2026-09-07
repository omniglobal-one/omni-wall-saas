import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  cta?: React.ReactNode
}

export function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      {icon && (
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="mb-1 font-semibold">{title}</h3>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  )
}
