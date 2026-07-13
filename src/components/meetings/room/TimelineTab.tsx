import { ArrowDown, GitBranch } from 'lucide-react'
import type { MeetingContext } from '../../../types/meetingContext'
import { narrativeStepLabel } from '../../../types/decisionIntelligence'
import { EmptyState } from '../../ui/EmptyState'

interface TimelineTabProps {
  context: MeetingContext
}

export function TimelineTab({ context }: TimelineTabProps) {
  const chain = context.intelligence.crossMeeting.chain
  const steps = context.intelligence.narrativeTimeline

  if (chain.length === 0 && steps.length === 0) {
    return <EmptyState icon={GitBranch} title="Available after the meeting" description="Cross-meeting narrative and escalation paths will appear here after review." />
  }

  return (
    <div className="space-y-8">
      {chain.length > 0 ? (
        <section className="card-surface reveal p-[22px]">
          <p className="kicker">Cross-meeting decision chain</p>
          <ol className="mt-5 space-y-0">
            {chain.map((node, index) => (
              <li key={node.id} className={`grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4 reveal reveal-${Math.min(index + 1, 6)}`}>
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 rounded-full bg-brand-teal" />
                  {index < chain.length - 1 ? <span className="h-full min-h-10 w-px bg-neutral-border" aria-hidden /> : null}
                </div>
                <div className="pb-5">
                  <p className="kicker text-neutral-muted">{node.relation}</p>
                  <h2 className="mt-1 text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">{node.title}</h2>
                </div>
              </li>
            ))}
          </ol>
          {context.intelligence.crossMeeting.escalationChain.length > 0 ? (
            <div className="mt-2 rounded-lg border border-status-warningMuted bg-status-warningMuted p-4 text-body text-neutral-text">
              <span className="font-semibold text-status-warning">Escalation line — </span>
              {context.intelligence.crossMeeting.escalationChain.join(' → ')}
            </div>
          ) : null}
        </section>
      ) : null}

      {steps.length > 0 ? (
        <section className="card-surface reveal reveal-1 p-[22px]">
          <p className="kicker text-neutral-muted">Narrative timeline</p>
          <ol className="mt-5 space-y-0">
            {steps.map((step, index) => (
              <li key={step.id} className={`reveal reveal-${Math.min(index + 1, 6)}`}>
                <div className="flex gap-4 py-2">
                  <span className="w-28 shrink-0 font-mono text-micro font-semibold uppercase tracking-[0.14em] text-brand-teal">{narrativeStepLabel[step.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-lg font-bold text-neutral-text">{step.label}</p>
                    {step.detail ? <p className="mt-1 max-w-[72ch] text-caption leading-relaxed text-neutral-muted">{step.detail}</p> : null}
                  </div>
                </div>
                {index < steps.length - 1 ? <ArrowDown className="ml-32 h-4 w-4 text-neutral-border" strokeWidth={1.8} aria-hidden /> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
