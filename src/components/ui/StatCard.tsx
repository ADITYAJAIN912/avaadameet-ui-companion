import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCountUp } from '../../hooks/useCountUp'
import { Card } from './Card'

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
    <Card
      variant="interactive"
      as="button"
      type="button"
      onClick={() => navigate(to)}
      className="group focus-ring flex min-h-[4.75rem] w-full flex-col p-2.5 text-left shadow-sm ease-premium hover:-translate-y-px hover:shadow-md"
      aria-label={`${label}, ${numericValue !== null ? value : String(value)}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium leading-snug text-neutral-muted">{label}</span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-bg/80 ease-premium group-hover:bg-brand-tealLight/50">
          <Icon
            className="h-3 w-3 text-neutral-muted/50 ease-premium group-hover:text-brand-teal/70"
            strokeWidth={1.5}
          />
        </span>
      </div>
      <span className="mt-1 text-stat font-bold tabular-nums tracking-tight text-neutral-text">
        {numericValue !== null ? animated : value}
      </span>
      {trend ? (
        <span className={`mt-0.5 text-[11px] leading-snug ${trendColor}`}>
          {trendPositive && '↑ '}
          {trendNegative && '↓ '}
          {trend}
        </span>
      ) : (
        <span className="mt-0.5 text-[11px] leading-snug text-transparent" aria-hidden>
          —
        </span>
      )}
      {caption ? (
        <span className="mt-0.5 text-[10px] leading-snug text-neutral-muted/80">{caption}</span>
      ) : (
        <span className="mt-0.5 text-[10px] leading-snug text-transparent" aria-hidden>
          —
        </span>
      )}
    </Card>
  )
}
