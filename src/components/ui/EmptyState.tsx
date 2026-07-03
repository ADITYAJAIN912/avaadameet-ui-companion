import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionHint?: string
  className?: string
  children?: React.ReactNode
  bare?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHint,
  className = '',
  children,
  bare = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center px-6 py-10 text-center ${
        bare ? '' : 'container-surface'
      } ${className}`}
      role="status"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-tealLight/80 ring-1 ring-brand-teal/8">
        <Icon className="h-5 w-5 text-brand-teal" aria-hidden strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-card-heading">{title}</h3>
      {description && (
        <p className="mt-2.5 max-w-md text-body leading-relaxed text-neutral-muted">{description}</p>
      )}
      {actionHint && (
        <p className="mt-3 max-w-md text-caption leading-relaxed text-neutral-muted/90">{actionHint}</p>
      )}
      {children && <div className="mt-7 w-full max-w-sm">{children}</div>}
    </div>
  )
}
