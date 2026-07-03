import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCountUp } from '../../hooks/useCountUp'

interface StatCardProps {
  value: number | string
  label: string
  icon: LucideIcon
  to: string
  trend?: string
  trendPositive?: boolean
  trendNegative?: boolean
  caption?: string
  animate?: boolean
}

export function StatCard({
  value,
  label,
  icon: Icon,
  to,
  trend,
  trendPositive,
  trendNegative,
  caption,
  animate = true,
}: StatCardProps) {
  const navigate = useNavigate()
  const numericValue = typeof value === 'number' ? value : null
  const animated = useCountUp(numericValue ?? 0, 700, animate && numericValue !== null)

  const trendColor = trendPositive
    ? 'text-brand-teal'
    : trendNegative
      ? 'text-status-danger'
      : 'text-neutral-muted'

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="panel-surface focus-ring group flex min-h-[5rem] w-full flex-col p-3 text-left ease-premium hover:border-brand-teal/25"
      aria-label={`${label}, ${numericValue !== null ? value : String(value)}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-small font-medium leading-snug text-neutral-muted">{label}</span>
        <span className="icon-well icon-well-neutral ease-premium group-hover:bg-brand-tealLight/50">
          <Icon
            className="h-3.5 w-3.5 ease-premium group-hover:text-brand-teal"
            strokeWidth={1.75}
          />
        </span>
      </div>
      <span className="mt-1.5 text-stat font-bold tabular-nums tracking-tight text-neutral-text">
        {numericValue !== null ? animated : value}
      </span>
      {trend ? (
        <span className={`mt-0.5 text-small leading-snug ${trendColor}`}>
          {trendPositive && '↑ '}
          {trendNegative && '↓ '}
          {trend}
        </span>
      ) : (
        <span className="mt-0.5 text-small leading-snug text-transparent" aria-hidden>
          —
        </span>
      )}
      {caption ? (
        <span className="mt-0.5 text-micro leading-snug text-neutral-muted">{caption}</span>
      ) : (
        <span className="mt-0.5 text-micro leading-snug text-transparent" aria-hidden>
          —
        </span>
      )}
    </button>
  )
}
