import type { ScheduleOverflowBadge } from '../../utils/calendarSchedule'

interface ScheduleOverflowPillProps {
  badge: ScheduleOverflowBadge
}

export function ScheduleOverflowPill({ badge }: ScheduleOverflowPillProps) {
  return (
    <div
      className="absolute z-[2] flex items-center justify-center overflow-hidden rounded-md border border-neutral-border/60 bg-neutral-bg/90 px-1 text-[9px] font-medium text-neutral-muted shadow-elevation-1"
      style={{
        top: `${badge.topPercent}%`,
        height: `${badge.heightPercent}%`,
        left: `calc(${badge.leftPercent}% + 2px)`,
        width: `calc(${badge.widthPercent}% - 4px)`,
      }}
      aria-label={badge.label}
    >
      +{badge.count} more
    </div>
  )
}
