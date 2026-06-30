import { Link } from 'react-router-dom'
import type { CalendarEvent } from '../../types/calendar'
import { TODAY } from '../../data/constants'
import { getEventsForDate } from '../../utils/calendar'
import { Card } from '../ui/Card'
import { CalendarEventPill } from './CalendarEventPill'

interface UpcomingTodayCardProps {
  events: CalendarEvent[]
}

export function UpcomingTodayCard({ events }: UpcomingTodayCardProps) {
  const todayEvents = getEventsForDate(events, TODAY).slice(0, 4)

  if (todayEvents.length === 0) return null

  return (
    <Card variant="default" className="mt-4 p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-card-heading">Upcoming Today</h3>
        <Link
          to="/meetings?filter=today"
          className="focus-ring text-caption font-medium text-brand-teal ease-premium hover:text-brand-teal/80"
        >
          View all meetings →
        </Link>
      </div>
      <div className="space-y-1">
        {todayEvents.map((ev) => (
          <CalendarEventPill key={ev.id} event={ev} />
        ))}
      </div>
    </Card>
  )
}
