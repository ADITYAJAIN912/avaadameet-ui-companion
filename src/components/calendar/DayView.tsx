import type { CalendarEvent } from '../../types/calendar'
import { formatSelectedDayLabel, formatCompactEventTime } from '../../utils/calendar'
import { formatScheduledDuration, getTotalScheduledMinutes, getFocusBlockMinutes } from '../../utils/calendarSchedule'
import { buildDayAgenda, DAY_MIN_CARD_HEIGHT_PX } from '../../utils/calendarDayLayout'
import { TODAY } from '../../data/constants'
import { Card } from '../ui/Card'
import { AgendaMeetingCard } from './AgendaMeetingCard'

interface DayViewProps {
  date: string
  events: CalendarEvent[]
  selectedEventId: string | null
  onSelectEvent: (event: CalendarEvent) => void
}

export function DayView({ date, events, selectedEventId, onSelectEvent }: DayViewProps) {
  const meetingEvents = events.filter(
    (e) => e.blockType !== 'focus' && e.blockType !== 'break' && e.blockType !== 'lunch',
  )
  const totalMinutes = getTotalScheduledMinutes(events)
  const focusMinutes = getFocusBlockMinutes(events)
  const isToday = date === TODAY
  const agenda = buildDayAgenda(events)
  const nextMeeting = meetingEvents[0]

  return (
    <Card variant="container" className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-0 shadow-elevation-1">
      <header className="shrink-0 border-b border-neutral-border/50 bg-neutral-bg/25 px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-body font-semibold text-neutral-text">
              {formatSelectedDayLabel(date)}
            </h3>
            <p className="mt-0.5 text-caption text-neutral-muted">
              {meetingEvents.length} meetings · {formatScheduledDuration(totalMinutes)} scheduled
              {focusMinutes > 0 && ` · ${formatScheduledDuration(focusMinutes)} focus`}
            </p>
          </div>
          {nextMeeting && (
            <div className="rounded-xl border border-neutral-border/50 bg-white px-3 py-2 shadow-elevation-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
                {isToday ? 'Up next' : 'Opens with'}
              </p>
              <p className="text-caption font-semibold text-neutral-text">{nextMeeting.title}</p>
              <p className="text-[11px] text-neutral-muted">
                {nextMeeting.time} · {nextMeeting.host}
              </p>
            </div>
          )}
        </div>
      </header>

      {agenda.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-neutral-bg/20 px-4">
          <p className="text-body font-medium text-neutral-text">No events scheduled</p>
          <p className="mt-1 text-caption text-neutral-muted">Your day is open for strategic focus</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-3 py-2">
            {agenda.map(({ event, gapBeforePx }) => {
              const isBlock =
                event.blockType === 'focus' || event.blockType === 'lunch' || event.blockType === 'break'
              const isSelected = selectedEventId === event.id

              return (
                <div key={event.id} className="flex gap-3" style={{ marginTop: gapBeforePx }}>
                  {/* Secondary timeline rail */}
                  <div className="w-12 shrink-0 pt-3 text-right">
                    <span className="text-[10px] font-medium tabular-nums text-neutral-muted">
                      {formatCompactEventTime(event.time)}
                    </span>
                  </div>

                  {/* Primary meeting content */}
                  <div className="min-w-0 flex-1 pb-1">
                    {isBlock ? (
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className={`w-full rounded-xl border border-dashed border-neutral-border/60 bg-neutral-bg/60 p-3 text-left ease-premium hover:bg-neutral-bg ${
                          isSelected ? 'ring-2 ring-brand-teal/40' : ''
                        }`}
                        style={{ minHeight: DAY_MIN_CARD_HEIGHT_PX }}
                      >
                        <p className="text-caption font-semibold text-neutral-text">{event.title}</p>
                        <p className="mt-1 text-[11px] text-neutral-muted">
                          {event.durationMinutes} min · {event.location ?? 'Blocked'}
                        </p>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        className={`block w-full text-left ease-premium ${
                          isSelected ? 'rounded-xl ring-2 ring-brand-teal/40' : ''
                        }`}
                      >
                        <AgendaMeetingCard event={event} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
