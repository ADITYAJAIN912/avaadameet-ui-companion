import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarFilterCategory, CalendarViewMode } from '../../types/calendar'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

const filters: { value: CalendarFilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'standups', label: 'Standups' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'personal', label: 'Personal' },
]

interface CalendarToolbarProps {
  monthLabel: string
  eventCount: number
  view: CalendarViewMode
  categoryFilter: CalendarFilterCategory
  onViewChange: (view: CalendarViewMode) => void
  onCategoryChange: (filter: CalendarFilterCategory) => void
  onToday: () => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

function CalendarViewToggle({
  view,
  onViewChange,
}: {
  view: CalendarViewMode
  onViewChange: (view: CalendarViewMode) => void
}) {
  const options: { value: CalendarViewMode; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ]

  return (
    <div
      role="group"
      aria-label="Calendar view"
      className="inline-flex h-7 shrink-0 items-center rounded-lg border border-neutral-border/70 bg-white p-px shadow-elevation-1"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onViewChange(opt.value)}
          aria-pressed={view === opt.value}
          className={`focus-ring inline-flex h-[26px] min-w-[2.75rem] items-center justify-center rounded-md px-2 text-[11px] font-medium ease-premium ${
            view === opt.value
              ? 'bg-brand-tealLight text-brand-teal shadow-elevation-1'
              : 'text-neutral-muted hover:bg-neutral-bg/80 hover:text-neutral-text'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function CalendarToolbar({
  monthLabel,
  eventCount,
  view,
  categoryFilter,
  onViewChange,
  onCategoryChange,
  onToday,
  onPrevMonth,
  onNextMonth,
}: CalendarToolbarProps) {
  return (
    <Card variant="default" className="shrink-0 rounded-xl px-2 py-1.5 shadow-elevation-1">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {/* Navigation cluster */}
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="secondary" className="h-7 px-2.5 text-[11px]" onClick={onToday}>
            Today
          </Button>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onPrevMonth}
              className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-md border border-neutral-border/60 bg-white text-neutral-muted ease-premium hover:bg-neutral-bg hover:text-neutral-text"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-md border border-neutral-border/60 bg-white text-neutral-muted ease-premium hover:bg-neutral-bg hover:text-neutral-text"
              aria-label="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="flex items-baseline gap-1.5 pl-0.5">
            <h2 className="text-caption font-semibold text-neutral-text">{monthLabel}</h2>
            <span
              className="rounded px-1 py-px text-[10px] font-medium tabular-nums text-neutral-muted/90"
              aria-label={`${eventCount} events this month`}
            >
              {eventCount}
            </span>
          </div>
        </div>

        {/* Filters — inline on wide screens */}
        <div
          role="group"
          aria-label="Filter events"
          className="flex min-w-0 flex-1 basis-full items-center sm:basis-auto"
        >
          <div className="inline-flex h-7 max-w-full flex-wrap items-center rounded-lg border border-neutral-border/70 bg-neutral-bg/40 p-px">
            {filters.map((f, i) => (
              <span key={f.value} className="flex items-center">
                {i > 0 && (
                  <span className="mx-px text-[10px] text-neutral-border/80" aria-hidden>
                    |
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onCategoryChange(f.value)}
                  aria-pressed={categoryFilter === f.value}
                  className={`focus-ring rounded-md px-2 py-0.5 text-[11px] font-medium ease-premium ${
                    categoryFilter === f.value
                      ? 'bg-white text-neutral-text shadow-elevation-1'
                      : 'text-neutral-muted hover:text-neutral-text'
                  }`}
                >
                  {f.label}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* View switcher */}
        <div className="ml-auto shrink-0">
          <CalendarViewToggle view={view} onViewChange={onViewChange} />
        </div>
      </div>
    </Card>
  )
}
