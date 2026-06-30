import type { CalendarDayCell } from '../../utils/calendar'
import type { CalendarEvent } from '../../types/calendar'
import { getWeekdayLabels, getEventsForDate, isWeekend } from '../../utils/calendar'
import { Card } from '../ui/Card'
import { CalendarEventPill } from './CalendarEventPill'

const MAX_VISIBLE = 2

interface MonthGridProps {
  cells: CalendarDayCell[]
  events: CalendarEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function MonthGrid({ cells, events, selectedDate, onSelectDate }: MonthGridProps) {
  const weekdays = getWeekdayLabels()
  const rowCount = cells.length / 7

  return (
    <Card variant="container" className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-0 shadow-elevation-1">
      <div className="grid shrink-0 grid-cols-7 border-b border-neutral-border/50 bg-neutral-bg/30">
        {weekdays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-medium text-neutral-muted"
          >
            {d}
          </div>
        ))}
      </div>
      <div
        className="grid min-h-0 flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const dayEvents = getEventsForDate(events, cell.date)
          const visible = dayEvents.slice(0, MAX_VISIBLE)
          const overflow = dayEvents.length - MAX_VISIBLE
          const isSelected = cell.date === selectedDate
          const weekend = isWeekend(cell.date)
          const isMuted = !cell.isCurrentMonth

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date)}
              className={`focus-ring flex min-h-0 flex-col overflow-hidden border-b border-r border-neutral-border/40 p-1 text-left ease-premium last:border-r-0 hover:bg-neutral-bg/50 ${
                cell.isToday ? 'bg-brand-tealLight/40' : weekend ? 'bg-neutral-bg/45' : 'bg-white'
              } ${isSelected ? 'ring-1 ring-inset ring-brand-teal/30' : ''}`}
            >
              <div className="flex shrink-0 items-center justify-between gap-0.5">
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-0.5 text-[11px] font-medium tabular-nums ${
                    cell.isToday
                      ? 'bg-brand-teal font-semibold text-white shadow-elevation-1'
                      : isMuted
                        ? 'text-neutral-muted/45'
                        : 'text-neutral-text'
                  }`}
                >
                  {cell.day}
                </span>
              </div>
              {!isMuted && (
                <div className="mt-0.5 min-h-0 flex-1 space-y-0.5 overflow-hidden">
                  {visible.map((ev) => (
                    <CalendarEventPill key={ev.id} event={ev} compact />
                  ))}
                  {overflow > 0 && (
                    <p className="truncate px-0.5 text-[10px] font-medium text-neutral-muted">
                      +{overflow} more
                    </p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
