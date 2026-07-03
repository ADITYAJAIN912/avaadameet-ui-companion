import type { AiConfidence } from '../../types/meetingContext'
import type { WorkspaceBrief } from '../../types/workspace'
import { ws, wsBadge } from '../meetings/workspace/workspaceUi'

interface ActionSummarySectionProps {
  brief: WorkspaceBrief
}

const confidenceLabel: Record<AiConfidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
}

const confidenceTone: Record<AiConfidence, string> = {
  high: wsBadge.accent,
  medium: wsBadge.warning,
  low: wsBadge.neutral,
}

const infoCards = [
  { key: 'impact' as const, label: 'Impact' },
  { key: 'keyRisk' as const, label: 'Key risk' },
  { key: 'nextStep' as const, label: 'Next step' },
]

export function ActionSummarySection({ brief }: ActionSummarySectionProps) {
  return (
    <div className="workspace-hero-surface">
      <div className={ws.heroBodyWithBadge}>
        <p className="workspace-hero-outcome max-w-3xl flex-1">{brief.outcome}</p>
        <span className={`shrink-0 ${confidenceTone[brief.aiConfidence]}`}>
          {confidenceLabel[brief.aiConfidence]}
        </span>
      </div>

      <dl className={ws.summaryInfoGrid}>
        {infoCards.map(({ key, label }) => (
          <div key={label} className={ws.infoCard}>
            <dt className={ws.fieldLabel}>{label}</dt>
            <dd className={ws.infoCardValue}>{brief[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
