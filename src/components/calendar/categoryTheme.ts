import type { CalendarBlockType, CalendarEventCategory } from '../../types/calendar'

export const CALENDAR_CATEGORIES: { value: CalendarEventCategory; label: string }[] = [
  { value: 'meeting', label: 'Meetings' },
  { value: 'standup', label: 'Standups' },
  { value: 'review', label: 'Reviews' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'personal', label: 'Personal' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  { value: 'board', label: 'Board' },
]

export interface CategoryTheme {
  label: string
  dot: string
  wash: string
  border: string
  text: string
  stripe: string
}

const themes: Record<CalendarEventCategory, CategoryTheme> = {
  meeting: { label: 'Meeting', dot: 'bg-brand-teal', wash: 'bg-surface-accent', border: 'border-brand-teal/25', text: 'text-brand-teal', stripe: 'border-l-brand-teal' },
  standup: { label: 'Standup', dot: 'bg-brand-teal', wash: 'bg-surface-accent', border: 'border-brand-teal/25', text: 'text-brand-teal', stripe: 'border-l-brand-teal' },
  review: { label: 'Review', dot: 'bg-status-warning', wash: 'bg-status-warningMuted', border: 'border-status-warning/25', text: 'text-status-warning', stripe: 'border-l-status-warning' },
  leadership: { label: 'Leadership', dot: 'bg-coral', wash: 'bg-coral-muted', border: 'border-coral/25', text: 'text-coral', stripe: 'border-l-coral' },
  personal: { label: 'Personal', dot: 'bg-status-warning', wash: 'bg-status-warningMuted', border: 'border-status-warning/25', text: 'text-status-warning', stripe: 'border-l-status-warning' },
  compliance: { label: 'Compliance', dot: 'bg-coral', wash: 'bg-coral-muted', border: 'border-coral/25', text: 'text-coral', stripe: 'border-l-coral' },
  engineering: { label: 'Engineering', dot: 'bg-brand-teal', wash: 'bg-surface-accent', border: 'border-brand-teal/25', text: 'text-brand-teal', stripe: 'border-l-brand-teal' },
  sales: { label: 'Sales', dot: 'bg-status-warning', wash: 'bg-status-warningMuted', border: 'border-status-warning/25', text: 'text-status-warning', stripe: 'border-l-status-warning' },
  board: { label: 'Board', dot: 'bg-coral', wash: 'bg-coral-muted', border: 'border-coral/25', text: 'text-coral', stripe: 'border-l-coral' },
}

export function getCategoryTheme(category: CalendarEventCategory): CategoryTheme {
  return themes[category]
}

export function getBlockLabel(blockType?: CalendarBlockType): string {
  if (blockType === 'focus') return 'Focus time'
  if (blockType === 'lunch') return 'Lunch'
  if (blockType === 'break') return 'Break'
  return 'Meeting'
}

export function isCalendarBlock(blockType?: CalendarBlockType): boolean {
  return blockType === 'focus' || blockType === 'lunch' || blockType === 'break'
}
