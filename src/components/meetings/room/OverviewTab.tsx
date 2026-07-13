import { ChevronRight, Download, Sparkles } from 'lucide-react'
import type { MeetingContext, WorkspaceBrief } from '../../../types/meetingContext'
import { recommendationLabel } from '../../../types/decisionIntelligence'
import { formatDisplayDate } from '../../../utils/helpers'
import { PrepChecklist } from './PrepChecklist'

interface OverviewTabProps {
  context: MeetingContext
  onSelectMeeting: (meetingId: string) => void
}

const confidenceLabel: Record<WorkspaceBrief['aiConfidence'], string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
}

const briefBlocks: { key: keyof Pick<WorkspaceBrief, 'outcome' | 'impact' | 'keyRisk' | 'nextStep'>; label: string }[] = [
  { key: 'outcome', label: 'Outcome' },
  { key: 'impact', label: 'Impact' },
  { key: 'keyRisk', label: 'Key risk' },
  { key: 'nextStep', label: 'Recommended next step' },
]

export function OverviewTab({ context, onSelectMeeting }: OverviewTabProps) {
  if (context.status === 'upcoming' || context.status === 'scheduled') {
    return <PrepChecklist context={context} />
  }

  const topRecommendations = context.intelligence.recommendations.slice(0, 2)

  return (
    <div className="space-y-8">
      <section className="card-surface reveal p-[22px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-surface-accent px-[11px] py-1 text-micro font-bold text-brand-teal">
            <Sparkles className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            AI brief
          </span>
          <p className="font-mono text-caption text-neutral-muted tabular-nums">{formatDisplayDate(context.date)} · {context.duration}</p>
          <button
            type="button"
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-md border border-neutral-border bg-surface px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-neutral-muted hover:border-brand-teal hover:text-brand-teal transition-colors"
            title="Download as PDF"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            PDF
          </button>
        </div>
        <p className="mt-5 max-w-[78ch] text-body-lg leading-relaxed text-neutral-text">{context.summary}</p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {briefBlocks.map((block, index) => (
            <article key={block.key} className={`card-surface-interactive reveal reveal-${index + 1} p-[22px]`}>
              <p className="kicker text-neutral-muted">{block.label}</p>
              <p className="mt-2 text-body leading-relaxed text-neutral-text">{context.brief[block.key]}</p>
            </article>
          ))}
        </div>
        {context.brief.confidenceBecause && context.brief.confidenceBecause.length > 0 ? (
          <details className="mt-5 rounded-lg border border-neutral-border/60 bg-surface-accent p-4 text-body text-neutral-text">
            <summary className="cursor-pointer font-semibold marker:text-brand-teal">
              {confidenceLabel[context.brief.aiConfidence]} — why ▸
            </summary>
            <ul className="mt-3 space-y-2 text-caption text-neutral-muted">
              {context.brief.confidenceBecause.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          </details>
        ) : (
          <p className="mt-5 text-caption text-neutral-muted">{confidenceLabel[context.brief.aiConfidence]}.</p>
        )}
      </section>

      {context.linkedMeetings.length > 0 ? (
        <section className="reveal reveal-1">
          <p className="kicker">References</p>
          <h2 className="mt-2 text-card-title font-extrabold tracking-[-0.01em] text-neutral-text">Related meetings</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {context.linkedMeetings.map((meeting) => (
              <button
                key={meeting.id}
                type="button"
                onClick={() => onSelectMeeting(meeting.id)}
                className="card-surface-interactive focus-ring group flex min-h-16 items-center justify-between gap-4 p-4 text-left hover:bg-surface-accent/20"
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-lg font-bold text-neutral-text">{meeting.title}</span>
                  <span className="mt-1 block font-mono text-caption text-neutral-muted tabular-nums">{formatDisplayDate(meeting.date)} · {meeting.time}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-neutral-muted transition-transform duration-fast ease-out group-hover:translate-x-0.5 group-hover:text-brand-teal" strokeWidth={1.8} aria-hidden />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {topRecommendations.length > 0 ? (
        <section className="card-surface reveal reveal-2 border-[#CBD8CB] bg-surface-accent p-[22px]">
          <p className="kicker">Top AI recommendations</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {topRecommendations.map((rec) => (
              <article key={rec.id} className="card-surface p-[22px]">
                <span className="inline-flex rounded-full bg-status-warningMuted px-[11px] py-1 text-micro font-bold text-status-warning">
                  {recommendationLabel[rec.type]}
                </span>
                <h3 className="mt-3 text-body-lg font-bold text-neutral-text">{rec.title}</h3>
                <p className="mt-2 text-caption leading-relaxed text-neutral-muted">{rec.rationale}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
