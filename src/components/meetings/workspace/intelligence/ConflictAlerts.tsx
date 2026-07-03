import type { MeetingConflict } from '../../../../types/decisionIntelligence'
import { conflictLabel } from '../../../../types/decisionIntelligence'
import { ws, wsBadge } from '../workspaceUi'

interface ConflictAlertsProps {
  conflicts: MeetingConflict[]
  limit?: number
}

export function ConflictAlerts({ conflicts, limit = 2 }: ConflictAlertsProps) {
  const visible = conflicts.slice(0, limit)
  if (visible.length === 0) return null

  return (
    <div className="mb-4 space-y-3">
      {visible.map((conflict) => (
        <div
          key={conflict.id}
          className={`${ws.cardLift} ${ws.cardAlert}`}
        >
          <div className={ws.cardHd}>
            <span className={ws.cardTitle}>{conflict.title}</span>
            <span className={wsBadge.warning}>{conflictLabel[conflict.type]}</span>
          </div>
          <p className={ws.cardPrimary}>{conflict.whyItMatters}</p>
          <p className={ws.meta}>
            <span className={ws.fieldLabel}>Resolution</span>
            {' — '}
            {conflict.resolution}
          </p>
        </div>
      ))}
    </div>
  )
}
