import type { ActionItem } from '../types/actionItem'
import { TODAY } from './constants'

export type { ActionItem, ActionItemStatus } from '../types/actionItem'

export const mockActionItems: ActionItem[] = [
  {
    id: 'a1',
    meetingTitle: 'AvaadaMeet - UI Discussion',
    date: '2026-06-29',
    time: '11:40am',
    actionsCount: 1,
    openCount: 1,
    status: 'Pending',
  },
  {
    id: 'a2',
    meetingTitle: 'Team Meeting',
    date: '2026-06-29',
    time: '2:30pm',
    actionsCount: 1,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a3',
    meetingTitle: 'Stand-up Call',
    date: '2026-06-29',
    time: '5:00pm',
    actionsCount: 2,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a4',
    meetingTitle: 'Daily updates',
    date: '2026-06-29',
    time: '9:30am',
    actionsCount: 2,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a5',
    meetingTitle: 'Daily Standup Call',
    date: '2026-06-29',
    time: '3:30pm',
    actionsCount: 2,
    openCount: 2,
    status: 'In Process',
  },
  {
    id: 'a6',
    meetingTitle: 'Q3 Budget Review Follow-up',
    date: '2026-06-28',
    time: '10:00am',
    actionsCount: 2,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a7',
    meetingTitle: 'Vendor Contract Sign-off',
    date: '2026-06-27',
    time: '2:00pm',
    actionsCount: 1,
    openCount: 1,
    status: 'Pending',
  },
  {
    id: 'a8',
    meetingTitle: 'Hiring Panel Debrief',
    date: '2026-06-26',
    time: '4:00pm',
    actionsCount: 3,
    openCount: 2,
    status: 'In Process',
  },
  {
    id: 'a9',
    meetingTitle: 'Solar Expansion — Site Visit Notes',
    date: '2026-06-25',
    time: '11:00am',
    actionsCount: 1,
    openCount: 1,
    status: 'Pending',
  },
  {
    id: 'a10',
    meetingTitle: 'Investor Q&A Prep',
    date: '2026-06-24',
    time: '9:00am',
    actionsCount: 2,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a11',
    meetingTitle: 'ESG Disclosure Draft Review',
    date: '2026-06-23',
    time: '1:30pm',
    actionsCount: 1,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a12',
    meetingTitle: 'Board Materials Distribution',
    date: '2026-06-22',
    time: '3:00pm',
    actionsCount: 2,
    openCount: 1,
    status: 'Pending',
  },
  {
    id: 'a13',
    meetingTitle: 'Partnership Term Sheet — Tata Power',
    date: '2026-06-21',
    time: '10:30am',
    actionsCount: 1,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a14',
    meetingTitle: 'Manufacturing KPI Review',
    date: '2026-06-20',
    time: '11:00am',
    actionsCount: 2,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a15',
    meetingTitle: 'Compliance Audit Response',
    date: '2026-06-19',
    time: '2:00pm',
    actionsCount: 1,
    openCount: 1,
    status: 'Blocked',
  },
  {
    id: 'a16',
    meetingTitle: 'Green Hydrogen Pilot — Safety Sign-off',
    date: '2026-06-18',
    time: '9:30am',
    actionsCount: 2,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a17',
    meetingTitle: 'Annual Report — Executive Summary',
    date: '2026-06-17',
    time: '4:30pm',
    actionsCount: 1,
    openCount: 1,
    status: 'Pending',
  },
  {
    id: 'a18',
    meetingTitle: 'Wind Farm Commissioning Handover',
    date: '2026-06-16',
    time: '10:00am',
    actionsCount: 2,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a19',
    meetingTitle: 'Regulatory Filing — Extension Request',
    date: '2026-06-15',
    time: '1:00pm',
    actionsCount: 1,
    openCount: 1,
    status: 'Blocked',
  },
  {
    id: 'a20',
    meetingTitle: 'Supply Chain Risk Mitigation Plan',
    date: '2026-06-14',
    time: '11:30am',
    actionsCount: 2,
    openCount: 1,
    status: 'In Process',
  },
  {
    id: 'a21',
    meetingTitle: 'Customer Escalation — Grid Connection Delay',
    date: '2026-06-13',
    time: '3:30pm',
    actionsCount: 1,
    openCount: 1,
    status: 'Blocked',
  },
  {
    id: 'a22',
    meetingTitle: 'Leadership Offsite — Action Capture',
    date: '2026-06-12',
    time: '5:00pm',
    actionsCount: 3,
    openCount: 2,
    status: 'Pending',
  },
  {
    id: 'a23',
    meetingTitle: 'Q1 Retrospective',
    date: '2026-06-10',
    time: '3:00pm',
    actionsCount: 2,
    openCount: 0,
    status: 'Done',
  },
  {
    id: 'a24',
    meetingTitle: 'Sprint Planning',
    date: '2026-06-08',
    time: '11:00am',
    actionsCount: 1,
    openCount: 0,
    status: 'Done',
  },
]

export const STATUS_ORDER: ActionItem['status'][] = [
  'Blocked',
  'Pending',
  'In Process',
  'Done',
]

export function getOpenActionCount(): number {
  return mockActionItems.filter((a) => a.status !== 'Done').length
}

export function getOpenActionStats(): { total: number; overdue: number; dueToday: number } {
  const open = mockActionItems.filter((a) => a.status !== 'Done')
  const overdue = open.filter((a) => a.date < TODAY).length
  const dueToday = open.filter((a) => a.date === TODAY).length
  return { total: open.length, overdue, dueToday }
}

export function sortActionItems(items: ActionItem[]): ActionItem[] {
  return [...items].sort((a, b) => {
    const statusDiff = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    if (statusDiff !== 0) return statusDiff
    return `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)
  })
}
