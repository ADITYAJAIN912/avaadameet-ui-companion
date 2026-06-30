import type { CalendarEvent, CalendarFilterCategory } from '../types/calendar'
import { MOCK_NOW_TIME, TODAY } from '../data/constants'
import { parseMeetingTime } from './helpers'

export interface CalendarDayCell {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function getWeekdayLabels(): readonly string[] {
  return WEEKDAY_LABELS
}

export function parseYearMonth(isoMonth: string): { year: number; month: number } {
  const [y, m] = isoMonth.split('-').map(Number)
  return { year: y, month: m }
}

export function toIsoMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function formatSelectedDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month - 1 + delta, 1)
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

/** Monday-start month grid including leading/trailing days. */
export function buildMonthGrid(year: number, month: number): CalendarDayCell[] {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const daysInMonth = last.getDate()

  // Monday = 0 … Sunday = 6
  const mondayOffset = (first.getDay() + 6) % 7

  const cells: CalendarDayCell[] = []

  for (let i = mondayOffset - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, -i)
    const iso = toIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
    cells.push({
      date: iso,
      day: d.getDate(),
      isCurrentMonth: false,
      isToday: iso === TODAY,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso = toIsoDate(year, month, day)
    cells.push({
      date: iso,
      day,
      isCurrentMonth: true,
      isToday: iso === TODAY,
    })
  }

  while (cells.length % 7 !== 0) {
    const lastCell = cells[cells.length - 1]
    const d = new Date(`${lastCell.date}T00:00:00`)
    d.setDate(d.getDate() + 1)
    const iso = toIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
    cells.push({
      date: iso,
      day: d.getDate(),
      isCurrentMonth: false,
      isToday: iso === TODAY,
    })
  }

  return cells
}

export function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date)
    if (dateCmp !== 0) return dateCmp
    return parseMeetingTime(a.time) - parseMeetingTime(b.time)
  })
}

export function getEventsForDate(events: CalendarEvent[], date: string): CalendarEvent[] {
  return sortEventsByTime(events.filter((e) => e.date === date))
}

export function filterEventsByCategory(
  events: CalendarEvent[],
  filter: CalendarFilterCategory,
): CalendarEvent[] {
  switch (filter) {
    case 'meetings':
      return events.filter((e) =>
        ['meeting', 'leadership', 'compliance', 'engineering', 'sales', 'board'].includes(
          e.category,
        ),
      )
    case 'standups':
      return events.filter((e) => e.category === 'standup')
    case 'reviews':
      return events.filter((e) => e.category === 'review')
    case 'personal':
      return events.filter((e) => e.category === 'personal')
    default:
      return events
  }
}

export function countEventsInMonth(events: CalendarEvent[], year: number, month: number): number {
  const prefix = toIsoMonth(year, month)
  return events.filter((e) => e.date.startsWith(prefix)).length
}

export function getWeekDates(anchorDate: string): string[] {
  const d = new Date(`${anchorDate}T00:00:00`)
  const mondayOffset = (d.getDay() + 6) % 7
  const monday = new Date(d)
  monday.setDate(d.getDate() - mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return toIsoDate(day.getFullYear(), day.getMonth() + 1, day.getDate())
  })
}

export function isWeekend(isoDate: string): boolean {
  const day = new Date(`${isoDate}T00:00:00`).getDay()
  return day === 0 || day === 6
}

/** 24h-style time for compact grid pills, e.g. 09:30 */
export function formatCompactEventTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i)
  if (!match) return time
  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const period = match[3].toLowerCase()
  if (period === 'pm' && hours !== 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0
  return `${String(hours).padStart(2, '0')}:${minutes}`
}

export function getUpcomingMeetings(events: CalendarEvent[], limit = 4): CalendarEvent[] {
  const nowMinutes = parseMeetingTime(MOCK_NOW_TIME)
  return sortEventsByTime(events)
    .filter((e) => {
      if (e.date > TODAY) return true
      if (e.date === TODAY) return parseMeetingTime(e.time) >= nowMinutes
      return false
    })
    .slice(0, limit)
}

export function formatShortAgendaDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
