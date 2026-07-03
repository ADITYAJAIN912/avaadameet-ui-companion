import type { MeetingContextDecision } from '../../../../types/meetingContext'
import type {
  DecisionIntelligence,
  MeetingConflict,
  RiskIntelligence,
} from '../../../../types/decisionIntelligence'
import { intelligenceByDecisionId } from '../../../../types/decisionIntelligence'
import { priorityBadgeTone, ws, wsBadge } from '../workspaceUi'
import { ConflictAlerts } from './ConflictAlerts'
import { InlineRisk } from './InlineRisk'
import { synthesizeImpact, risksByDecisionId } from './intelligenceUtils'

interface DecisionIntelligenceSectionProps {
  decisions: MeetingContextDecision[]
  intelligence: DecisionIntelligence[]
  risks: RiskIntelligence[]
  conflicts: MeetingConflict[]
}

const approvalLabel = {
  approved: 'Approved',
  pending: 'Pending',
  draft: 'Draft',
} as const

const approvalTone = {
  approved: wsBadge.accent,
  pending: wsBadge.warning,
  draft: wsBadge.neutral,
} as const

export function DecisionIntelligenceSection({
  decisions,
  intelligence,
  risks,
  conflicts,
}: DecisionIntelligenceSectionProps) {
  const byId = intelligenceByDecisionId(intelligence)
  const risksForDecision = risksByDecisionId(risks)

  if (decisions.length === 0) {
    return (
      <div className={ws.empty}>
        <p className={ws.cardTitle}>No decisions recorded</p>
        <p className={`mt-1 ${ws.meta}`}>
          Decisions will appear here once the AI review completes.
        </p>
      </div>
    )
  }

  return (
    <div>
      <ConflictAlerts conflicts={conflicts} />

      <div className={ws.cardStack}>
        {decisions.map((decision) => {
          const intel = byId.get(decision.id)
          if (!intel) return null

          const linkedRisks = risksForDecision.get(decision.id) ?? []
          const impactLine = synthesizeImpact(intel.businessImpact)

          return (
            <article key={decision.id} className={ws.cardLift}>
              <div className={ws.cardHd}>
                <h4 className={ws.cardTitle}>{decision.title}</h4>
                <span className={priorityBadgeTone(decision.priority)}>{decision.priority}</span>
              </div>

              <p className={ws.cardPrimary}>{intel.whyItMatters}</p>

              <div className={ws.cardSupport}>
                {impactLine && (
                  <div className={ws.cardSupportRow}>
                    <p className={ws.fieldLabel}>Impact</p>
                    <p className={ws.fieldValue}>{impactLine}</p>
                  </div>
                )}

                {linkedRisks.map((risk) => (
                  <InlineRisk key={risk.id} risk={risk} />
                ))}

                {linkedRisks.length === 0 && intel.potentialRisks[0] && (
                  <div className={ws.cardSupportRow}>
                    <p className={ws.fieldLabel}>Risk</p>
                    <p className={ws.contextItem}>{intel.potentialRisks[0]}</p>
                  </div>
                )}

                <div className={ws.cardSupportRow}>
                  <p className={ws.fieldLabel}>Recommend</p>
                  <p className={ws.fieldValue}>{intel.aiRecommendation}</p>
                </div>
              </div>

              <div className={ws.cardFt}>
                <span className={ws.metaStrong}>{decision.owner}</span>
                <span className={ws.meta}>{decision.relatedProject}</span>
                <span className={approvalTone[decision.approvalStatus]}>
                  {approvalLabel[decision.approvalStatus]}
                </span>
                {intel.dependencies[0] && (
                  <span className={ws.meta}>Depends on {intel.dependencies[0]}</span>
                )}
                {decision.timestamp !== '—' && (
                  <span className={`tabular-nums ${ws.meta}`}>{decision.timestamp}</span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
