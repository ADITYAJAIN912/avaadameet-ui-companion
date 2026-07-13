import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { MeetingContextDecision } from '../../../types/meetingContext'
import type { BusinessImpactDimensions, RiskIntelligence } from '../../../types/decisionIntelligence'
import { conflictLabel, intelligenceByDecisionId } from '../../../types/decisionIntelligence'
import type { MeetingContext } from '../../../types/meetingContext'
import { EmptyState } from '../../ui/EmptyState'
import { FileText } from 'lucide-react'

interface DecisionsTabProps {
  context: MeetingContext
}

const statusLabel: Record<MeetingContextDecision['status'], string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  open: 'Open',
}

const approvalLabel: Record<MeetingContextDecision['approvalStatus'], string> = {
  approved: 'Approved',
  pending: 'Pending approval',
  draft: 'Draft',
}

function synthesizeImpact(impact: BusinessImpactDimensions): string | null {
  return impact.delivery ?? impact.operational ?? impact.financial ?? impact.compliance ?? impact.customer ?? null
}

function risksByDecisionId(risks: RiskIntelligence[]): Map<string, RiskIntelligence[]> {
  const map = new Map<string, RiskIntelligence[]>()
  for (const risk of risks) {
    if (!risk.relatedDecisionId) continue
    const list = map.get(risk.relatedDecisionId) ?? []
    list.push(risk)
    map.set(risk.relatedDecisionId, list)
  }
  return map
}

export function DecisionsTab({ context }: DecisionsTabProps) {
  const [openId, setOpenId] = useState<string | null>(context.decisions[0]?.id ?? null)
  const intelligence = intelligenceByDecisionId(context.intelligence.decisionIntelligence)
  const linkedRisks = risksByDecisionId(context.intelligence.riskIntelligence)

  if (context.decisions.length === 0) {
    return <EmptyState icon={FileText} title="Available after the meeting" description="Decision intelligence appears once the AI review completes." />
  }

  return (
    <div className="space-y-5">
      {context.intelligence.conflicts.map((conflict) => (
        <article key={conflict.id} className="card-surface reveal border-status-warningMuted bg-status-warningMuted p-[22px]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-surface px-[11px] py-1 text-micro font-bold text-status-warning">{conflictLabel[conflict.type]}</span>
            <h2 className="text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">{conflict.title}</h2>
          </div>
          <p className="mt-3 text-body leading-relaxed text-neutral-text">{conflict.whyItMatters}</p>
          <p className="mt-2 text-caption leading-relaxed text-neutral-muted"><span className="font-semibold text-neutral-text">Resolution —</span> {conflict.resolution}</p>
        </article>
      ))}

      <div className="space-y-3">
        {context.decisions.map((decision, index) => {
          const intel = intelligence.get(decision.id)
          const risks = linkedRisks.get(decision.id) ?? []
          const isOpen = openId === decision.id
          return (
            <article key={decision.id} className={`card-surface reveal reveal-${Math.min(index + 1, 6)} overflow-hidden`}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : decision.id)}
                className="focus-ring group flex min-h-14 w-full items-center gap-4 px-[22px] py-[13px] text-left transition-colors duration-150 hover:bg-[#F3F3EA]"
              >
                <span className="rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal">{decision.priority} priority</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">{decision.title}</span>
                  <span className="mt-1 block text-caption text-neutral-muted">{decision.owner} · {statusLabel[decision.status]}</span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-neutral-muted transition-transform duration-fast ease-out group-hover:text-brand-teal ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} aria-hidden />
              </button>
              {isOpen ? (
                <div className="border-t border-[var(--border-subtle)] px-[22px] py-[22px]">
                  <dl className="grid gap-4 md:grid-cols-2">
                    <div><dt className="kicker text-neutral-muted">Owner</dt><dd className="mt-1 text-body text-neutral-text">{decision.owner}</dd></div>
                    <div><dt className="kicker text-neutral-muted">Approval status</dt><dd className="mt-1 text-body text-neutral-text">{approvalLabel[decision.approvalStatus]}</dd></div>
                    <div><dt className="kicker text-neutral-muted">Business impact</dt><dd className="mt-1 text-body text-neutral-text">{decision.businessImpact}</dd></div>
                    <div><dt className="kicker text-neutral-muted">Priority word</dt><dd className="mt-1 text-body capitalize text-neutral-text">{decision.priority}</dd></div>
                  </dl>
                  {intel ? (
                    <div className="mt-5 space-y-4">
                      <p className="text-body leading-relaxed text-neutral-text"><span className="font-semibold">Why it matters —</span> {intel.whyItMatters}</p>
                      {synthesizeImpact(intel.businessImpact) ? <p className="text-body leading-relaxed text-neutral-text"><span className="font-semibold">Impact —</span> {synthesizeImpact(intel.businessImpact)}</p> : null}
                      <p className="text-body leading-relaxed text-neutral-text"><span className="font-semibold">AI recommendation —</span> {intel.aiRecommendation}</p>
                    </div>
                  ) : null}
                  <div className="mt-5 space-y-2">
                    {risks.length > 0 ? risks.map((risk) => (
                      <p key={risk.id} className="rounded-lg border border-status-warningMuted bg-status-warningMuted p-3 text-caption leading-relaxed text-neutral-text">
                        <span className="font-semibold text-status-warning">Risk — {risk.title}:</span> {risk.mitigation}
                      </p>
                    )) : intel?.potentialRisks.map((risk) => (
                      <p key={risk} className="rounded-lg border border-status-warningMuted bg-status-warningMuted p-3 text-caption leading-relaxed text-neutral-text"><span className="font-semibold text-status-warning">Risk —</span> {risk}</p>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}
