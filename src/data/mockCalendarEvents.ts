import type { Meeting } from '../types/meeting'
import type { CalendarEvent, CalendarEventCategory } from '../types/calendar'
import { mockMeetings } from './mockMeetings'
import { mockScheduleEvents } from './mockScheduleEvents'

const scheduleDates = new Set(mockScheduleEvents.map((e) => e.date))

function inferCategory(title: string): CalendarEventCategory {
  const t = title.toLowerCase()
  if (t.includes('standup') || t.includes('stand-up')) return 'standup'
  if (t.includes('review') || t.includes('retrospective')) return 'review'
  if (t.includes('board') || t.includes('investor')) return 'board'
  if (t.includes('leadership') || t.includes('sync')) return 'leadership'
  if (t.includes('compliance') || t.includes('audit')) return 'compliance'
  if (t.includes('engineering') || t.includes('sprint')) return 'engineering'
  if (t.includes('client') || t.includes('sales')) return 'sales'
  if (t.includes('1:1') || t.includes('personal')) return 'personal'
  return 'meeting'
}

function meetingToEvent(m: Meeting, durationMinutes = 45): CalendarEvent {
  return {
    id: `cal-${m.id}`,
    title: m.title,
    date: m.date,
    time: m.time,
    durationMinutes,
    host: m.host,
    attendees: m.attendees,
    category: inferCategory(m.title),
    platform: m.source,
    meetingType: m.source === 'GOOGLE' ? 'Google Meet' : 'Manual',
  }
}

