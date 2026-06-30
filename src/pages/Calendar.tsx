import { useMemo, useState } from 'react'
import { TODAY } from '../data/constants'
import { getCalendarEvents } from '../data/mockCalendarEvents'
import { mockActionItems } from '../data/mockActionItems'
import type { CalendarEvent, CalendarFilterCategory, CalendarViewMode } from '../types/calendar'
import {
  buildMonthGrid,
  countEventsInMonth,
  filterEventsByCategory,
  formatMonthYear,
  getEventsForDate,
  getUpcomingMeetings,
  getWeekDates,
  parseYearMonth,
  shiftMonth,
  toIsoMonth,
} from '../utils/calendar'
import { CalendarToolbar } from '../components/calendar/CalendarToolbar'
import { MonthGrid } from '../components/calendar/MonthGrid'
import { WeekView } from '../components/calendar/WeekView'
import { DayView } from '../components/calendar/DayView'
import { CalendarSidebar } from '../components/calendar/CalendarSidebar'
import { ExecutiveBriefSidebar } from '../components/calendar/ExecutiveBriefSidebar'
import { CalendarPageSkeleton } from '../components/ui/Skeleton'
import { usePageLoading } from '../hooks/usePageLoading'

const initial = parseYearMonth(TODAY.slice(0, 7))

export function CalendarPage() {
  const isLoading = usePageLoading(350)
  const allEvents = useMemo(() => getCalendarEvents(), [])

  const [year, setYear] = useState(initial.year)
  const [month, setMonth] = useState(initial.month)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [view, setView] = useState<CalendarViewMode>('month')
  const [categoryFilter, setCategoryFilter] = useState<CalendarFilterCategory>('all')

  const filteredEvents = useMemo(
    () => filterEventsByCategory(allEvents, categoryFilter),
    [allEvents, categoryFilter],
  )

  const monthCells = useMemo(() => buildMonthGrid(year, month), [year, month])
  const eventCount = countEventsInMonth(filteredEvents, year, month)
  const dayEvents = useMemo(
    () => getEventsForDate(filteredEvents, selectedDate),
    [filteredEvents, selectedDate],
  )
  const todayEvents = useMemo(
    () => getEventsForDate(filteredEvents, TODAY),
    [filteredEvents],
  )
  const upcomingEvents = useMemo(() => {
    const upcoming = getUpcomingMeetings(filteredEvents, 8)
    const todayShown = new Set(todayEvents.slice(0, 4).map((e) => e.id))
    return upcoming.filter((e) => !todayShown.has(e.id)).slice(0, 4)
  }, [filteredEvents, todayEvents])
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
  const selectedEvent = useMemo(
    () => filteredEvents.find((e) => e.id === selectedEventId) ?? null,
    [filteredEvents, selectedEventId],
  )

  const isScheduleView = view === 'week' || view === 'day'

  function goToToday() {
    const { year: y, month: m } = parseYearMonth(TODAY.slice(0, 7))
    setYear(y)
    setMonth(m)
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
    const { year: y, month: m } = parseYearMonth(date.slice(0, 7))
    if (toIsoMonth(y, m) !== toIsoMonth(year, month)) {
      setYear(y)
      setMonth(m)
    }
  }

  function handleSelectEvent(event: CalendarEvent) {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id))
    setSelectedDate(event.date)
  }

  if (isLoading) {
    return <CalendarPageSkeleton />
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-6.75rem)] max-w-7xl flex-col gap-1.5 overflow-hidden lg:h-[calc(100dvh-6.25rem)] max-lg:h-auto max-lg:overflow-visible">
      <CalendarToolbar
        monthLabel={formatMonthYear(year, month)}
        eventCount={eventCount}
        view={view}
        categoryFilter={categoryFilter}
        onViewChange={setView}
        onCategoryChange={setCategoryFilter}
        onToday={goToToday}
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
      />

      <div
        className={`flex min-h-0 flex-1 overflow-hidden max-lg:min-h-[28rem] max-lg:flex-col ${
          isScheduleView ? 'gap-1.5' : 'gap-2'
        }`}
      >
        <div
          className={`min-h-0 overflow-hidden ${
            isScheduleView ? 'flex-1 lg:w-[79%]' : 'flex-1 lg:w-[70%]'
          }`}
        >
          {view === 'month' && (
            <MonthGrid
              cells={monthCells}
              events={filteredEvents}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
          {view === 'week' && (
            <WeekView
              weekDates={weekDates}
              events={filteredEvents}
              selectedDate={selectedDate}
              selectedEventId={selectedEventId}
              onSelectDate={handleSelectDate}
              onSelectEvent={handleSelectEvent}
            />
          )}
          {view === 'day' && (
            <DayView
              date={selectedDate}
              events={dayEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </div>

        <div
          className={`min-h-0 shrink-0 overflow-hidden max-lg:h-80 ${
            isScheduleView
              ? 'lg:w-[21%] lg:min-w-[10.5rem] lg:max-w-[14rem]'
              : 'lg:w-[30%] lg:min-w-[18rem] lg:max-w-md'
          }`}
        >
          {isScheduleView ? (
            <ExecutiveBriefSidebar
              todayEvents={todayEvents}
              upcomingEvents={upcomingEvents}
              actionItems={mockActionItems}
              selectedEvent={selectedEvent}
            />
          ) : (
            <CalendarSidebar
              year={year}
              month={month}
              selectedDate={selectedDate}
              todayEvents={todayEvents}
              upcomingEvents={upcomingEvents}
              actionItems={mockActionItems}
              onSelectDate={handleSelectDate}
              onPrevMonth={goPrevMonth}
              onNextMonth={goNextMonth}
            />
          )}
        </div>
      </div>
    </div>
  )
}
