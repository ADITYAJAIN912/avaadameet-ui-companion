import type { RiskIntelligence } from '../../../../types/decisionIntelligence'
import { ws, wsBadge } from '../workspaceUi'

interface InlineRiskProps {
  risk: RiskIntelligence
}

const severityTone = {
  high: wsBadge.danger,
  medium: wsBadge.warning,
  low: wsBadge.neutral,
} as const

export function InlineRisk({ risk }: InlineRiskProps) {
  return (
    <div className={ws.riskInset}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={ws.cardTitle}>{risk.title}</p>
        <span className={severityTone[risk.severity]}>{risk.severity} risk</span>
      </div>
      <p className={ws.contextItem}>{risk.businessImpact}</p>
      <p className={ws.meta}>
        <span className={ws.metaStrong}>{risk.owner}</span>
        {' · '}
        Mitigate: {risk.mitigation}
        {risk.deadline !== '—' && (
          <>
            {' · '}
            <span className="tabular-nums">by {risk.deadline}</span>
          </>
        )}
      </p>
    </div>
  )
}
