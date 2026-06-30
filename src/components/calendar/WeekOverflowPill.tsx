import type { WeekOverflowBadge } from '../../utils/calendarWeekLayout'

interface WeekOverflowPillProps {
  badge: WeekOverflowBadge
}

export function WeekOverflowPill({ badge }: WeekOverflowPillProps) {
  return (
    <div
      className="absolute z-[4]"
      style={{ top: badge.topPx, right: badge.rightPx }}
      aria-label={badge.label}
      title={badge.label}
    >
      <span className="inline-flex min-w-[1.125rem] items-center justify-center rounded px-1 py-px text-[8px] font-medium tabular-nums text-neutral-muted ring-1 ring-neutral-border/50 bg-white/90">
        +{badge.count}
      </span>
    </div>
  )
}
