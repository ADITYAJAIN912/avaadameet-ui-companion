import { TODAY, MOCK_NOW_TIME } from '../../data/constants'
import { parseMeetingTime } from '../../utils/helpers'
import { getScheduleHours, formatScheduleHour } from '../../utils/calendarSchedule'
import {
  WEEK_GRID_HEIGHT_PX,
  WEEK_TIMELINE_WIDTH_PX,
  getWeekHourTopPx,
  getWeekNowTopPx,
} from '../../utils/calendarWeekLayout'

interface WeekTimelineGutterProps {
  highlightCurrentHour?: boolean
}

export function WeekTimelineGutter({ highlightCurrentHour = false }: WeekTimelineGutterProps) {
  const hours = getScheduleHours()
  const nowMinutes = parseMeetingTime(MOCK_NOW_TIME)
  const nowTop = getWeekNowTopPx(nowMinutes)
  const currentHour = highlightCurrentHour ? Math.floor(nowMinutes / 60) : null

  return (
    <div
      className="sticky left-0 z-10 shrink-0 border-r border-neutral-border/50 bg-neutral-bg/30"
      style={{ width: WEEK_TIMELINE_WIDTH_PX, height: WEEK_GRID_HEIGHT_PX }}
    >
      {hours.map((hour) => {
        const isCurrent = currentHour === hour
        return (
          <span
            key={hour}
            className={`absolute right-1 -translate-y-1/2 text-[9px] font-medium tabular-nums ${
              isCurrent ? 'font-semibold text-red-600' : 'text-neutral-muted'
            }`}
            style={{ top: getWeekHourTopPx(hour) }}
          >
            {formatScheduleHour(hour)}
          </span>
        )
      })}
      {nowTop !== null && (
        <div
          className="pointer-events-none absolute right-0 left-0 flex items-center"
          style={{ top: nowTop }}
          aria-hidden
        >
          <span className="h-1.5 w-1.5 shrink-0 -translate-x-1/2 rounded-full bg-red-500" />
          <div className="h-px flex-1 bg-red-500/60" />
        </div>
      )}
    </div>
  )
}

interface WeekHourGridProps {
  date?: string
}

export function WeekHourGrid({ date }: WeekHourGridProps) {
  const hours = getScheduleHours()
  const showNow = date === TODAY
  const nowMinutes = parseMeetingTime(MOCK_NOW_TIME)
  const nowTop = showNow ? getWeekNowTopPx(nowMinutes) : null

  return (
    <>
      {hours.map((hour) => (
        <div
          key={hour}
          className="pointer-events-none absolute right-0 left-0 border-t border-neutral-border/30"
          style={{ top: getWeekHourTopPx(hour) }}
        />
      ))}
      {nowTop !== null && (
        <div
          className="pointer-events-none absolute right-0 left-0 z-[1] flex items-center"
          style={{ top: nowTop }}
          aria-hidden
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          <div className="h-px flex-1 bg-red-500/60" />
        </div>
      )}
    </>
  )
}
