export type CalendarEventCategory =
  | 'meeting'
  | 'standup'
  | 'review'
  | 'leadership'
  | 'personal'
  | 'compliance'
  | 'engineering'
  | 'sales'
  | 'board'

export type CalendarFilterCategory = 'all' | 'meetings' | 'standups' | 'reviews' | 'personal'

export type CalendarViewMode = 'month' | 'week' | 'day'

export type CalendarEventColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'

export interface CalendarAttendee {
  name: string
  email?: string
}

export type CalendarBlockType = 'meeting' | 'focus' | 'lunch' | 'break'

export type CalendarEventImportance = 'high' | 'normal' | 'low'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  durationMinutes: number
  host: string
  attendees: CalendarAttendee[]
  category: CalendarEventCategory
  platform: 'GOOGLE' | 'MANUAL'
  meetingType: string
  location?: string
  isRecurring?: boolean
  importance?: CalendarEventImportance
  blockType?: CalendarBlockType
}
