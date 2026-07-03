import { getMeetingQueuePreview } from '../../../utils/meetingQueuePreview'
import type { Meeting } from '../../../types/meeting'
import { queueCardClass, ws, wsBadge } from './workspaceUi'

export type AttentionQueueSectionId = 'now' | 'review' | 'prep' | 'later'

interface AttentionQueueRowProps {
  meeting: Meeting
  sectionId: AttentionQueueSectionId
  isSelected: boolean
  onSelect: (id: string) => void
}

export function AttentionQueueRow({
  meeting,
  sectionId: _sectionId,
  isSelected,
  onSelect,
}: AttentionQueueRowProps) {
  const preview = getMeetingQueuePreview(meeting)
  const needsAttention = preview.priority === 'high' || preview.riskLevel === 'high'

  return (
    <button
      type="button"
      onClick={() => onSelect(meeting.id)}
      className={queueCardClass(isSelected)}
    >
      <div className={ws.queueCardBody}>
        <p className={ws.queueCardTitle}>{meeting.title}</p>

        <p className={ws.queueCardOwner}>
          <span className={ws.queueCardMetaStrong}>{meeting.host}</span>
          <span className="text-neutral-border/80"> · </span>
          <span className="tabular-nums">{meeting.time}</span>
        </p>

        {needsAttention ? (
          <div className={ws.queueCardStatus}>
            <span className={wsBadge.danger}>Needs attention</span>
          </div>
        ) : null}

        <p className={ws.queueCardFoot}>
          {preview.decisionCount} decisions · {preview.actionCount} actions
        </p>
      </div>
    </button>
  )
}
