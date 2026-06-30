import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import type { Meeting } from '../../types/meeting'
import { Toggle } from '../ui/Toggle'
import { EmptyState } from '../ui/EmptyState'
import { getDisplayAttendees } from '../../utils/meetingDisplay'
import { getMeetingRowHighlight, getPlatformLabel, formatDuration, getMeetingDurationMinutes } from '../../utils/meetingMeta'

interface UpcomingRowProps {
  meeting: Meeting
  onAutoJoinChange: (id: string, value: boolean) => void
  isLast?: boolean
}

export function UpcomingRow({ meeting, onAutoJoinChange, isLast = false }: UpcomingRowProps) {
  const highlight = getMeetingRowHighlight(meeting, false)
  const attendees = getDisplayAttendees(meeting)
  const duration = formatDuration(getMeetingDurationMinutes(meeting))
  const platform = getPlatformLabel(meeting.source)
  const dotClass =
    highlight === 'now'
      ? 'border-brand-teal bg-brand-teal'
      : highlight === 'soon'
        ? 'border-brand-teal/60 bg-brand-tealLight'
        : 'border-neutral-border bg-white'

  return (
    <li className="relative flex gap-3 pl-1">
      <div className="flex w-4 shrink-0 flex-col items-center">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 ${dotClass} ring-2 ring-white ease-premium`}
          aria-hidden
        />
        {!isLast && (
          <span className="mt-1 w-px flex-1 bg-neutral-border/50" aria-hidden />
        )}
      </div>

      <div
        className={`group mb-2 min-w-0 flex-1 rounded-lg px-2 py-1 ease-premium last:mb-0 hover:bg-neutral-bg/60 ${
          highlight === 'now' ? 'bg-brand-tealLight/40' : highlight === 'soon' ? 'bg-brand-tealLight/20' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-medium text-neutral-text">{meeting.title}</p>
            <p className="mt-0.5 text-caption font-medium tabular-nums text-neutral-text/80">
              {meeting.time}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-neutral-muted/60 transition-colors duration-150 group-hover:text-neutral-muted group-focus-within:text-neutral-muted max-sm:hidden">
              {duration} · {platform} · {attendees.length} attendee
              {attendees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Toggle
            checked={meeting.autoJoin}
            onChange={(v) => onAutoJoinChange(meeting.id, v)}
            ariaLabel={`Auto join ${meeting.title}`}
            size="sm"
          />
        </div>
      </div>
    </li>
  )
}

interface UpcomingSectionProps {
  meetings: Meeting[]
  onAutoJoinChange: (id: string, value: boolean) => void
  className?: string
}

export function UpcomingSection({
  meetings,
  onAutoJoinChange,
  className = '',
}: UpcomingSectionProps) {
  return (
    <section
      className={`card-surface-primary flex min-h-0 flex-col overflow-hidden p-3 shadow-sm ease-premium hover:shadow-md ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-section-title">Upcoming Meetings</h2>
        {meetings.length > 0 && (
          <span className="rounded-md bg-brand-tealLight/70 px-1.5 py-px text-[10px] font-medium tabular-nums text-brand-teal">
            {meetings.length}
          </span>
        )}
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
        {meetings.length === 0 ? (
          <EmptyState
            bare
            icon={Calendar}
            title="No upcoming meetings"
            description="You're all caught up for the rest of today."
            actionHint="View the full schedule on the Meetings page."
            className="py-5"
          />
        ) : (
          <ul aria-label="Upcoming meetings timeline">
            {meetings.map((m, i) => (
              <UpcomingRow
                key={m.id}
                meeting={m}
                onAutoJoinChange={onAutoJoinChange}
                isLast={i === meetings.length - 1}
              />
            ))}
          </ul>
        )}
      </div>

      <Link
        to="/meetings"
        className="focus-ring mt-2 inline-block shrink-0 rounded-md text-[11px] font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
      >
        View all meetings →
      </Link>
    </section>
  )
}
