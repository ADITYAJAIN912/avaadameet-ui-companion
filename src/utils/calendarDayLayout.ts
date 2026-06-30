import type { CalendarEvent } from '../types/calendar'
import { parseMeetingTime } from './helpers'
import { getEventEndMinutes } from './calendarSchedule'

/** Day view — agenda list with proportional gaps (no empty timeline grid). */
export const DAY_MIN_CARD_HEIGHT_PX = 88
export const DAY_MIN_GAP_PX = 10
export const DAY_MAX_GAP_PX = 36
export const DAY_GAP_PER_HOUR_PX = 14

export interface DayAgendaItem {
  event: CalendarEvent
  gapBeforePx: number
}

export function computeDayGapPx(prevEndMinutes: number | null, nextStartMinutes: number): number {
  if (prevEndMinutes === null) return 0
  const gapMinutes = nextStartMinutes - prevEndMinutes
  if (gapMinutes <= 0) return DAY_MIN_GAP_PX
  const scaled = (gapMinutes / 60) * DAY_GAP_PER_HOUR_PX
  return Math.min(DAY_MAX_GAP_PX, Math.max(DAY_MIN_GAP_PX, Math.round(scaled)))
}

export function buildDayAgenda(events: CalendarEvent[]): DayAgendaItem[] {
  const sorted = [...events].sort(
    (a, b) => parseMeetingTime(a.time) - parseMeetingTime(b.time),
  )

  let prevEnd: number | null = null
  const items: DayAgendaItem[] = []

  for (const event of sorted) {
    const start = parseMeetingTime(event.time)
    items.push({
      event,
      gapBeforePx: computeDayGapPx(prevEnd, start),
    })
    prevEnd = getEventEndMinutes(event)
  }

  return items
}
