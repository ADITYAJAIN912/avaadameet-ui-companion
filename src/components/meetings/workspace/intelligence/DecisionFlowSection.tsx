import { ArrowDown } from 'lucide-react'
import type {
  CrossMeetingIntelligence,
  NarrativeTimelineStep,
} from '../../../../types/decisionIntelligence'
import { narrativeStepLabel } from '../../../../types/decisionIntelligence'
import { ws } from '../workspaceUi'

interface DecisionFlowSectionProps {
  steps: NarrativeTimelineStep[]
  crossMeeting: CrossMeetingIntelligence
}

export function DecisionFlowSection({ steps, crossMeeting }: DecisionFlowSectionProps) {
  const hasChain = crossMeeting.chain.length > 0
  const escalation = crossMeeting.escalationChain[0]

  if (steps.length === 0 && !hasChain) {
    return <p className={`${ws.meta} px-1`}>Decision flow will appear after review completes.</p>
  }

  return (
    <div>
      {hasChain && (
        <div className="mb-5">
          <p className={ws.fieldLabel}>Decision chain</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {crossMeeting.chain.map((node, index) => (
              <span key={node.id} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <span className={ws.meta} aria-hidden>
                    →
                  </span>
                )}
                <span className={ws.cardPrimary}>{node.title}</span>
              </span>
            ))}
          </div>
          {escalation && (
            <p className={`mt-2 ${ws.meta}`}>
              Escalation: <span className={ws.metaStrong}>{escalation}</span>
            </p>
          )}
        </div>
      )}

      <ol className="space-y-0">
        {steps.map((step, index) => (
          <li key={step.id}>
            <div className="flex gap-3 py-1.5">
              <span className={`w-14 shrink-0 pt-px ${ws.metaStrong}`}>
                {narrativeStepLabel[step.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className={ws.cardPrimary}>{step.label}</p>
                {step.detail && (
                  <p className={`mt-1 ${ws.meta}`}>{step.detail}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex gap-3 py-0.5" aria-hidden>
                <span className="w-14" />
                <ArrowDown className="h-3 w-3 text-neutral-border" strokeWidth={1.75} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
