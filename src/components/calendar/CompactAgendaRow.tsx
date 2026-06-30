import type { CalendarEvent } from '../../types/calendar'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { Button } from '../ui/Button'
import { Video } from 'lucide-react'

interface CompactAgendaRowProps {
  event: CalendarEvent
  variant?: 'featured' | 'timeline'
}

export function CompactAgendaRow({ event, variant = 'timeline' }: CompactAgendaRowProps) {
  const styles = getEventStyles(event.category)

  if (variant === 'featured') {
    return (
      <div className={`rounded-xl border border-neutral-border/50 p-4 ${styles.card}`}>
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-muted">
          Up next
        </p>
        <p className="mt-1 text-body font-semibold text-neutral-text">{event.title}</p>
        <p className="mt-1 text-caption text-neutral-muted">
          {event.time} · {event.host}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="truncate text-caption text-neutral-muted">{event.meetingType}</span>
          <Button variant="primary" className="h-8 shrink-0 px-3 text-caption">
            <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
            Join
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex gap-3 py-2">
      <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
        <span className="text-caption font-medium tabular-nums text-neutral-text">{event.time}</span>
      </div>
      <div className="relative min-w-0 flex-1 border-l border-neutral-border/60 pl-3">
        <span className={`absolute top-2 -left-[3px] h-1.5 w-1.5 rounded-full ${styles.dot}`} />
        <p className="truncate text-caption font-medium text-neutral-text">{event.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-neutral-muted">
          {event.host} · {event.meetingType}
        </p>
      </div>
    </div>
  )
}
