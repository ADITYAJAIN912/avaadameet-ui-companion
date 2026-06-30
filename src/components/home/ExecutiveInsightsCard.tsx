import { Sparkles } from 'lucide-react'
import { mockDashboardInsights } from '../../data/mockDashboardInsights'

const toneClass = {
  neutral: 'text-neutral-text',
  warning: 'text-amber-800/90',
  positive: 'text-brand-teal',
} as const

export function ExecutiveInsightsCard() {
  return (
    <section className="card-surface p-3 shadow-sm ease-premium hover:shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-tealLight/60">
          <Sparkles className="h-3.5 w-3.5 text-brand-teal" strokeWidth={1.75} />
        </span>
        <h2 className="text-card-heading">Executive Insights</h2>
      </div>

      <ul className="mt-2.5 space-y-2">
        {mockDashboardInsights.map((insight) => (
          <li
            key={insight.id}
            className="rounded-lg border border-neutral-border/40 bg-neutral-bg/30 px-2.5 py-2 ease-premium hover:border-neutral-border/60 hover:bg-neutral-bg/50"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
              {insight.label}
            </p>
            <p
              className={`mt-0.5 text-caption leading-snug ${
                toneClass[insight.tone ?? 'neutral']
              }`}
            >
              {insight.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
