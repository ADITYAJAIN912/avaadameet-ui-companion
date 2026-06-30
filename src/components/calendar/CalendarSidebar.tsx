import { Link } from 'react-router-dom'
import { Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import type { ActionItem } from '../../types/actionItem'
import { formatShortAgendaDate } from '../../utils/calendar'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { Card } from '../ui/Card'
import { MiniCalendar } from './MiniCalendar'
import { AgendaMeetingCard } from './AgendaMeetingCard'
import { Button } from '../ui/Button'
import { AvatarGroup } from '../ui/AvatarGroup'

interface CalendarSidebarProps {
  year: number
  month: number
  selectedDate: string
  todayEvents: CalendarEvent[]
  upcomingEvents: CalendarEvent[]
  actionItems: ActionItem[]
  onSelectDate: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

function UpcomingRow({ event }: { event: CalendarEvent }) {
  const styles = getEventStyles(event.category)

  return (
    <div className={`rounded-lg border-l-2 px-2.5 py-2 ${styles.stripe} bg-neutral-bg/40`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption font-medium text-neutral-text">{event.title}</p>
          <p className="mt-0.5 text-[11px] text-neutral-muted">
            {formatShortAgendaDate(event.date)} · {event.time}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-neutral-muted">{event.host}</p>
        </div>
        <Button variant="secondary" className="h-7 shrink-0 px-2 text-[10px]">
          <Video className="h-3 w-3" strokeWidth={1.75} />
        </Button>
      </div>
      <div className="mt-1.5">
        <AvatarGroup attendees={event.attendees} max={3} size="sm" />
      </div>
    </div>
  )
}

export function CalendarSidebar({
  year,
  month,
  selectedDate,
  todayEvents,
  upcomingEvents,
  actionItems,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarSidebarProps) {
  const priorityItems = actionItems
    .filter((a) => a.status !== 'Done')
    .sort((a, b) => b.openCount - a.openCount)
    .slice(0, 3)

  const visibleToday = todayEvents.slice(0, 3)
  const todayOverflow = todayEvents.length - visibleToday.length

  return (
    <Card
      variant="default"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-0 shadow-elevation-1"
    >
      <section className="shrink-0 border-b border-neutral-border/50 p-3">
        <MiniCalendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          compact
        />
      </section>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-neutral-border/50 p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h3 className="text-caption font-semibold text-neutral-text">Today&apos;s Agenda</h3>
            <span className="text-[11px] text-neutral-muted">
              {todayEvents.length} meeting{todayEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
          {todayEvents.length === 0 ? (
            <p className="rounded-lg bg-neutral-bg/60 py-4 text-center text-caption text-neutral-muted">
              No meetings today
            </p>
          ) : (
            <div className="space-y-2">
              {visibleToday.map((ev) => (
                <AgendaMeetingCard key={ev.id} event={ev} compact />
              ))}
              {todayOverflow > 0 && (
                <p className="text-center text-[11px] font-medium text-brand-teal">
                  +{todayOverflow} more today
                </p>
              )}
            </div>
          )}
        </section>

        <section className="border-b border-neutral-border/50 p-3">
          <h3 className="mb-2 text-caption font-semibold text-neutral-text">Upcoming Meetings</h3>
          {upcomingEvents.length === 0 ? (
            <p className="rounded-lg bg-neutral-bg/60 py-4 text-center text-caption text-neutral-muted">
              Nothing scheduled ahead
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <UpcomingRow key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </section>

        <section className="p-3">
          <h3 className="mb-2 text-caption font-semibold text-neutral-text">
            High Priority Action Items
          </h3>
          {priorityItems.length === 0 ? (
            <p className="text-caption text-neutral-muted">No open action items</p>
          ) : (
            <ul className="space-y-2">
              {priorityItems.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-neutral-border/50 bg-neutral-bg/50 px-2.5 py-2"
                >
                  <p className="truncate text-caption font-medium text-neutral-text">
                    {item.meetingTitle}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-muted">
                    {item.openCount} open · {item.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/action-items"
            className="focus-ring mt-2 inline-block text-caption font-medium text-brand-teal hover:text-brand-teal/80"
          >
            View all action items →
          </Link>
        </section>
      </div>
    </Card>
  )
}
