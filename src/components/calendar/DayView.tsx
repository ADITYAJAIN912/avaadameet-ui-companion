import { CalendarDays, Coffee, Target, Utensils, Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import { TODAY, MOCK_NOW_TIME } from '../../data/constants'
import { formatSelectedDayLabel } from '../../utils/calendar'
import { formatEventTimeRange, formatScheduledDuration, getFocusBlockMinutes, getTotalScheduledMinutes } from '../../utils/calendarSchedule'
import { parseMeetingTime } from '../../utils/helpers'
import { buildDayAgenda } from '../../utils/calendarDayLayout'
import { EmptyState } from '../ui/EmptyState'
import { getBlockLabel, getCategoryTheme, isCalendarBlock } from './categoryTheme'

interface DayViewProps {
  date: string
  events: CalendarEvent[]
  selectedEventId: string | null
  onSelectEvent: (event: CalendarEvent) => void
}

function isUpcoming(event: CalendarEvent): boolean {
  if (event.date > TODAY) return true
  if (event.date < TODAY) return false
  const nowMins = parseMeetingTime(MOCK_NOW_TIME)
  const startMins = parseMeetingTime(event.time)
  const endMins = startMins + event.durationMinutes
  return nowMins < startMins || (nowMins >= startMins && nowMins < endMins)
}

function isActiveMeeting(event: CalendarEvent): boolean {
  if (event.date !== TODAY) return false
  const startMins = parseMeetingTime(event.time)
  const endMins = startMins + event.durationMinutes
  const nowMins = parseMeetingTime(MOCK_NOW_TIME)
  return nowMins >= startMins && nowMins < endMins
}

function BlockIcon({ event }: { event: CalendarEvent }) {
  const className = 'h-5 w-5 text-neutral-muted'
  if (event.blockType === 'focus') return <Target className={className} strokeWidth={1.75} />
  if (event.blockType === 'lunch') return <Utensils className={className} strokeWidth={1.75} />
  return <Coffee className={className} strokeWidth={1.75} />
}

export function DayView({ date, events, selectedEventId, onSelectEvent }: DayViewProps) {
  const meetings = events.filter((event) => !isCalendarBlock(event.blockType))
  const totalMinutes = getTotalScheduledMinutes(events)
  const focusMinutes = getFocusBlockMinutes(events)
  const agenda = buildDayAgenda(events)

  return (
    <section className="h-full card-surface reveal-fade flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-[var(--border-subtle)] bg-surface px-[22px] pb-3 pt-[18px]">
        <p className="kicker">Day view</p>
        <h2 className="mt-1 text-heading-lg font-extrabold tracking-[-0.01em] text-neutral-text">{formatSelectedDayLabel(date)}</h2>
        <p className="mt-2 text-small font-medium text-neutral-muted">
          {meetings.length} meetings, {formatScheduledDuration(totalMinutes)} scheduled, {formatScheduledDuration(focusMinutes)} focus time
        </p>
      </header>

      {agenda.length === 0 ? (
        <div className="flex flex-1 min-h-[22rem] items-center justify-center bg-surface-canvas/40 p-6 overflow-y-auto">
          <EmptyState icon={CalendarDays} title="No events scheduled" description="This day is open for strategy, recovery, or deep work." bare />
        </div>
      ) : (
        <div className="relative flex-1 overflow-y-auto bg-surface px-4 py-6">
          <div className="mx-auto max-w-4xl">
            {agenda.map(({ event, gapBeforePx }) => {
              const block = isCalendarBlock(event.blockType)
              const theme = getCategoryTheme(event.category)
              const selected = selectedEventId === event.id
              const active = isActiveMeeting(event)
              return (
                <div key={event.id} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4" style={{ marginTop: gapBeforePx }}>
                  <div className="pt-4 text-right font-mono text-[11.5px] tabular-nums text-neutral-muted relative">
                    {active && <div className="absolute top-4 -left-4 w-2 h-2 rounded-full bg-brand-teal animate-pulse" />}
                    {event.time}
                  </div>
                  <button type="button" onClick={() => onSelectEvent(event)} className={`group focus-ring flex w-full items-center gap-5 rounded-lg px-2 py-3 text-left transition-colors hover:bg-[#F3F3EA] ${selected ? 'ring-2 ring-brand-teal/30' : ''} ${active ? 'bg-brand-teal/5 ring-1 ring-inset ring-brand-teal border-transparent shadow-sm' : ''}`}>
                    {block ? (
                      <>
                        <div className={`shrink-0 w-1 h-9 rounded-full ${active ? 'bg-brand-teal' : 'bg-neutral-border'}`} />
                        <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-canvas"><BlockIcon event={event} /></span>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-body font-bold truncate ${active ? 'text-brand-teal' : 'text-neutral-text'}`}>{getBlockLabel(event.blockType)}</h4>
                          <p className={`text-small font-medium truncate mt-0.5 ${active ? 'text-brand-teal/70' : 'text-neutral-muted'}`}>{formatEventTimeRange(event)} - {event.durationMinutes} min</p>
                        </div>
                        {active && (
                          <div className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-brand-teal text-white animate-fade-in">
                            In Progress
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={`shrink-0 w-1 h-9 rounded-full ${active ? 'bg-brand-teal' : theme.dot}`} />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className={`text-body font-bold truncate ${active ? 'text-brand-teal' : 'text-neutral-text'}`}>{event.title}</h4>
                          <p className={`text-small font-medium truncate mt-0.5 ${active ? 'text-brand-teal/70' : 'text-neutral-muted'}`}>
                            {event.host} · {event.attendees.length > 0 ? `${event.attendees.length} attendees` : 'Personal'}
                          </p>
                        </div>
                        {active ? (
                           <div className="flex items-center gap-3">
                             <div className="shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-brand-teal text-white animate-fade-in shadow-sm">
                               Now
                             </div>
                             <span className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-brand-teal bg-brand-teal text-white px-4 py-2 text-small font-bold transition-all duration-200 hover:bg-brand-teal/90 shadow-sm">
                               <Video className="h-4 w-4" strokeWidth={1.75} />
                               Join
                             </span>
                           </div>
                        ) : isUpcoming(event) ? (
                          <span className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-neutral-border bg-surface px-4 py-2 text-small font-bold text-neutral-text transition-all duration-200 group-hover:border-brand-teal group-hover:text-brand-teal">
                            <Video className="h-4 w-4" strokeWidth={1.75} />
                            Join
                          </span>
                        ) : (
                          <div className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${theme.wash} ${theme.text}`}>
                            {theme.label || event.category}
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
