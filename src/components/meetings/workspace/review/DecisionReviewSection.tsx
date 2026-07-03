import type {
  AiConfidence,
  ApprovalStatus,
  MeetingContextDecision,
} from '../../../../types/meetingContext'
import { priorityBadgeTone, ws, wsBadge } from '../workspaceUi'

interface DecisionReviewSectionProps {
  decisions: MeetingContextDecision[]
}

const approvalLabel: Record<ApprovalStatus, string> = {
  approved: 'Approved',
  pending: 'Pending approval',
  draft: 'Draft',
}

const approvalTone: Record<ApprovalStatus, string> = {
  approved: wsBadge.accent,
  pending: wsBadge.warning,
  draft: wsBadge.neutral,
}

const confidenceLabel: Record<AiConfidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function DecisionReviewSection({ decisions }: DecisionReviewSectionProps) {
  if (decisions.length === 0) {
    return (
      <div className={ws.empty}>
        <p className={ws.sectionTitle}>No decisions recorded</p>
        <p className={`mt-1 ${ws.meta}`}>Decisions will appear here after the meeting is reviewed.</p>
      </div>
    )
  }

  return (
    <div className={ws.cardStack}>
      {decisions.map((decision) => (
        <article key={decision.id} className={ws.cardLift}>
          <div className={ws.cardHd}>
            <p className={ws.cardTitle}>{decision.title}</p>
            <span className={priorityBadgeTone(decision.priority)}>{decision.priority}</span>
          </div>

          <dl className={ws.cardMetaGrid}>
            <div className={ws.fieldCell}>
              <dt className={ws.fieldLabel}>Owner</dt>
              <dd className={ws.fieldValue}>{decision.owner}</dd>
            </div>
            <div className={ws.fieldCell}>
              <dt className={ws.fieldLabel}>Related project</dt>
              <dd className={ws.fieldValue}>{decision.relatedProject}</dd>
            </div>
            <div className={`${ws.fieldCell} ${ws.cardMetaGridSpan2}`}>
              <dt className={ws.fieldLabel}>Business impact</dt>
              <dd className={ws.fieldValue}>{decision.businessImpact}</dd>
            </div>
          </dl>

          <div className={ws.cardFt}>
            <span className={approvalTone[decision.approvalStatus]}>
              {approvalLabel[decision.approvalStatus]}
            </span>
            <span className="workspace-stat">
              AI {confidenceLabel[decision.confidence]} confidence
            </span>
            {decision.timestamp !== '—' && (
              <span className={`ml-auto tabular-nums ${ws.meta}`}>{decision.timestamp}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
