import type { CalendarEvent } from '../types/calendar'
import { parseMeetingTime } from './helpers'
import { formatCompactEventTime } from './calendar'

/** Compressed executive day — 8:00 AM to 7:00 PM */
export const SCHEDULE_START_MINUTES = 8 * 60
export const SCHEDULE_END_MINUTES = 19 * 60
export const SCHEDULE_SPAN_MINUTES = SCHEDULE_END_MINUTES - SCHEDULE_START_MINUTES

const HOUR_COUNT = SCHEDULE_END_MINUTES / 60 - SCHEDULE_START_MINUTES / 60

export interface EventScheduleLayout {
  topPercent: number
  heightPercent: number
}

export interface PositionedScheduleEvent extends EventScheduleLayout {
  event: CalendarEvent
  leftPercent: number
  widthPercent: number
}

export interface ScheduleOverflowBadge {
  id: string
  topPercent: number
  heightPercent: number
  leftPercent: number
  widthPercent: number
  count: number
  label: string
}

interface LayoutOptions {
  maxColumns?: number
}

export function getScheduleHours(): number[] {
  const startHour = SCHEDULE_START_MINUTES / 60
  return Array.from({ length: HOUR_COUNT + 1 }, (_, i) => startHour + i)
}

export function formatScheduleHour(hour: number): string {
  if (hour === 12) return '12 PM'
  if (hour > 12) return `${hour - 12} PM`
  return `${hour} AM`
}

export function getEventEndMinutes(event: CalendarEvent): number {
  return parseMeetingTime(event.time) + event.durationMinutes
}

export function getEventScheduleLayout(event: CalendarEvent): EventScheduleLayout {
  const start = parseMeetingTime(event.time)
  const end = Math.min(getEventEndMinutes(event), SCHEDULE_END_MINUTES)
  const clampedStart = Math.max(start, SCHEDULE_START_MINUTES)

  if (end <= SCHEDULE_START_MINUTES || clampedStart >= SCHEDULE_END_MINUTES) {
    return { topPercent: 0, heightPercent: 0 }
  }

  const topPercent = ((clampedStart - SCHEDULE_START_MINUTES) / SCHEDULE_SPAN_MINUTES) * 100
  const rawHeight = ((end - clampedStart) / SCHEDULE_SPAN_MINUTES) * 100

  return {
    topPercent,
    heightPercent: Math.max(rawHeight, 2.8),
  }
}

export function layoutOverlappingEvents(
  events: CalendarEvent[],
  options: LayoutOptions = {},
): { positioned: PositionedScheduleEvent[]; overflow: ScheduleOverflowBadge[] } {
  const maxColumns = options.maxColumns ?? 2

  type Slot = {
    event: CalendarEvent
    start: number
    end: number
    col: number
    placed: boolean
  }

  const slots: Slot[] = events
    .map((event) => ({
      event,
      start: parseMeetingTime(event.time),
      end: getEventEndMinutes(event),
      col: 0,
      placed: false,
    }))
    .filter((s) => getEventScheduleLayout(s.event).heightPercent > 0)
    .sort((a, b) => a.start - b.start || b.end - a.end)

  const clusters: Slot[][] = []
  let cluster: Slot[] = []
  let clusterEnd = 0

  for (const slot of slots) {
    if (cluster.length === 0 || slot.start < clusterEnd) {
      cluster.push(slot)
      clusterEnd = Math.max(clusterEnd, slot.end)
    } else {
      clusters.push(cluster)
      cluster = [slot]
      clusterEnd = slot.end
    }
  }
  if (cluster.length > 0) clusters.push(cluster)

  const positioned: PositionedScheduleEvent[] = []
  const overflow: ScheduleOverflowBadge[] = []

  for (const group of clusters) {
    const columns: Slot[][] = []
    const overflowSlots: Slot[] = []

    for (const slot of group) {
      let placed = false
      for (let c = 0; c < columns.length && c < maxColumns; c++) {
        const last = columns[c][columns[c].length - 1]
        if (last.end <= slot.start) {
          columns[c].push(slot)
          slot.col = c
          slot.placed = true
          placed = true
          break
        }
      }
      if (!placed) {
        if (columns.length < maxColumns) {
          slot.col = columns.length
          columns.push([slot])
          slot.placed = true
        } else {
          overflowSlots.push(slot)
        }
      }
    }

    const activeCols = Math.min(Math.max(columns.length, 1), maxColumns)
    const gap = 2
    const widthPercent = (100 - gap * (activeCols - 1)) / activeCols

    for (const col of columns) {
      for (const slot of col) {
        if (!slot.placed) continue
        const layout = getEventScheduleLayout(slot.event)
        positioned.push({
          event: slot.event,
          topPercent: layout.topPercent,
          heightPercent: layout.heightPercent,
          leftPercent: slot.col * (widthPercent + gap),
          widthPercent,
        })
      }
    }

    if (overflowSlots.length > 0) {
      const first = overflowSlots[0]
      const layout = getEventScheduleLayout(first.event)
      overflow.push({
        id: `overflow-${first.event.id}`,
        topPercent: layout.topPercent,
        heightPercent: Math.min(layout.heightPercent, 4),
        leftPercent: (widthPercent + gap) * (maxColumns - 1),
        widthPercent,
        count: overflowSlots.length,
        label: overflowSlots.map((s) => s.event.title).join(', '),
      })
    }
  }

  return { positioned, overflow }
}

