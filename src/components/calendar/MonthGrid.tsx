import { useMemo } from 'react'
import type { CalendarDayCell } from '../../utils/calendar'
import type { CalendarEvent } from '../../types/calendar'
import { getEventsForDate, getWeekdayLabels } from '../../utils/calendar'
import { getCategoryTheme } from './categoryTheme'

interface MonthGridProps {
  cells: CalendarDayCell[]
  events: CalendarEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
  onSelectEvent: (event: CalendarEvent) => void
  onPeekDate: (date: string) => void
}

export function MonthGrid({ cells, events, selectedDate, onSelectDate, onSelectEvent }: MonthGridProps) {
  const weekdays = getWeekdayLabels()
  
  const agendaEvents = useMemo(() => {
    // Look ahead up to 14 days to provide a dense schedule list
    const upcoming = cells.filter(c => c.date >= selectedDate).slice(0, 14)
    return upcoming.map(c => ({
      date: c.date,
      isToday: c.isToday,
      dayLabel: new Date(c.date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }),
      events: getEventsForDate(events, c.date)
    })).filter(group => group.events.length > 0 || group.date === selectedDate)
  }, [cells, events, selectedDate])

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden reveal-fade">
      {/* Left Sidebar: Navigation Context */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
        <div className="card-surface p-5 border border-[var(--border-subtle)] bg-surface shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-body font-bold text-neutral-text">Select Date</h2>
          </div>
          <div className="grid grid-cols-7 gap-y-1 mb-2">
            {weekdays.map(day => (
              <div key={day} className="text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-muted">
                {day.slice(0, 1)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((cell) => {
              const dayEvents = getEventsForDate(events, cell.date)
              const isSelected = cell.date === selectedDate
              const muted = !cell.isCurrentMonth
              const hasEvents = dayEvents.length > 0
              
              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => onSelectDate(cell.date)}
                  className={`
                    focus-ring relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-small font-medium tabular-nums transition-all duration-150
                    ${isSelected ? 'bg-brand-teal text-neutral-inverse font-bold' : 'hover:bg-neutral-bg text-neutral-text'}
                    ${muted && !isSelected ? 'text-neutral-muted/50' : ''}
                    ${cell.isToday && !isSelected ? 'text-brand-teal ring-1 ring-inset ring-brand-teal/30' : ''}
                  `}
                >
                  {cell.day}
                  {hasEvents && !isSelected && (
                    <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${cell.isToday ? 'bg-brand-teal' : 'bg-[#CBD8CB]'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="card-surface p-5 border border-[var(--border-subtle)] bg-surface shadow-sm flex-1 hidden lg:flex flex-col overflow-hidden">
           <h3 className="text-caption font-bold text-neutral-text mb-3">Schedule Overview</h3>
           <p className="text-small text-neutral-muted leading-relaxed">
             Corporate agenda view dynamically pulls upcoming events into a continuous, high-density table to eliminate empty space.
           </p>
        </div>
      </div>

      {/* Right: Corporate Agenda View (High Density List) */}
      <div className="flex-1 card-surface border border-[var(--border-subtle)] bg-surface shadow-sm overflow-hidden flex flex-col p-0">
        <div className="border-b border-[var(--border-subtle)] px-6 py-4 bg-[#F3F3EA]/30">
           <h2 className="text-body font-bold text-neutral-text">Timeline</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {agendaEvents.map(group => (
            <div key={group.date} className="mt-8 first:mt-4 reveal-scale">
              <div className="sticky top-0 z-10 mb-3 bg-surface/95 backdrop-blur-md py-2 border-b border-[var(--border-subtle)]/50">
                <h3 className="flex items-baseline gap-2">
                  <span className={`text-body-lg font-bold ${group.isToday ? 'text-brand-teal' : 'text-neutral-text'}`}>
                    {group.isToday ? 'Today' : group.dayLabel.split(',')[0]}
                  </span>
                  {!group.isToday && (
                    <span className="text-small font-medium text-neutral-muted">
                      {group.dayLabel.split(',')[1]}
                    </span>
                  )}
                </h3>
              </div>
              
              {group.events.length === 0 ? (
                <div className="py-6 text-body font-medium text-neutral-muted">
                  No scheduled events for this day.
                </div>
              ) : (
                <div className="flex flex-col">
                  {group.events.map(event => {
                    const theme = getCategoryTheme(event.category)
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className="group focus-ring flex w-full items-center gap-5 rounded-lg px-2 py-3 text-left transition-colors hover:bg-[#F3F3EA]"
                      >
                        <div className="w-20 shrink-0 font-mono text-[11.5px] font-semibold tracking-wider text-neutral-muted group-hover:text-neutral-text transition-colors">
                          {event.time}
                        </div>
                        
                        <div className={`shrink-0 w-1 h-9 rounded-full ${theme.dot}`} />
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-body font-bold text-neutral-text truncate">
                            {event.title}
                          </h4>
                          <p className="text-small font-medium text-neutral-muted truncate mt-0.5">
                            {event.host} · {event.attendees.length > 0 ? `${event.attendees.length} attendees` : 'Personal'}
                          </p>
                        </div>

                        <div className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${theme.wash} ${theme.text}`}>
                          {theme.label || event.category}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
