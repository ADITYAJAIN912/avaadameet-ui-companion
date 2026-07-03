import { useMemo } from 'react'
import type { Meeting } from '../../../types/meeting'
import { isMeetingPastOrCompleted, isMeetingUpcoming } from '../../../utils/meetings'
import { TODAY } from '../../../data/constants'
import { AttentionQueueRow, type AttentionQueueSectionId } from './AttentionQueueRow'
import { WorkspaceEmptyState } from '../../workspace'
import { ws, wsCount } from './workspaceUi'

interface AttentionQueueProps {
  meetings: Meeting[]
  selectedMeetingId: string | null
  onSelectMeeting: (id: string) => void
}

interface QueueSection {
  id: AttentionQueueSectionId
  label: string
  meetings: Meeting[]
}

const sectionLabels: Record<AttentionQueueSectionId, string> = {
  now: 'Needs you now',
  review: 'Needs review',
  prep: 'Needs prep',
  later: 'Later',
}

function assignQueueSection(meeting: Meeting): AttentionQueueSectionId {
  if (meeting.status === 'Completed' || isMeetingPastOrCompleted(meeting)) {
    return 'review'
  }
  if (isMeetingUpcoming(meeting) && meeting.date === TODAY) {
    return 'prep'
  }
  if (isMeetingUpcoming(meeting)) {
    return 'prep'
  }
  return 'later'
}

export function AttentionQueue({
  meetings,
  selectedMeetingId,
  onSelectMeeting,
}: AttentionQueueProps) {
  const sections = useMemo(() => {
    const buckets: Record<AttentionQueueSectionId, Meeting[]> = {
      now: [],
      review: [],
      prep: [],
      later: [],
    }

    for (const meeting of meetings) {
      buckets[assignQueueSection(meeting)].push(meeting)
    }

    const order: AttentionQueueSectionId[] = ['now', 'review', 'prep', 'later']
    return order
      .map((id) => ({ id, label: sectionLabels[id], meetings: buckets[id] }))
      .filter((s) => s.meetings.length > 0) as QueueSection[]
  }, [meetings])

  return (
    <aside
      className="panel-surface flex h-full min-h-0 min-w-0 w-full flex-col"
      aria-label="Attention queue"
    >
      <div className={ws.panelHd}>
        <h2 className={ws.panelTitle}>Attention queue</h2>
        <p className={ws.meta}>
          <span className={`tabular-nums ${ws.metaStrong}`}>{meetings.length}</span>
          {' '}
          meeting{meetings.length !== 1 ? 's' : ''} in view
        </p>
      </div>

      <div className={ws.panelBd}>
        {sections.length === 0 ? (
          <WorkspaceEmptyState
            title="No meetings in this period"
            description="Try a different date filter or search term."
          />
        ) : (
          <div className={ws.queueSections}>
            {sections.map((section) => (
              <section key={section.id} aria-label={section.label}>
                <div className={`${ws.groupHd} ${ws.queueGroupHd}`}>
                  <h3 className={ws.queueEyebrow}>{section.label}</h3>
                  <span className={wsCount}>{section.meetings.length}</span>
                </div>

                <div className={ws.queueList}>
                  {section.meetings.map((meeting) => (
                    <AttentionQueueRow
                      key={meeting.id}
                      meeting={meeting}
                      sectionId={section.id}
                      isSelected={selectedMeetingId === meeting.id}
                      onSelect={onSelectMeeting}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
