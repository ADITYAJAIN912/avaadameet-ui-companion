import { createContext, useContext, useState, type ReactNode } from 'react'
import { getCalendarEvents } from '../data/mockCalendarEvents'
import type { CalendarEvent } from '../types/calendar'

interface CalendarContextValue {
  events: CalendarEvent[]
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: ReactNode }) {
  // TODO(backend): hydrate from GET /api/v1/calendar/events instead of getCalendarEvents()
  const [events] = useState<CalendarEvent[]>(getCalendarEvents())

  return <CalendarContext.Provider value={{ events }}>{children}</CalendarContext.Provider>
}

export function useCalendarEvents() {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error('useCalendarEvents must be used within CalendarProvider')
  return ctx
}
