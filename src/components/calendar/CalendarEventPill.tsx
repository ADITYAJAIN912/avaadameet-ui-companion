import type { CalendarEvent } from '../../types/calendar'
import { formatCompactEventTime } from '../../utils/calendar'
import { getEventStyles } from '../../utils/calendarEventStyles'

interface CalendarEventPillProps {
  event: CalendarEvent
  compact?: boolean
}

export function CalendarEventPill({ event, compact = false }: CalendarEventPillProps) {
  const styles = getEventStyles(event.category)
  const time = formatCompactEventTime(event.time)

  return (
    <div
      className={`min-w-0 border-l-2 ${styles.stripe} ${styles.pill} ease-premium ${
        compact
          ? 'rounded px-1 py-0.5 text-[10px] leading-snug'
          : 'rounded-md px-1.5 py-0.5 text-[11px] leading-snug'
      }`}
      title={`${time} ${event.title}`}
    >
      <span className="font-semibold tabular-nums">{time}</span>{' '}
      <span className="font-normal">{event.title}</span>
    </div>
  )
}