/** Supplemental June 2026 events — static prototype data, no API. */
const supplementalEvents: CalendarEvent[] = [
  { id: 'cal-s01', title: 'Engineering Weekly', date: '2026-06-02', time: '10:00am', durationMinutes: 60, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Aditya Jain' }, { name: 'Neha Kapoor' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Team Sync' },
  { id: 'cal-s02', title: 'Leadership Sync', date: '2026-06-03', time: '9:00am', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Leadership' },
  { id: 'cal-s03', title: 'Client Review', date: '2026-06-04', time: '2:00pm', durationMinutes: 60, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Raj Mehta' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Client' },
  { id: 'cal-s04', title: 'Daily Standup', date: '2026-06-04', time: '9:45am', durationMinutes: 15, host: 'Aditya Jain', attendees: [{ name: 'Aditya Jain' }, { name: 'Kiran Rao' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-s05', title: 'UI Discussion', date: '2026-06-05', time: '11:00am', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Aditya Jain' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Design' },
  { id: 'cal-s06', title: 'Investor Review', date: '2026-06-06', time: '3:00pm', durationMinutes: 90, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }, { name: 'Board Member' }], category: 'board', platform: 'GOOGLE', meetingType: 'Board' },
  { id: 'cal-s07', title: 'Team Sync', date: '2026-06-06', time: '9:45am', durationMinutes: 30, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Meera Joshi' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Team Sync' },
  { id: 'cal-s08', title: 'Compliance Meeting', date: '2026-06-09', time: '10:30am', durationMinutes: 45, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }, { name: 'Legal Team' }], category: 'compliance', platform: 'GOOGLE', meetingType: 'Compliance' },
  { id: 'cal-s09', title: 'Product Review', date: '2026-06-09', time: '12:00pm', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Product Team' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-s10', title: 'Daily Standup', date: '2026-06-10', time: '9:30am', durationMinutes: 15, host: 'Raj Mehta', attendees: [{ name: 'Raj Mehta' }, { name: 'Arjun Patel' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-s11', title: 'Sales Sync', date: '2026-06-11', time: '4:30pm', durationMinutes: 45, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Sales Team' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Sales' },
  { id: 'cal-s12', title: 'Engineering Weekly', date: '2026-06-11', time: '10:00am', durationMinutes: 60, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Aditya Jain' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Engineering' },
  { id: 'cal-s13', title: '1:1 with Anita', date: '2026-06-12', time: '11:00am', durationMinutes: 30, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'personal', platform: 'GOOGLE', meetingType: '1:1' },
  { id: 'cal-s14', title: 'Board Review', date: '2026-06-13', time: '2:00pm', durationMinutes: 120, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Board' }], category: 'board', platform: 'GOOGLE', meetingType: 'Board' },
  { id: 'cal-s15', title: 'Daily Standup', date: '2026-06-16', time: '9:45am', durationMinutes: 15, host: 'Kiran Rao', attendees: [{ name: 'Kiran Rao' }, { name: 'Team' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-s16', title: 'Leadership Sync', date: '2026-06-17', time: '9:00am', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Leadership' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Leadership' },
  { id: 'cal-s17', title: 'Q2 Business Review', date: '2026-06-17', time: '1:00pm', durationMinutes: 90, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }, { name: 'Gyanpriya Misra' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-s18', title: 'Client Review', date: '2026-06-18', time: '12:00pm', durationMinutes: 60, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Client' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Client' },
  { id: 'cal-s19', title: 'Test MEET AI Daily', date: '2026-06-18', time: '12:00pm', durationMinutes: 30, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Meeting' },
  { id: 'cal-s20', title: 'Daily Standup Call', date: '2026-06-18', time: '4:30pm', durationMinutes: 15, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Team' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-s21', title: 'Sprint Planning', date: '2026-06-19', time: '10:30am', durationMinutes: 90, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Engineering' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Planning' },
  { id: 'cal-s22', title: 'Team Sync', date: '2026-06-20', time: '9:45am', durationMinutes: 30, host: 'Aditya Jain', attendees: [{ name: 'Aditya Jain' }, { name: 'Design' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Team Sync' },
  { id: 'cal-s23', title: 'Investor Review', date: '2026-06-23', time: '3:00pm', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Investors' }], category: 'board', platform: 'GOOGLE', meetingType: 'Investor' },
  { id: 'cal-s24', title: 'Compliance Meeting', date: '2026-06-24', time: '11:00am', durationMinutes: 45, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }], category: 'compliance', platform: 'GOOGLE', meetingType: 'Compliance' },
  { id: 'cal-s25', title: 'Product Review', date: '2026-06-24', time: '2:00pm', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'PM Team' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-s26', title: 'Daily Standup', date: '2026-06-25', time: '9:30am', durationMinutes: 15, host: 'Raj Mehta', attendees: [{ name: 'Raj Mehta' }, { name: 'Team' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-s27', title: 'Sales Sync', date: '2026-06-26', time: '4:00pm', durationMinutes: 45, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Sales' },
  { id: 'cal-s28', title: 'Engineering Weekly', date: '2026-06-26', time: '10:00am', durationMinutes: 60, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Eng Team' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Engineering' },
  { id: 'cal-s29', title: 'Focus Time', date: '2026-06-27', time: '9:00am', durationMinutes: 120, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }], category: 'personal', platform: 'MANUAL', meetingType: 'Personal' },
  { id: 'cal-s30', title: 'Leadership Sync', date: '2026-06-30', time: '9:00am', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Leadership' },
  // Adjacent month spill for grid context
  { id: 'cal-s31', title: 'Month Close Review', date: '2026-07-01', time: '10:00am', durationMinutes: 60, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-s32', title: 'Team Kickoff', date: '2026-05-29', time: '11:00am', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Meeting' },
  // Executive calendar — realistic enterprise spread across June 2026
  { id: 'cal-ex01', title: 'Leadership Review', date: '2026-06-01', time: '9:00am', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }, { name: 'Vikram Singh' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex02', title: 'Weekly Standup', date: '2026-06-02', time: '9:30am', durationMinutes: 15, host: 'Aditya Jain', attendees: [{ name: 'Aditya Jain' }, { name: 'Kiran Rao' }, { name: 'Meera Joshi' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-ex03', title: 'Product Demo', date: '2026-06-05', time: '2:00pm', durationMinutes: 45, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Gyanpriya Misra' }, { name: 'Product Team' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex04', title: 'Board Meeting', date: '2026-06-06', time: '11:00am', durationMinutes: 120, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Board Members' }], category: 'board', platform: 'GOOGLE', meetingType: 'Board' },
  { id: 'cal-ex05', title: 'Client Call — Tata Power', date: '2026-06-07', time: '3:30pm', durationMinutes: 60, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Raj Mehta' }, { name: 'Client Lead' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Client' },
  { id: 'cal-ex06', title: 'Engineering Sync', date: '2026-06-08', time: '10:00am', durationMinutes: 45, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Aditya Jain' }, { name: 'Arjun Patel' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex07', title: 'Design Review', date: '2026-06-08', time: '4:00pm', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Design Team' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex08', title: 'Budget Planning', date: '2026-06-10', time: '11:00am', durationMinutes: 90, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }, { name: 'Gyanpriya Misra' }, { name: 'Finance' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex09', title: 'Quarterly Strategy', date: '2026-06-12', time: '9:00am', durationMinutes: 120, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Leadership Team' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex10', title: 'Hiring Interview — VP Engineering', date: '2026-06-12', time: '2:30pm', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Vikram Singh' }, { name: 'Candidate' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex11', title: 'Weekly Standup', date: '2026-06-13', time: '9:30am', durationMinutes: 15, host: 'Kiran Rao', attendees: [{ name: 'Kiran Rao' }, { name: 'Team' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
  { id: 'cal-ex12', title: 'Client Call — Adani Green', date: '2026-06-14', time: '12:00pm', durationMinutes: 60, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Sales Team' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Client' },
  { id: 'cal-ex13', title: 'AI Review', date: '2026-06-15', time: '12:00pm', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Aditya Jain' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex14', title: 'Leadership Review', date: '2026-06-16', time: '9:00am', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex15', title: 'Engineering Sync', date: '2026-06-16', time: '3:00pm', durationMinutes: 45, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Eng Team' }], category: 'engineering', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex16', title: 'Product Demo', date: '2026-06-19', time: '11:00am', durationMinutes: 45, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Gyanpriya Misra' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex17', title: 'Board Meeting — Q2 Close', date: '2026-06-20', time: '10:00am', durationMinutes: 90, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Board' }], category: 'board', platform: 'GOOGLE', meetingType: 'Board' },
  { id: 'cal-ex18', title: 'Design Review', date: '2026-06-22', time: '4:30pm', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Design' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex19', title: 'Budget Planning', date: '2026-06-23', time: '9:30am', durationMinutes: 90, host: 'Anita Desai', attendees: [{ name: 'Anita Desai' }, { name: 'CFO Office' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex20', title: 'Quarterly Strategy', date: '2026-06-25', time: '9:00am', durationMinutes: 120, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Exec Team' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex21', title: 'Hiring Interview — Director Product', date: '2026-06-27', time: '11:30am', durationMinutes: 60, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Neha Kapoor' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex22', title: 'Team Sync', date: '2026-06-29', time: '9:30am', durationMinutes: 30, host: 'Vikram Singh', attendees: [{ name: 'Vikram Singh' }, { name: 'Aditya Jain' }], category: 'meeting', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex23', title: 'AI Review', date: '2026-06-29', time: '1:00pm', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'AI Team' }], category: 'review', platform: 'GOOGLE', meetingType: 'Review' },
  { id: 'cal-ex24', title: 'Client Call — Reliance', date: '2026-06-29', time: '3:00pm', durationMinutes: 60, host: 'Neha Kapoor', attendees: [{ name: 'Neha Kapoor' }, { name: 'Raj Mehta' }], category: 'sales', platform: 'GOOGLE', meetingType: 'Client' },
  { id: 'cal-ex25', title: 'Leadership Review', date: '2026-06-29', time: '5:00pm', durationMinutes: 45, host: 'Gyanpriya Misra', attendees: [{ name: 'Gyanpriya Misra' }, { name: 'Anita Desai' }], category: 'leadership', platform: 'GOOGLE', meetingType: 'Internal' },
  { id: 'cal-ex26', title: 'Weekly Standup', date: '2026-06-30', time: '9:30am', durationMinutes: 15, host: 'Aditya Jain', attendees: [{ name: 'Aditya Jain' }, { name: 'Team' }], category: 'standup', platform: 'GOOGLE', meetingType: 'Standup' },
]

const meetingEvents = mockMeetings
  .map((m) => meetingToEvent(m))
  .filter((e) => !scheduleDates.has(e.date))

/** De-dupe by id — schedule events take highest precedence for Week/Day richness. */
const byId = new Map<string, CalendarEvent>()
const supplementalFiltered = supplementalEvents.filter((e) => !scheduleDates.has(e.date))
for (const e of [...supplementalFiltered, ...meetingEvents, ...mockScheduleEvents]) {
  byId.set(e.id, e)
}

export const mockCalendarEvents: CalendarEvent[] = [...byId.values()]

export function getCalendarEvents(): CalendarEvent[] {
  return mockCalendarEvents
}
