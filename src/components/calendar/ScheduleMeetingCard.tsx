import { MapPin, RefreshCw, Users, Video } from 'lucide-react'
import type { CalendarEvent } from '../../types/calendar'
import type { PositionedScheduleEvent } from '../../utils/calendarSchedule'
import { formatEventTimeRange, getPlatformLabel } from '../../utils/calendarSchedule'
import { getEventStyles } from '../../utils/calendarEventStyles'
import { Button } from '../ui/Button'
import { AvatarGroup } from '../ui/AvatarGroup'

interface ScheduleMeetingCardProps {
  layout: PositionedScheduleEvent
  density: 'week' | 'day'
  isSelected?: boolean
  onSelect?: (event: CalendarEvent) => void
}

export function ScheduleMeetingCard({
  layout,
  density,
  isSelected = false,
  onSelect,
}: ScheduleMeetingCardProps) {
  const { event, topPercent, heightPercent, leftPercent, widthPercent } = layout
  if (heightPercent <= 0) return null

  const styles = getEventStyles(event.category)
  const isBlock = event.blockType === 'focus' || event.blockType === 'lunch' || event.blockType === 'break'
  const isHigh = event.importance === 'high'
  const timeRange = formatEventTimeRange(event)
  const platform = getPlatformLabel(event)
  const attendeeCount = event.attendees.length

  const isNarrow = widthPercent < 46
  const isShort = heightPercent < 7
  const isDay = density === 'day'
  const showHost = !isBlock && !isShort && (!isNarrow || isDay)
  const showFooter = isDay && !isBlock && !isShort && heightPercent >= 9 && widthPercent >= 42

  const blockStyles = isBlock
    ? 'border border-dashed border-neutral-border/70 bg-neutral-bg/80 text-neutral-muted'
    : `bg-white ring-1 ring-neutral-border/40 ${styles.card}`

  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      aria-label={`${timeRange}, ${event.title}`}
      className={`absolute overflow-hidden rounded-lg text-left shadow-elevation-1 ease-premium hover:z-[5] hover:shadow-elevation-2 ${blockStyles} ${
        isHigh && !isBlock ? 'border-l-4' : 'border-l-[3px]'
      } ${styles.stripe} ${
        isSelected ? 'z-[6] ring-2 ring-brand-teal/50' : 'z-[3]'
      }`}
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        left: `calc(${leftPercent}% + 3px)`,
        width: `calc(${widthPercent}% - 6px)`,
      }}
    >
      <div className="flex h-full min-h-0 flex-col p-1.5">
        <div className="min-h-0 shrink-0">
          {!isShort && (
            <p className="truncate text-[9px] font-medium leading-none tabular-nums text-neutral-muted">
              {timeRange}
            </p>
          )}
          <p
            className={`truncate leading-snug text-neutral-text ${
              isShort ? 'text-[9px] font-medium' : isDay ? 'text-[11px] font-semibold' : 'text-[10px] font-medium'
            } ${!isShort ? 'mt-0.5' : ''}`}
          >
            {isShort && (
              <span className="mr-0.5 tabular-nums text-neutral-muted">
                {timeRange.split(' – ')[0]}
              </span>
            )}
            {event.title}
          </p>
          {showHost && (
            <p className="mt-0.5 truncate text-[9px] text-neutral-muted">{event.host}</p>
          )}
          {isBlock && !isShort && event.location && (
            <p className="mt-0.5 truncate text-[9px] text-neutral-muted">{event.location}</p>
          )}
        </div>

        {!isDay && !isBlock && !isShort && !isNarrow && (
          <div className="mt-auto flex items-center gap-1 pt-0.5 text-[8px] text-neutral-muted">
            <Users className="h-2.5 w-2.5 shrink-0" strokeWidth={1.75} />
            <span>{attendeeCount}</span>
            {event.isRecurring && <RefreshCw className="h-2.5 w-2.5 shrink-0" strokeWidth={1.75} />}
          </div>
        )}

        {showFooter && (
          <div className="mt-auto shrink-0 space-y-1 border-t border-neutral-border/30 pt-1">
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-neutral-muted">
              <span className="inline-flex items-center gap-0.5">
                <Users className="h-2.5 w-2.5" strokeWidth={1.75} />
                {attendeeCount}
              </span>
              {event.location && (
                <span className="inline-flex min-w-0 items-center gap-0.5 truncate">
                  <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{event.location}</span>
                </span>
              )}
              {event.isRecurring && (
                <span className="inline-flex items-center gap-0.5">
                  <RefreshCw className="h-2.5 w-2.5" strokeWidth={1.75} />
                  Recurring
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex min-w-0 items-center gap-1.5">
                <AvatarGroup attendees={event.attendees} max={3} size="sm" />
                <span className="truncate text-[9px] text-neutral-muted">{platform}</span>
              </div>
              <Button
                variant="primary"
                className="h-6 shrink-0 px-2 text-[9px]"
                onClick={(e) => e.stopPropagation()}
              >
                <Video className="h-2.5 w-2.5" strokeWidth={1.75} />
                Join
              </Button>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}
