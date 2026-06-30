import { useState } from 'react'
import type { Meeting } from '../../types/meeting'
import { formatDisplayDate } from '../../utils/helpers'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'
import { MeetingListRow } from './MeetingListRow'
import { MeetingCard } from './MeetingCard'

const DEFAULT_VISIBLE = 4

interface DayGroupSectionProps {
  label: string
  date: string
  meetings: Meeting[]
  view: 'list' | 'grid'
  onAutoJoinChange: (id: string, value: boolean) => void
}

export function DayGroupSection({
  label,
  date,
  meetings,
  view,
  onAutoJoinChange,
}: DayGroupSectionProps) {
  const [expanded, setExpanded] = useState(false)

  if (meetings.length === 0) return null

  const hasMore = meetings.length > DEFAULT_VISIBLE
  const visible = expanded ? meetings : meetings.slice(0, DEFAULT_VISIBLE)
  const hiddenCount = meetings.length - DEFAULT_VISIBLE

  return (
    <section>
      <div className="sticky top-0 z-10 bg-neutral-bg/95 py-2 backdrop-blur-sm">
        <SectionHeader title={`${label} — ${formatDisplayDate(date)}`} badge={meetings.length} />
      </div>

      {view === 'list' ? (
        <Card variant="container" className="overflow-hidden p-0">
          {visible.map((m) => (
            <MeetingListRow
              key={m.id}
              meeting={m}
              onAutoJoinChange={onAutoJoinChange}
            />
          ))}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onAutoJoinChange={onAutoJoinChange}
            />
          ))}
        </div>
      )}

      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="focus-ring mt-3 rounded-md text-body font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
        >
          Show {hiddenCount} more
        </button>
      )}
      {hasMore && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="focus-ring mt-3 rounded-md text-body font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
        >
          Show less
        </button>
      )}
    </section>
  )
}
