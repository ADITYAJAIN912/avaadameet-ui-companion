import type { CalendarEvent } from '../../types/calendar'
import { getWeekdayLabels, getEventsForDate, isWeekend } from '../../utils/calendar'
import { WEEK_GRID_HEIGHT_PX, WEEK_TIMELINE_WIDTH_PX, layoutWeekDayEvents } from '../../utils/calendarWeekLayout'
import { TODAY } from '../../data/constants'
import { Card } from '../ui/Card'
import { WeekTimelineGutter, WeekHourGrid } from './WeekTimelineGutter'
import { WeekMeetingCard } from './WeekMeetingCard'
import { WeekOverflowPill } from './WeekOverflowPill'

interface WeekViewProps {
  weekDates: string[]
  events: CalendarEvent[]
  selectedDate: string
  selectedEventId: string | null
  onSelectDate: (date: string) => void
  onSelectEvent: (event: CalendarEvent) => void
}

export function WeekView({
  weekDates,
  events,
  selectedDate,
  selectedEventId,
  onSelectDate,
  onSelectEvent,
}: WeekViewProps) {
  const weekdays = getWeekdayLabels()

  return (
    <Card variant="container" className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-0 shadow-elevation-1">
      {/* Day headers */}
      <div
        className="grid shrink-0 border-b border-neutral-border/50 bg-neutral-bg/30"
        style={{ gridTemplateColumns: `${WEEK_TIMELINE_WIDTH_PX}px repeat(7, minmax(0, 1fr))` }}
      >
        <div />
        {weekDates.map((date, i) => {
          const isSelected = date === selectedDate
          const isToday = date === TODAY
          const d = new Date(`${date}T00:00:00`)
          const count = getEventsForDate(events, date).filter(
            (e) => e.blockType !== 'focus' && e.blockType !== 'break' && e.blockType !== 'lunch',
          ).length

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`focus-ring min-w-0 border-r border-neutral-border/40 px-1.5 py-1 text-left ease-premium last:border-r-0 hover:bg-neutral-bg/50 ${
                isSelected ? 'bg-brand-tealLight/45' : isToday ? 'bg-brand-tealLight/20' : ''
              }`}
            >
              <div className="flex items-baseline justify-between gap-1">
                <p className="truncate text-[11px] leading-none">
                  <span className="font-medium uppercase tracking-wide text-neutral-muted">
                    {weekdays[i].slice(0, 3)}
                  </span>
                  <span
                    className={`ml-1 font-semibold tabular-nums ${
                      isToday ? 'text-brand-teal' : 'text-neutral-text'
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </p>
                {count > 0 && (
                  <span className="shrink-0 text-[9px] tabular-nums text-neutral-muted/80">
                    {count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Time grid — vertical scroll only; columns fill available width */}
      <div className="flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <WeekTimelineGutter highlightCurrentHour={weekDates.includes(TODAY)} />
        <div
          className="grid min-w-0 flex-1"
          style={{
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            height: WEEK_GRID_HEIGHT_PX,
          }}
        >
          {weekDates.map((date) => {
            const dayEvents = getEventsForDate(events, date)
            const { positioned, overflow } = layoutWeekDayEvents(dayEvents)
            const weekend = isWeekend(date)
            const isToday = date === TODAY

            return (
              <div
                key={date}
                className={`relative min-w-0 border-r border-neutral-border/40 last:border-r-0 ${
                  weekend ? 'bg-neutral-bg/35' : 'bg-white'
                } ${isToday ? 'bg-brand-tealLight/8' : ''}`}
                style={{ height: WEEK_GRID_HEIGHT_PX }}
              >
                <WeekHourGrid date={date} />
                {positioned.map((layout) => (
                  <WeekMeetingCard
                    key={layout.event.id}
                    layout={layout}
                    isSelected={selectedEventId === layout.event.id}
                    onSelect={onSelectEvent}
                  />
                ))}
                {overflow.map((badge) => (
                  <WeekOverflowPill key={badge.id} badge={badge} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
