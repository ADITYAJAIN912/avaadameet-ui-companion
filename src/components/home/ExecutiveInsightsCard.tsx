import { Sparkles } from 'lucide-react'
import { mockDashboardInsights } from '../../data/mockDashboardInsights'

const toneClass = {
  neutral: 'text-neutral-text',
  warning: 'text-amber-800/90',
  positive: 'text-brand-teal',
} as const

export function ExecutiveInsightsCard() {
  return (
    <section className="card-surface p-4 ease-premium hover:border-brand-teal/20">
      <div className="flex items-center gap-2.5">
        <span className="icon-well">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <h2 className="text-card-heading">Executive Insights</h2>
      </div>

      <ul className="mt-3 space-y-2">
        {mockDashboardInsights.map((insight) => (
          <li key={insight.id} className="insight-tile ease-premium hover:border-neutral-border/60">
            <p className="text-micro font-medium uppercase tracking-wide text-neutral-muted">
              {insight.label}
            </p>
            <p
              className={`mt-1 text-caption leading-snug ${toneClass[insight.tone ?? 'neutral']}`}
            >
              {insight.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
