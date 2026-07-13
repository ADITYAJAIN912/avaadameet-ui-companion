import type { CalendarEvent } from '../../types/calendar'
import { getEventsForDate } from '../../utils/calendar'
import { TODAY } from '../../data/constants'
import { getCategoryTheme } from './categoryTheme'

interface WeekViewProps {
  weekDates: string[]
  events: CalendarEvent[]
  selectedEventId: string | null
  onSelectEvent: (event: CalendarEvent) => void
}

export function WeekView({ weekDates, events, selectedEventId, onSelectEvent }: WeekViewProps) {
  return (
    <section className="h-full card-surface reveal-fade flex flex-col overflow-hidden p-0 border border-[var(--border-subtle)]">
      <header className="shrink-0 border-b border-[var(--border-subtle)] bg-neutral-bg/50 px-6 py-4">
        <h2 className="text-body font-bold text-neutral-text">Week Overview</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-2">
        {weekDates.map(date => {
          const dayEvents = getEventsForDate(events, date)
          const isToday = date === TODAY
          const dayLabel = new Date(date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })
          
          return (
            <div key={date} className="mt-8 first:mt-4 reveal-scale">
              <div className="sticky top-0 z-10 mb-3 bg-surface/95 backdrop-blur-md py-2 border-b border-[var(--border-subtle)]/50">
                <h3 className="flex items-baseline gap-2">
                  <span className={`text-body-lg font-bold ${isToday ? 'text-brand-teal' : 'text-neutral-text'}`}>
                    {isToday ? 'Today' : dayLabel.split(',')[0]}
                  </span>
                  {!isToday && (
                    <span className="text-small font-medium text-neutral-muted">
                      {dayLabel.split(',')[1]}
                    </span>
                  )}
                </h3>
              </div>
              
              {dayEvents.length === 0 ? (
                <div className="py-6 text-body font-medium text-neutral-muted">
                  No scheduled events for this day.
                </div>
              ) : (
                <div className="flex flex-col">
                  {dayEvents.map(event => {
                    const theme = getCategoryTheme(event.category)
                    const selected = selectedEventId === event.id
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className={`group focus-ring flex w-full items-center gap-5 rounded-lg px-2 py-3 text-left transition-colors hover:bg-[#F3F3EA] ${selected ? 'bg-[#F3F3EA] ring-1 ring-inset ring-brand-teal/30' : ''}`}
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
          )
        })}
      </div>
    </section>
  )
}
