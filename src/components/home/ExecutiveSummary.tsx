import { Link } from 'react-router-dom'
import { Calendar, Clock, CheckSquare } from 'lucide-react'

interface ExecutiveSummaryProps {
  userName: string
  dateLabel: string
  meetingsToday: number
  upcomingCount: number
  openActions: number
}

export function ExecutiveSummary({
  userName,
  dateLabel,
  meetingsToday,
  upcomingCount,
  openActions,
}: ExecutiveSummaryProps) {
  const firstName = userName.split(' ')[0]

  return (
    <header className="card-surface flex flex-col gap-2.5 px-3.5 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-muted">Good morning,</p>
        <h1 className="text-page-title font-semibold tracking-tight text-neutral-text">
          {firstName}
        </h1>
        <p className="mt-0.5 text-caption text-neutral-muted">{dateLabel}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:justify-end">
        <SummaryChip
          icon={Calendar}
          label="Today"
          value={meetingsToday}
          to="/meetings?filter=today"
        />
        <SummaryChip
          icon={Clock}
          label="Upcoming"
          value={upcomingCount}
          to="/meetings?filter=today"
        />
        <SummaryChip
          icon={CheckSquare}
          label="Open actions"
          value={openActions}
          to="/action-items?filter=open"
        />
      </div>
    </header>
  )
}

function SummaryChip({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: typeof Calendar
  label: string
  value: number
  to: string
}) {
  return (
    <Link
      to={to}
      className="focus-ring group inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 ease-premium hover:bg-neutral-bg/80"
    >
      <Icon
        className="h-3.5 w-3.5 text-neutral-muted/70 ease-premium group-hover:text-brand-teal"
        strokeWidth={1.75}
      />
      <span className="text-[11px] text-neutral-muted">{label}</span>
      <span className="text-caption font-semibold tabular-nums text-neutral-text">{value}</span>
    </Link>
  )
}
