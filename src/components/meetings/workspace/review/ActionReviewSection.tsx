import type {
  CommitmentStatus,
  MeetingContextCommitment,
} from '../../../../types/meetingContext'
import { priorityBadgeTone, ws, wsBadge } from '../workspaceUi'

interface ActionReviewSectionProps {
  commitments: MeetingContextCommitment[]
}

const statusLabel: Record<CommitmentStatus, string> = {
  proposed: 'Proposed',
  accepted: 'Accepted',
  overdue: 'Overdue',
  completed: 'Completed',
}

const statusTone: Record<CommitmentStatus, string> = {
  proposed: wsBadge.info,
  accepted: wsBadge.accent,
  overdue: wsBadge.danger,
  completed: wsBadge.neutral,
}

export function ActionReviewSection({ commitments }: ActionReviewSectionProps) {
  if (commitments.length === 0) {
    return (
        <div className={ws.empty}>
        <p className={ws.cardTitle}>No commitments extracted</p>
        <p className={`mt-1 ${ws.meta}`}>Action items will surface here once the AI review completes.</p>
      </div>
    )
  }

  return (
    <div className={ws.cardStack}>
      {commitments.map((action) => (
        <article key={action.id} className={ws.cardLift}>
          <div className={ws.cardHd}>
            <p className={ws.cardTitle}>{action.title}</p>
            <span className={statusTone[action.status]}>{statusLabel[action.status]}</span>
          </div>

          <dl className={ws.cardMetaGrid}>
            <div className={ws.fieldCell}>
              <dt className={ws.fieldLabel}>Owner</dt>
              <dd className={ws.fieldValue}>{action.owner}</dd>
            </div>
            <div className={ws.fieldCell}>
              <dt className={ws.fieldLabel}>Due date</dt>
              <dd className={`${ws.fieldValue} tabular-nums`}>{action.dueDate}</dd>
            </div>
            <div className={ws.fieldCell}>
              <dt className={ws.fieldLabel}>Priority</dt>
              <dd>
                <span className={`${priorityBadgeTone(action.priority)} capitalize`}>
                  {action.priority}
                </span>
              </dd>
            </div>
            {action.dependencies.length > 0 && (
              <div className={`${ws.fieldCell} ${ws.cardMetaGridSpan2}`}>
                <dt className={ws.fieldLabel}>Dependencies</dt>
                <dd className={ws.fieldChips}>
                  {action.dependencies.map((dep) => (
                    <span key={dep} className={ws.statChip}>
                      {dep}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </article>
      ))}
    </div>
  )
}
