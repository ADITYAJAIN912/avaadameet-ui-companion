import { Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import { formatCompactEventTime } from '../../utils/calendar'
import { getEventScheduleLayout } from '../../utils/calendarSchedule'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { Button } from '../ui/Button'

interface ScheduleEventBlockProps {
  event: CalendarEvent
  density: 'week' | 'day'
}

export function ScheduleEventBlock({ event, density }: ScheduleEventBlockProps) {
  const { topPercent, heightPercent } = getEventScheduleLayout(event)
  if (heightPercent <= 0) return null

  const styles = getEventStyles(event.category)
  const time = formatCompactEventTime(event.time)
  const isCompact = heightPercent < 7
  const showDetails = density === 'day' && heightPercent >= 10

  return (
    <div
      className={`absolute right-0.5 left-0.5 z-[1] overflow-hidden rounded-md border-l-[3px] shadow-elevation-1 ease-premium ${styles.stripe} ${styles.pill} hover:z-[2] hover:shadow-elevation-2`}
      style={{ top: `${topPercent}%`, height: `${heightPercent}%`, minHeight: isCompact ? '1.25rem' : '2rem' }}
      title={`${time} ${event.title}`}
    >
      <div className={`flex h-full flex-col ${isCompact ? 'justify-center px-1 py-px' : 'px-1.5 py-1'}`}>
        <p className={`truncate font-medium leading-tight ${isCompact ? 'text-[9px]' : 'text-[10px]'}`}>
          {!isCompact && <span className="tabular-nums">{time}</span>}
          {!isCompact && ' · '}
          {event.title}
        </p>
        {showDetails && (
          <>
            <p className="mt-0.5 truncate text-[10px] opacity-80">{event.host}</p>
            <div className="mt-auto flex items-center justify-between gap-1 pt-1">
              <span className="truncate text-[9px] opacity-70">{event.durationMinutes} min</span>
              <Button variant="primary" className="h-6 shrink-0 px-2 text-[9px]">
                <Video className="h-2.5 w-2.5" strokeWidth={1.75} />
                Join
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
