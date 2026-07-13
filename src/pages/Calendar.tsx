import { useCallback, useMemo, useState } from 'react'
import { TODAY } from '../data/constants'
import { useCalendarEvents } from '../context/CalendarContext'
import { useActionItems } from '../context/ActionItemsContext'
import type { CalendarEvent, CalendarEventCategory, CalendarViewMode } from '../types/calendar'
import { buildMonthGrid, countEventsInMonth, formatMonthYear, getEventsForDate, getWeekDates, parseYearMonth, shiftMonth, toIsoMonth } from '../utils/calendar'
import { CalendarToolbar } from '../components/calendar/CalendarToolbar'
import { MonthGrid } from '../components/calendar/MonthGrid'
import { WeekView } from '../components/calendar/WeekView'
import { DayView } from '../components/calendar/DayView'
import { EventSheet } from '../components/calendar/EventSheet'
import { CALENDAR_CATEGORIES } from '../components/calendar/categoryTheme'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { usePageLoading } from '../hooks/usePageLoading'

const initial = parseYearMonth(TODAY.slice(0, 7))
const allCategoryValues = CALENDAR_CATEGORIES.map((category) => category.value)

export function CalendarPage() {
  const isLoading = usePageLoading(350)
  const { events: allEvents } = useCalendarEvents()
  const { actionItems } = useActionItems()

  const [year, setYear] = useState(initial.year)
  const [month, setMonth] = useState(initial.month)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [view, setView] = useState<CalendarViewMode>('month')
  const [selectedCategories, setSelectedCategories] = useState<CalendarEventCategory[]>(allCategoryValues)

  const filteredEvents = useMemo(() => allEvents.filter((event) => selectedCategories.includes(event.category)), [allEvents, selectedCategories])
  const monthCells = useMemo(() => buildMonthGrid(year, month), [year, month])
  const eventCount = countEventsInMonth(filteredEvents, year, month)
  const dayEvents = useMemo(() => getEventsForDate(filteredEvents, selectedDate), [filteredEvents, selectedDate])
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
  const selectedEvent = useMemo(
    () => filteredEvents.find((event) => event.id === selectedEventId) ?? allEvents.find((event) => event.id === selectedEventId) ?? null,
    [allEvents, filteredEvents, selectedEventId],
  )
  const priorityCount = useMemo(() => actionItems.filter((item) => item.status !== 'Done').length, [actionItems])

  function syncVisibleMonth(date: string) {
    const { year: nextYear, month: nextMonth } = parseYearMonth(date.slice(0, 7))
    if (toIsoMonth(nextYear, nextMonth) !== toIsoMonth(year, month)) {
      setYear(nextYear)
      setMonth(nextMonth)
    }
  }

  function goToToday() {
    const { year: todayYear, month: todayMonth } = parseYearMonth(TODAY.slice(0, 7))
    setYear(todayYear)
    setMonth(todayMonth)
    setSelectedDate(TODAY)
    setSelectedEventId(null)
  }

  function goPrevMonth() {
    const next = shiftMonth(year, month, -1)
    setYear(next.year)
    setMonth(next.month)
  }

  function goNextMonth() {
    const next = shiftMonth(year, month, 1)
    setYear(next.year)
    setMonth(next.month)
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    setSelectedEventId(null)
    syncVisibleMonth(date)
  }

  function handlePeekDate(date: string) {
    setSelectedDate(date)
    setView('day')
    setSelectedEventId(null)
    syncVisibleMonth(date)
  }

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEventId(event.id)
    setSelectedDate(event.date)
    syncVisibleMonth(event.date)
  }

  function handleCategoryToggle(category: CalendarEventCategory) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        const next = current.filter((value) => value !== category)
        return next.length > 0 ? next : current
      }
      return [...current, category]
    })
  }

  function handleSelectAllCategories() {
    setSelectedCategories((current) => (current.length === allCategoryValues.length ? [allCategoryValues[0]] : allCategoryValues))
  }

  const closeSheet = useCallback(() => setSelectedEventId(null), [])

  if (isLoading) return <LoadingScreen message="Gathering your schedule..." />

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3.5 pb-10">
      <CalendarToolbar
        monthLabel={formatMonthYear(year, month)}
        selectedDate={selectedDate}
        eventCount={eventCount}
        priorityCount={priorityCount}
        view={view}
        selectedCategories={selectedCategories}
        onViewChange={setView}
        onCategoryToggle={handleCategoryToggle}
        onSelectAllCategories={handleSelectAllCategories}
        onToday={goToToday}
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
      />

      <main className="flex-1 min-h-0 overflow-hidden overflow-x-auto">
        <div className="min-w-[768px] md:min-w-0 h-full">
          {view === 'month' && <MonthGrid key={`month-${year}-${month}`} cells={monthCells} events={filteredEvents} selectedDate={selectedDate} onSelectDate={handleSelectDate} onSelectEvent={handleSelectEvent} onPeekDate={handlePeekDate} />}
          {view === 'week' && <WeekView key={`week-${weekDates[0]}`} weekDates={weekDates} events={filteredEvents} selectedEventId={selectedEventId} onSelectEvent={handleSelectEvent} />}
          {view === 'day' && <DayView key={`day-${selectedDate}`} date={selectedDate} events={dayEvents} selectedEventId={selectedEventId} onSelectEvent={handleSelectEvent} />}
        </div>
      </main>

      <EventSheet event={selectedEvent} onClose={closeSheet} />
    </div>
  )
}
