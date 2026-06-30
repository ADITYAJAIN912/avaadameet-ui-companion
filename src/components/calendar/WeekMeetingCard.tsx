import type { CalendarEvent } from '../../types/calendar'
import type { PositionedWeekEvent } from '../../utils/calendarWeekLayout'
import { formatCompactEventTime } from '../../utils/calendar'
import { getEventColor, getEventStyles } from '../../utils/calendarEventStyles'

interface WeekMeetingCardProps {
  layout: PositionedWeekEvent
  isSelected?: boolean
  onSelect?: (event: CalendarEvent) => void
}

function getEventDetailLines(event: CalendarEvent): { host: string; attendees: string } {
  const names = event.attendees.map((a) => a.name).filter(Boolean)
  return {
    host: event.host,
    attendees: names.length > 0 ? names.join(', ') : 'No attendees listed',
  }
}

export function WeekMeetingCard({ layout, isSelected = false, onSelect }: WeekMeetingCardProps) {
  const { event, topPx, heightPx, leftPx, widthCss } = layout
  const styles = getEventStyles(event.category)
  const color = getEventColor(event.category)
  const isBlock = event.blockType === 'focus' || event.blockType === 'lunch' || event.blockType === 'break'
  const compact = heightPx < 36
  const timeLabel = formatCompactEventTime(event.time)
  const details = getEventDetailLines(event)

  const weekSoftBg: Record<typeof color, string> = {
    blue: 'bg-blue-50/55',
    green: 'bg-emerald-50/55',
    purple: 'bg-violet-50/55',
    orange: 'bg-amber-50/55',
    red: 'bg-red-50/55',
    gray: 'bg-neutral-bg/80',
  }

  const surfaceStyles = isBlock
    ? 'border-l-2 border-dashed border-neutral-border/60 bg-neutral-bg/70 text-neutral-muted'
    : `border-l-2 ${styles.stripe} ${weekSoftBg[color]}`

  return (
    <div
      className={`group absolute z-[3] ${isSelected ? 'z-[6]' : ''}`}
      style={{ top: topPx, height: heightPx, left: leftPx, width: widthCss }}
    >
      <button
        type="button"
        onClick={() => onSelect?.(event)}
        aria-label={`${timeLabel}, ${event.title}`}
        aria-expanded={isSelected}
        title={`${details.host} · ${details.attendees}`}
        className={`focus-ring h-full w-full overflow-hidden rounded-sm text-left ease-premium hover:z-[5] hover:brightness-[0.97] ${surfaceStyles} ${
          isSelected ? 'ring-1 ring-brand-teal/40' : ''
        }`}
      >
        <div
          className={`flex h-full flex-col justify-center ${compact ? 'px-1 py-px' : 'px-1.5 py-0.5'}`}
        >
          {compact ? (
            <p className="truncate text-[10px] leading-tight text-neutral-text">
              <span className="tabular-nums text-neutral-muted">{timeLabel}</span>{' '}
              <span className="font-medium">{event.title}</span>
            </p>
          ) : (
            <>
              <p className="truncate text-[10px] tabular-nums leading-none text-neutral-muted">
                {timeLabel}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-neutral-text">
                {event.title}
              </p>
            </>
          )}
        </div>
      </button>

      {/* Hover / selection detail popover — host & attendees stay out of the card */}
      <div
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-0 z-20 mb-0.5 w-full min-w-[7.5rem] rounded-md border border-neutral-border/50 bg-white p-1.5 shadow-elevation-2 transition-opacity duration-150 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        }`}
      >
        <p className="truncate text-[11px] font-medium text-neutral-text">{event.title}</p>
        <p className="mt-0.5 text-[10px] text-neutral-muted">{timeLabel}</p>
        <p className="mt-1.5 truncate text-[10px] text-neutral-muted">
          <span className="text-neutral-text">{details.host}</span>
        </p>
        <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-muted">{details.attendees}</p>
      </div>
    </div>
  )
}
