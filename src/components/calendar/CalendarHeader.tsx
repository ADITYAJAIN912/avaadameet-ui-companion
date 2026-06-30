import { Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { ViewToggle } from '../ui/ViewToggle'
import type { CalendarViewMode } from '../../types/calendar'

interface CalendarHeaderProps {
  monthLabel: string
  eventCount: number
  view: CalendarViewMode
  onViewChange: (view: CalendarViewMode) => void
  onToday: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export function CalendarHeader({
  monthLabel,
  eventCount,
  view,
  onViewChange,
  onToday,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-section-title">Calendar</h2>
        <span className="hidden items-center gap-1.5 rounded-lg border border-neutral-border/70 bg-neutral-bg/60 px-2.5 py-1 text-caption text-neutral-muted sm:inline-flex">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-brand-teal" aria-hidden strokeWidth={1.75} />
          Avaada Workspace
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" className="h-9 px-3 text-caption" onClick={onToday}>
          Today
        </Button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-border/70 bg-white text-neutral-muted shadow-elevation-1 ease-premium hover:bg-neutral-bg/80 hover:text-neutral-text"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-border/70 bg-white text-neutral-muted shadow-elevation-1 ease-premium hover:bg-neutral-bg/80 hover:text-neutral-text"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        <span className="min-w-[7rem] text-body font-semibold text-neutral-text">{monthLabel}</span>
        <span className="badge-pill bg-neutral-bg text-neutral-muted ring-1 ring-neutral-border/50">
          {eventCount} events
        </span>
        <ViewToggle
          ariaLabel="Calendar view"
          options={[
            { value: 'month', label: 'Month' },
            { value: 'week', label: 'Week' },
            { value: 'day', label: 'Day' },
          ]}
          value={view}
          onChange={onViewChange}
        />
      </div>
    </div>
  )
}
