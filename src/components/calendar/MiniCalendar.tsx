import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildMonthGrid, formatMonthYear } from '../../utils/calendar'

interface MiniCalendarProps {
  year: number
  month: number
  selectedDate: string
  onSelectDate: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  compact?: boolean
}

export function MiniCalendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  compact = false,
}: MiniCalendarProps) {
  const cells = buildMonthGrid(year, month)
  const weekdays = compact ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="focus-ring rounded-md p-0.5 text-neutral-muted ease-premium hover:bg-neutral-bg hover:text-neutral-text"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
        <span className={`font-semibold text-neutral-text ${compact ? 'text-caption' : 'text-body'}`}>
          {formatMonthYear(year, month)}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="focus-ring rounded-md p-0.5 text-neutral-muted ease-premium hover:bg-neutral-bg hover:text-neutral-text"
          aria-label="Next month"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {weekdays.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-0.5 text-center text-[10px] font-medium text-neutral-muted"
          >
            {d}
          </div>
        ))}
        {cells.map((cell) => {
          const isSelected = cell.date === selectedDate
          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date)}
              className={`focus-ring flex h-6 w-full items-center justify-center rounded-md text-[10px] tabular-nums ease-premium ${
                isSelected
                  ? 'bg-brand-teal font-medium text-white'
                  : cell.isToday
                    ? 'font-medium text-brand-teal ring-1 ring-brand-teal/25'
                    : cell.isCurrentMonth
                      ? 'text-neutral-text hover:bg-neutral-bg'
                      : 'text-neutral-muted/40 hover:bg-neutral-bg/60'
              }`}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
