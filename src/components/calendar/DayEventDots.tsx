import type { CalendarEvent } from '../../types/calendar'
import { getEventStyles } from '../../utils/calendarEventStyles'

const MAX_DOTS = 4

interface DayEventDotsProps {
  events: CalendarEvent[]
}

export function DayEventDots({ events }: DayEventDotsProps) {
  if (events.length === 0) return null

  const dots = events.slice(0, MAX_DOTS)
  const overflow = events.length - MAX_DOTS

  return (
    <div className="mt-auto flex items-center gap-1 pt-1">
      <div className="flex items-center gap-0.5">
        {dots.map((ev) => {
          const { dot } = getEventStyles(ev.category)
          return (
            <span
              key={ev.id}
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
              title={ev.title}
            />
          )
        })}
      </div>
      {overflow > 0 && (
        <span className="text-[10px] font-medium tabular-nums text-neutral-muted">+{overflow}</span>
      )}
    </div>
  )
}
