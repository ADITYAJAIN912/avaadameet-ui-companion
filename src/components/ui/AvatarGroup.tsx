import type { MeetingAttendee } from '../../types/meeting'
import { getPersonKey } from '../../utils/helpers'
import { Avatar } from './Avatar'

interface AvatarGroupProps {
  attendees: MeetingAttendee[]
  max?: number
  size?: 'sm' | 'md'
  compact?: boolean
}

export function AvatarGroup({
  attendees,
  max = 3,
  size = 'sm',
  compact = false,
}: AvatarGroupProps) {
  if (compact) {
    return (
      <span className="whitespace-nowrap text-caption text-neutral-muted">
        {attendees.length} attendee{attendees.length !== 1 ? 's' : ''}
      </span>
    )
  }

  const visible = attendees.slice(0, max)
  const overflow = attendees.length - max
  const overflowSize = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-caption'

  return (
    <div className="flex items-center -space-x-2.5" aria-label={`${attendees.length} attendees`}>
      {visible.map((a, i) => (
        <Avatar
          key={getPersonKey(a.name, a.email) || `${a.name}-${i}`}
          name={a.name}
          email={a.email}
          avatarUrl={a.avatarUrl}
          size={size}
          className="hover:z-10 hover:scale-105"
        />
      ))}
      {overflow > 0 && (
        <div
          className={`flex items-center justify-center rounded-full border border-neutral-border bg-surface-raised font-medium text-neutral-muted shadow-sm ring-2 ring-surface ${overflowSize}`}
          aria-label={`${overflow} more attendees`}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
