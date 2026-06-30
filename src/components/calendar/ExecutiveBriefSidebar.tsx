import { Link } from 'react-router-dom'
import { CheckSquare, Clock, ListTodo, Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import type { ActionItem } from '../../types/actionItem'
import { formatShortAgendaDate } from '../../utils/calendar'
import {
  formatScheduledDuration,
  getFocusBlockMinutes,
  getTotalScheduledMinutes,
} from '../../utils/calendarSchedule'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { AvatarGroup } from '../ui/AvatarGroup'

interface ExecutiveBriefSidebarProps {
  todayEvents: CalendarEvent[]
  upcomingEvents: CalendarEvent[]
  actionItems: ActionItem[]
  selectedEvent: CalendarEvent | null
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-border/50 bg-neutral-bg/40 px-2 py-1.5 text-center">
      <p className="text-[10px] font-medium text-neutral-muted">{label}</p>
      <p className="text-caption font-semibold tabular-nums text-neutral-text">{value}</p>
    </div>
  )
}

function BriefMeetingRow({
  event,
  showDate,
}: {
  event: CalendarEvent
  showDate?: boolean
}) {
  const styles = getEventStyles(event.category)
  const isBlock = event.blockType === 'focus' || event.blockType === 'lunch' || event.blockType === 'break'

  return (
    <div
      className={`rounded-lg border border-neutral-border/50 border-l-[3px] p-2 ${styles.stripe} ${
        isBlock ? 'bg-neutral-bg/50' : 'bg-white'
      }`}
    >
      <p className="truncate text-caption font-medium text-neutral-text">{event.title}</p>
      <p className="mt-0.5 text-[11px] text-neutral-muted">
        {showDate && `${formatShortAgendaDate(event.date)} · `}
        {event.time} · {event.host}
      </p>
      {!isBlock && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <AvatarGroup attendees={event.attendees} max={3} size="sm" />
          <Button variant="secondary" className="h-7 shrink-0 px-2 text-[10px]">
            <Video className="h-3 w-3" strokeWidth={1.75} />
          </Button>
        </div>
      )}
    </div>
  )
}

function getPrepChecklist(events: CalendarEvent[], selected: CalendarEvent | null): string[] {
  const target =
    selected ??
    events.find((e) => e.importance === 'high' && e.blockType !== 'focus') ??
    events[0]
  if (!target) return ['Review tomorrow\'s calendar', 'Clear pending approvals']

  const items: string[] = []
  if (target.importance === 'high') {
    items.push(`Review materials for ${target.title}`)
    items.push('Confirm attendee list and dial-in')
  }
  if (target.category === 'board' || target.category === 'sales') {
    items.push('Prepare talking points and deck')
  }
  if (target.location?.includes('Board')) {
    items.push('Arrive 10 min early — Boardroom setup')
  }
  items.push('Download offline copies of shared docs')
  return items.slice(0, 4)
}

export function ExecutiveBriefSidebar({
  todayEvents,
  upcomingEvents,
  actionItems,
  selectedEvent,
}: ExecutiveBriefSidebarProps) {
  const meetings = todayEvents.filter(
    (e) => e.blockType !== 'focus' && e.blockType !== 'break' && e.blockType !== 'lunch',
  )
  const focusMinutes = getFocusBlockMinutes(todayEvents)
  const meetingMinutes = getTotalScheduledMinutes(todayEvents)
  const pendingActions = actionItems.filter((a) => a.status !== 'Done')
  const prepItems = getPrepChecklist(meetings, selectedEvent)
  const visibleAgenda = todayEvents.slice(0, 4)
  const agendaOverflow = todayEvents.length - visibleAgenda.length

  return (
    <Card
      variant="default"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl p-0 shadow-elevation-1"
    >
      <header className="shrink-0 border-b border-neutral-border/50 bg-neutral-bg/25 p-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-muted">
          Executive Daily Brief
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          <StatPill label="Meetings" value={String(meetings.length)} />
          <StatPill label="Focus" value={formatScheduledDuration(focusMinutes)} />
          <StatPill label="Actions" value={String(pendingActions.length)} />
        </div>
        <p className="mt-1.5 text-[11px] text-neutral-muted">
          <Clock className="mr-1 inline h-3 w-3" strokeWidth={1.75} />
          {formatScheduledDuration(meetingMinutes)} in meetings today
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedEvent && (
          <section className="border-b border-brand-teal/20 bg-brand-tealLight/25 p-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
              Selected
            </p>
            <BriefMeetingRow event={selectedEvent} />
          </section>
        )}

        <section className="border-b border-neutral-border/50 p-2">
          <h3 className="mb-1.5 text-caption font-semibold text-neutral-text">Today&apos;s Agenda</h3>
          {todayEvents.length === 0 ? (
            <p className="rounded-lg bg-neutral-bg/60 py-4 text-center text-caption text-neutral-muted">
              Clear schedule today
            </p>
          ) : (
            <div className="space-y-2">
              {visibleAgenda.map((ev) => (
                <BriefMeetingRow key={ev.id} event={ev} />
              ))}
              {agendaOverflow > 0 && (
                <p className="text-center text-[11px] font-medium text-brand-teal">
                  +{agendaOverflow} more today
                </p>
              )}
            </div>
          )}
        </section>

        <section className="border-b border-neutral-border/50 p-2">
          <h3 className="mb-1.5 text-caption font-semibold text-neutral-text">Upcoming Meetings</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-caption text-neutral-muted">Nothing ahead on the calendar</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <BriefMeetingRow key={ev.id} event={ev} showDate />
              ))}
            </div>
          )}
        </section>

        <section className="border-b border-neutral-border/50 p-2">
          <h3 className="mb-1.5 flex items-center gap-1.5 text-caption font-semibold text-neutral-text">
            <ListTodo className="h-3.5 w-3.5" strokeWidth={1.75} />
            Pending Action Items
          </h3>
          {pendingActions.length === 0 ? (
            <p className="text-caption text-neutral-muted">All caught up</p>
          ) : (
            <ul className="space-y-1.5">
              {pendingActions.slice(0, 3).map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-neutral-border/50 bg-neutral-bg/40 px-2.5 py-2"
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
            View all →
          </Link>
        </section>

        <section className="p-2">
          <h3 className="mb-1.5 flex items-center gap-1.5 text-caption font-semibold text-neutral-text">
            <CheckSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
            Meeting Preparation
          </h3>
          <ul className="space-y-1.5">
            {prepItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-lg border border-neutral-border/40 bg-white px-2.5 py-2 text-[11px] text-neutral-text"
              >
                <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-neutral-border/60" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  )
}
