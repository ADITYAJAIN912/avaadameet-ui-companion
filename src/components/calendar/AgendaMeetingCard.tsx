import { Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { AvatarGroup } from '../ui/AvatarGroup'
import { Button } from '../ui/Button'

interface AgendaMeetingCardProps {
  event: CalendarEvent
  compact?: boolean
}

export function AgendaMeetingCard({ event, compact = false }: AgendaMeetingCardProps) {
  const styles = getEventStyles(event.category)
  const platformLabel = event.platform === 'GOOGLE' ? 'Google Meet' : event.meetingType

  if (compact) {
    return (
      <div className={`rounded-lg border-l-[3px] p-2.5 ${styles.card}`}>
        <p className="truncate text-caption font-medium text-neutral-text">{event.title}</p>
        <p className="mt-0.5 text-[11px] text-neutral-muted">
          {event.time} · {event.host}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <AvatarGroup attendees={event.attendees} max={3} size="sm" />
          <Button variant="primary" className="h-7 shrink-0 px-2.5 text-[10px]">
            <Video className="h-3 w-3" strokeWidth={1.75} />
            Join
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-neutral-border/50 border-l-[3px] p-3 ${styles.card}`}>
      <p className="truncate text-body font-medium text-neutral-text">{event.title}</p>
      <p className="mt-0.5 text-meta">
        {event.time} · {event.durationMinutes} min · {event.host}
      </p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <AvatarGroup attendees={event.attendees} max={4} size="sm" />
        <div className="flex shrink-0 items-center gap-2">
          <span className="badge-pill bg-white/80 text-neutral-muted ring-1 ring-neutral-border/50">
            {platformLabel}
          </span>
          <Button variant="primary" className="h-8 px-3 text-caption">
            <Video className="h-3.5 w-3.5" strokeWidth={1.75} />
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}
