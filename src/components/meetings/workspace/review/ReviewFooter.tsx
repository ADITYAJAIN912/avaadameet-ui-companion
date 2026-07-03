import type { Recommendation } from '../../../../types/decisionIntelligence'
import { recommendationLabel } from '../../../../types/decisionIntelligence'
import { Check, Download, Mail, Share2 } from 'lucide-react'
import { Button } from '../../../ui/Button'
import { ws, wsBadge } from '../workspaceUi'

interface ReviewFooterProps {
  recommendations?: Recommendation[]
}

const urgencyTone = {
  high: wsBadge.danger,
  medium: wsBadge.warning,
  low: wsBadge.neutral,
} as const

export function ReviewFooter({ recommendations = [] }: ReviewFooterProps) {
  const top = recommendations.slice(0, 2)

  return (
    <div className="workspace-sticky-footer">
      {top.length > 0 && (
        <div className={ws.footerRecs}>
          {top.map((rec) => (
            <div key={rec.id} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={urgencyTone[rec.urgency]}>{recommendationLabel[rec.type]}</span>
                <span className={ws.cardPrimary}>{rec.title}</span>
              </div>
              <p className={ws.meta}>
                {rec.rationale}
                {rec.businessImpact && <span> · {rec.businessImpact}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className={ws.footerBar}>
        {top.length === 0 ? <p className={ws.eyebrow}>What happens next?</p> : null}
        <div className={ws.footerActions}>
          <Button variant="primary" className={ws.footerPrimary}>
            <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
            Approve summary
          </Button>
          <Button variant="ghost" className={ws.footerSecondary}>
            <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
            Generate email
          </Button>
          <Button variant="ghost" className={ws.footerSecondary}>
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share notes
          </Button>
          <Button variant="ghost" className={ws.footerSecondary}>
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export brief
          </Button>
        </div>
      </div>
    </div>
  )
}
