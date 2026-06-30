import { TODAY, MOCK_NOW_TIME } from '../../data/constants'
import { parseMeetingTime } from '../../utils/helpers'
import {
  getHourLineTopPercent,
  getNowLineTopPercent,
  getCurrentHourTopPercent,
  getScheduleHours,
  formatScheduleHour,
} from '../../utils/calendarSchedule'

interface ScheduleTimeGutterProps {
  highlightCurrentHour?: boolean
}

export function ScheduleTimeGutter({ highlightCurrentHour = false }: ScheduleTimeGutterProps) {
  const hours = getScheduleHours()
  const nowMinutes = parseMeetingTime(MOCK_NOW_TIME)
  const nowTop = getNowLineTopPercent(nowMinutes)
  const currentHour = highlightCurrentHour ? getCurrentHourTopPercent(nowMinutes) : null

  return (
    <div className="relative h-full w-12 shrink-0 border-r border-neutral-border/50 bg-neutral-bg/25">
      {currentHour && (
        <div
          className="pointer-events-none absolute right-0 left-0 z-0 bg-red-50/50"
          style={{ top: `${currentHour.top}%`, height: `${currentHour.height}%` }}
        />
      )}
      {hours.map((hour) => {
        const isCurrentHour = highlightCurrentHour && Math.floor(nowMinutes / 60) === hour
        return (
          <span
            key={hour}
            className={`absolute right-1.5 z-[1] -translate-y-1/2 text-[10px] font-medium tabular-nums ${
              isCurrentHour ? 'font-semibold text-red-600' : 'text-neutral-muted'
            }`}
            style={{ top: `${getHourLineTopPercent(hour)}%` }}
          >
            {formatScheduleHour(hour)}
          </span>
        )
      })}
      {nowTop !== null && (
        <div className="pointer-events-none absolute right-0 left-0 z-[2]" style={{ top: `${nowTop}%` }}>
          <div className="border-t-2 border-red-500" />
          <span className="absolute -top-2 right-0 rounded bg-red-500 px-1 py-px text-[8px] font-semibold text-white">
            Now
          </span>
        </div>
      )}
    </div>
  )
}

interface ScheduleHourGridProps {
  date?: string
}

export function ScheduleHourGrid({ date }: ScheduleHourGridProps) {
  const hours = getScheduleHours()
  const showNow = date === TODAY
  const nowMinutes = parseMeetingTime(MOCK_NOW_TIME)
  const nowTop = showNow ? getNowLineTopPercent(nowMinutes) : null
  const currentHour = showNow ? getCurrentHourTopPercent(nowMinutes) : null

  return (
    <>
      {currentHour && (
        <div
          className="pointer-events-none absolute right-0 left-0 z-0 bg-red-50/40"
          style={{ top: `${currentHour.top}%`, height: `${currentHour.height}%` }}
        />
      )}
      {hours.map((hour) => (
        <div
          key={hour}
          className="pointer-events-none absolute right-0 left-0 z-0 border-t border-neutral-border/30"
          style={{ top: `${getHourLineTopPercent(hour)}%` }}
        />
      ))}
      {nowTop !== null && (
        <div
          className="pointer-events-none absolute right-0 left-0 z-[1]"
          style={{ top: `${nowTop}%` }}
          aria-hidden
        >
          <div className="border-t-2 border-red-500" />
        </div>
      )}
    </>
  )
}