export function getHourLineTopPercent(hour: number): number {
  const minutes = hour * 60
  return ((minutes - SCHEDULE_START_MINUTES) / SCHEDULE_SPAN_MINUTES) * 100
}

export function getNowLineTopPercent(nowMinutes: number): number | null {
  if (nowMinutes < SCHEDULE_START_MINUTES || nowMinutes > SCHEDULE_END_MINUTES) return null
  return ((nowMinutes - SCHEDULE_START_MINUTES) / SCHEDULE_SPAN_MINUTES) * 100
}

export function getCurrentHourTopPercent(nowMinutes: number): { top: number; height: number } | null {
  const hourStart = Math.floor(nowMinutes / 60) * 60
  const hourEnd = hourStart + 60
  if (hourEnd <= SCHEDULE_START_MINUTES || hourStart >= SCHEDULE_END_MINUTES) return null
  const clampedStart = Math.max(hourStart, SCHEDULE_START_MINUTES)
  const clampedEnd = Math.min(hourEnd, SCHEDULE_END_MINUTES)
  return {
    top: ((clampedStart - SCHEDULE_START_MINUTES) / SCHEDULE_SPAN_MINUTES) * 100,
    height: ((clampedEnd - clampedStart) / SCHEDULE_SPAN_MINUTES) * 100,
  }
}

export function formatEventTimeRange(event: CalendarEvent): string {
  const start = formatCompactEventTime(event.time)
  const endMinutes = getEventEndMinutes(event)
  const h = Math.floor(endMinutes / 60)
  const m = endMinutes % 60
  const period = h >= 12 ? 'pm' : 'am'
  let displayH = h % 12
  if (displayH === 0) displayH = 12
  const end = `${displayH}:${String(m).padStart(2, '0')}${period}`
  return `${start} – ${end}`
}

export function getTotalScheduledMinutes(events: CalendarEvent[]): number {
  return events
    .filter((e) => e.blockType !== 'focus' && e.blockType !== 'break' && e.blockType !== 'lunch')
    .reduce((sum, e) => sum + e.durationMinutes, 0)
}

export function getFocusBlockMinutes(events: CalendarEvent[]): number {
  return events
    .filter((e) => e.blockType === 'focus' || e.blockType === 'break')
    .reduce((sum, e) => sum + e.durationMinutes, 0)
}

export function formatScheduledDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function getPlatformLabel(event: CalendarEvent): string {
  if (event.blockType === 'focus' || event.blockType === 'break' || event.blockType === 'lunch') {
    return 'Blocked'
  }
  return event.platform === 'GOOGLE' ? 'Google Meet' : event.meetingType
}
