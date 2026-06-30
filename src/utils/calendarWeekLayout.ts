import type { CalendarEvent } from '../types/calendar'
import { parseMeetingTime } from './helpers'
import {
  SCHEDULE_END_MINUTES,
  SCHEDULE_SPAN_MINUTES,
  SCHEDULE_START_MINUTES,
  getEventEndMinutes,
} from './calendarSchedule'

/** Week view — pixel-based time grid. */
export const WEEK_HOUR_HEIGHT_PX = 56
export const WEEK_MIN_EVENT_HEIGHT_PX = 22
export const WEEK_EVENT_V_GAP_PX = 3
export const WEEK_TIMELINE_WIDTH_PX = 36
export const WEEK_COLUMN_PAD_PX = 5

export const WEEK_GRID_HEIGHT_PX = (SCHEDULE_SPAN_MINUTES / 60) * WEEK_HOUR_HEIGHT_PX

export interface PositionedWeekEvent {
  event: CalendarEvent
  topPx: number
  heightPx: number
  /** Inset from column left edge (px) */
  leftPx: number
  /** Card width — use with column's measured width, or CSS calc(100% - insets) */
  widthCss: string
}

export interface WeekOverflowBadge {
  id: string
  topPx: number
  rightPx: number
  count: number
  label: string
}

function minutesToTopPx(minutes: number): number {
  const clamped = Math.max(minutes, SCHEDULE_START_MINUTES)
  return ((clamped - SCHEDULE_START_MINUTES) / 60) * WEEK_HOUR_HEIGHT_PX
}

export function getWeekEventTopPx(event: CalendarEvent): number {
  return minutesToTopPx(parseMeetingTime(event.time))
}

export function getWeekEventHeightPx(event: CalendarEvent): number {
  const start = parseMeetingTime(event.time)
  const end = Math.min(getEventEndMinutes(event), SCHEDULE_END_MINUTES)
  const clampedStart = Math.max(start, SCHEDULE_START_MINUTES)
  if (end <= clampedStart) return 0
  const durationPx = ((end - clampedStart) / 60) * WEEK_HOUR_HEIGHT_PX
  return Math.max(durationPx - WEEK_EVENT_V_GAP_PX, WEEK_MIN_EVENT_HEIGHT_PX)
}

export function getWeekHourTopPx(hour: number): number {
  return minutesToTopPx(hour * 60)
}

export function getWeekNowTopPx(nowMinutes: number): number | null {
  if (nowMinutes < SCHEDULE_START_MINUTES || nowMinutes > SCHEDULE_END_MINUTES) return null
  return minutesToTopPx(nowMinutes)
}

function eventsOverlap(a: { start: number; end: number }, b: { start: number; end: number }): boolean {
  return a.start < b.end && b.start < a.end
}

function importanceRank(event: CalendarEvent): number {
  if (event.importance === 'high') return 0
  if (event.importance === 'low') return 2
  return 1
}

type Slot = {
  event: CalendarEvent
  start: number
  end: number
}

/**
 * Week layout: one full-width card per time slot.
 * Concurrent meetings → show highest-priority event full width + "+N more" pill.
 * No side-by-side squeezing.
 */
export function layoutWeekDayEvents(events: CalendarEvent[]): {
  positioned: PositionedWeekEvent[]
  overflow: WeekOverflowBadge[]
} {
  const pad = WEEK_COLUMN_PAD_PX
  const fullWidth = `calc(100% - ${pad * 2}px)`

  const slots: Slot[] = events
    .map((event) => ({
      event,
      start: parseMeetingTime(event.time),
      end: getEventEndMinutes(event),
    }))
    .filter((s) => getWeekEventHeightPx(s.event) > 0)
    .sort((a, b) => a.start - b.start || b.end - a.end)

  const positioned: PositionedWeekEvent[] = []
  const overflow: WeekOverflowBadge[] = []
  const placed = new Set<string>()

  for (const slot of slots) {
    if (placed.has(slot.event.id)) continue

    const concurrent = slots.filter(
      (s) => !placed.has(s.event.id) && eventsOverlap(s, slot),
    )
    const sorted = [...concurrent].sort(
      (a, b) => importanceRank(a.event) - importanceRank(b.event) || a.start - b.start,
    )

    const primary = sorted[0]
    const hidden = sorted.slice(1)

    positioned.push({
      event: primary.event,
      topPx: getWeekEventTopPx(primary.event),
      heightPx: getWeekEventHeightPx(primary.event),
      leftPx: pad,
      widthCss: fullWidth,
    })
    placed.add(primary.event.id)

    for (const h of hidden) placed.add(h.event.id)

    if (hidden.length > 0) {
      const topPx = getWeekEventTopPx(primary.event)
      const primaryH = getWeekEventHeightPx(primary.event)
      overflow.push({
        id: `overflow-${primary.event.id}`,
        topPx: topPx + primaryH - 13,
        rightPx: pad,
        count: hidden.length,
        label: hidden.map((s) => s.event.title).join(', '),
      })
    }
  }

  return { positioned, overflow }
}
