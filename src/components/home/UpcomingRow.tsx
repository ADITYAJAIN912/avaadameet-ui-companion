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
          <span className="mt-1 w-px min-h-[0.75rem] flex-1 max-h-full bg-neutral-border/50" aria-hidden />
        )}
      </div>

      <div
        className={`group mb-2 min-w-0 flex-1 rounded-lg px-2.5 py-1.5 ease-premium last:mb-0 hover:bg-neutral-bg/60 ${
          highlight === 'now' ? 'bg-brand-tealLight/40' : highlight === 'soon' ? 'bg-brand-tealLight/20' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-medium text-neutral-text">{meeting.title}</p>
            <p className="mt-0.5 text-caption font-medium tabular-nums text-neutral-text/80">
              {meeting.time}
            </p>
            <p className="mt-0.5 truncate text-micro text-neutral-muted max-sm:hidden">
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
      className={`panel-surface panel-surface-accent flex h-full min-h-0 flex-col ${className}`}
    >
      <div className="surface-clip flex min-h-0 flex-1 flex-col p-4">
        <div className="flex shrink-0 items-center justify-between gap-2">
          <h2 className="text-section-title">Upcoming Meetings</h2>
          {meetings.length > 0 && (
            <span className="dash-count">{meetings.length}</span>
          )}
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
          className="focus-ring mt-3 inline-block shrink-0 text-small font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
        >
          View all meetings →
        </Link>
      </div>
    </section>
  )
}
