import { ChevronRight } from 'lucide-react'
import type { Meeting } from '../../types/meeting'
import { isMeetingPastOrCompleted } from '../../utils/meetings'
import {
  formatDuration,
  getMeetingDurationMinutes,
  getPlatformLabel,
  getStartsInLabel,
} from '../../utils/meetingMeta'
import { AvatarGroup } from '../ui/AvatarGroup'
import { Toggle } from '../ui/Toggle'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { getDisplayAttendees } from '../../utils/meetingDisplay'

interface MeetingCardProps {
  meeting: Meeting
  onAutoJoinChange: (id: string, value: boolean) => void
}

export function MeetingCard({ meeting, onAutoJoinChange }: MeetingCardProps) {
  const isPast = isMeetingPastOrCompleted(meeting)
  const displayAttendees = getDisplayAttendees(meeting)
  const duration = formatDuration(getMeetingDurationMinutes(meeting))
  const platform = getPlatformLabel(meeting.source)
  const startsIn = !isPast ? getStartsInLabel(meeting) : null

  return (
    <Card
      variant="interactive"
      className={`flex min-h-[6.25rem] flex-col p-2.5 ${isPast ? 'row-completed' : ''}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-body font-medium leading-snug text-neutral-text">
            {meeting.title}
          </p>
          {isPast && (
            <Badge variant="completed" className="shrink-0 text-[10px]">
              Completed
            </Badge>
          )}
        </div>

        <p
          className={`mt-0.5 text-caption font-semibold tabular-nums ${
            isPast ? 'text-neutral-muted' : 'text-neutral-text'
          }`}
        >
          {meeting.time}
        </p>

        <p className="mt-0.5 truncate text-[11px] text-neutral-muted">
          <span>{meeting.host}</span>
          <span className="text-neutral-border"> · </span>
          <span>{duration}</span>
          <span className="text-neutral-border"> · </span>
          <span>{platform}</span>
          <span className="text-neutral-border"> · </span>
          <span>
            {displayAttendees.length} attendee{displayAttendees.length !== 1 ? 's' : ''}
          </span>
          {startsIn && (
            <>
              <span className="text-neutral-border"> · </span>
              <span className="font-medium text-brand-teal">{startsIn}</span>
            </>
          )}
        </p>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          {!isPast && (
            <>
              <span className="shrink-0 text-[11px] text-neutral-muted">Auto Join</span>
              <span className="text-neutral-border/80" aria-hidden>
                |
              </span>
              <Toggle
                checked={meeting.autoJoin}
                onChange={(v) => onAutoJoinChange(meeting.id, v)}
                ariaLabel={`Auto join ${meeting.title}`}
                size="sm"
              />
              <span className="mx-0.5 text-neutral-border/80" aria-hidden>
                |
              </span>
            </>
          )}
          <button
            type="button"
            className="focus-ring inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-muted ease-premium hover:bg-neutral-bg hover:text-neutral-text"
            aria-label={`Open ${meeting.title}`}
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>

        <AvatarGroup attendees={displayAttendees} max={3} size="sm" />
      </div>
    </Card>
  )
}
